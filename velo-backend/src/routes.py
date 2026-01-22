from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from .app import db
from .model import Pro, User, Dispo, RDV

api_bp = Blueprint('api', __name__, url_prefix='/api')

@api_bp.route('/hello', methods=['GET'])
def hello():
    return {"message": "Hello from API !"}, 200

@api_bp.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user_id = get_jwt_identity()
    claims = get_jwt()

    return jsonify({
        "message": "Route protégée OK",
        "user_id": current_user_id,
        "email": claims.get('email'),
        "role": claims.get('role'),
        "ville": claims.get('ville'),
    }), 200

@api_bp.route('/register', methods=['POST'])
def create_user():
    data = request.get_json()

    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Email et password requis"}), 400

    # Verify if email already exists
    existing = User.query.filter_by(email=data['email']).first()
    if existing:
        return jsonify({"error": "Email déjà utilisé"}), 409

    new_user = User(
        email=data.get('email'),
        role=data.get('role', 'user'),
        ville=data.get('ville')
    )

    new_user.password = data['password']

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User créé", "id": new_user.id}), 201

@api_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Email et password requis"}), 400

    user = User.query.filter_by(email=data['email']).first()
    if not user:
        return jsonify({"error": "Email ou mot de passe incorrect"}), 401

    if not user.check_password(data['password']):
        return jsonify({"error": "Email ou mot de passe incorrect"}), 401

    # Generate JWT token 
    access_token = create_access_token(
        identity= str(user.id),
        additional_claims={
            'email': user.email,
            'role': user.role,
            'ville': user.ville
        },
        expires_delta=timedelta(hours=24)
    )

    return jsonify({
        "message": "Connexion réussie",
        "access_token": access_token,
        "user": {
            "id": user.id,
            "email": user.email,
            "role": user.role,
            "ville": user.ville
        }
    }), 200

@api_bp.route('/pros', methods=['GET'])
def get_pros():
    ville = request.args.get('ville')
    type_rep = request.args.get('type')

    limit = request.args.get('limit', type=int)

    query = Pro.query
    if limit:
        query = query.limit(limit)
    if ville:
        query = query.join(User).filter(User.ville.ilike(f'%{ville}%'))
    if type_rep:
        query = query.filter(Pro.types_reparation.ilike(f'%{type_rep}%'))

    pros = query.all()
    return jsonify([{
        "id": p.id,
        "nom": p.nom,
        "adresse": p.adresse,
        "types_reparation": p.types_reparation.split(',') if p.types_reparation else []
    } for p in pros]), 200

@api_bp.route('/pros/<int:pro_id>', methods=['GET'])
def get_pro(pro_id):
    pro = Pro.query.get(pro_id)
    if not pro:
        return jsonify({"error": "Professional not found"}), 404

    user = User.query.get(pro.user_id)

    return jsonify({
        "id": pro.id,
        "nom": pro.nom,
        "adresse": pro.adresse,
        "types_reparation": pro.types_reparation.split(',') if pro.types_reparation else [],
        "ville": user.ville if user else None,
        "email": user.email if user else None
    }), 200

@api_bp.route('/pros/<int:pro_id>/dispos', methods=['GET'])
def get_pro_dispos(pro_id):
    pro = Pro.query.get(pro_id)
    if not pro:
        return jsonify({"error": "Professional not found"}), 404

    dispos = Dispo.query.filter_by(pro_id=pro_id).all()

    return jsonify([{
        "id": d.id,
        "date": d.date.isoformat(),
        "heure": d.heure,
        "disponible": d.disponible
    } for d in dispos]), 200

@api_bp.route('/dispos', methods=['POST'])
@jwt_required()
def add_dispo():

    current_user_id = int(get_jwt_identity())

    pro = Pro.query.filter_by(user_id=current_user_id).first()
    if not pro:
        return jsonify({"error": "Profil professionnel non trouvé. Créez-en un d'abord"}), 404

    data = request.get_json()
    if not data or not data.get('date') or not data.get('heure'):
        return jsonify({"error": "Date et heure obligatoires"}), 400

    try:
        new_date = datetime.strptime(data['date'], '%Y-%m-%d').date()
    except ValueError:
        return jsonify({"error": "Format de date invalide (attendu YYYY-MM-DD)"}), 400

    if not data['heure'].count(':') == 1 or len(data['heure']) != 5:
        return jsonify({"error": "Format d'heure invalide (attendu HH:MM)"}), 400

    new_dispo = Dispo(
        pro_id=pro.id,
        date=new_date,
        heure=data['heure'],
        disponible=True
    )

    db.session.add(new_dispo)
    db.session.commit()

    return jsonify({
        "message": "Disponibilité ajoutée",
        "dispo": {
            "id": new_dispo.id,
            "date": new_dispo.date.isoformat(),
            "heure": new_dispo.heure,
            "disponible": new_dispo.disponible
        }
    }), 201

@api_bp.route('/pros', methods=['POST'])
@jwt_required()
def create_pro():

    user_id_str = get_jwt_identity()
    user_id = int(user_id_str)

    current_user = User.query.get(user_id)

    if not current_user:
        return jsonify({"error": "User not found"}), 404

    if current_user.role != 'pro':
        return jsonify({"error": "Only 'pro' role can create a professional profile"}), 403

    data = request.get_json()
    if not data or not data.get('nom') or not data.get('adresse'):
        return jsonify({"error": "Name and address required"}), 400

    # Check if user already has a pro profile
    existing = Pro.query.filter_by(user_id=user_id).first()
    if existing:
        return jsonify({"error": "Professional profile already exists"}), 409

    new_pro = Pro(
        user_id=user_id,
        nom=data['nom'],
        adresse=data['adresse'],
        types_reparation=','.join(data.get('types_reparation', []))
    )

    db.session.add(new_pro)
    db.session.commit()

    return jsonify({
        "message": "Professional profile created",
        "pro": {
            "id": new_pro.id,
            "nom": new_pro.nom,
            "adresse": new_pro.adresse,
            "types_reparation": new_pro.types_reparation.split(',')
        }
    }), 201

@api_bp.route('/rdv', methods=['POST'])
@jwt_required()
def book_rdv():
    current_user_id = int(get_jwt_identity())

    data = request.get_json()
    if not data or not data.get('dispo_id'):
        return jsonify({"error": "dispo_id requis"}), 400

    dispo_id = data['dispo_id']
    dispo = Dispo.query.get(dispo_id)

    if not dispo:
        return jsonify({"error": "Créneau non trouvé"}), 404

    if not dispo.disponible:
        return jsonify({"error": "Créneau déjà réservé"}), 409

    pro = Pro.query.get(dispo.pro_id)
    if not pro:
        return jsonify({"error": "Professionnel non trouvé"}), 404

    new_rdv = RDV(
        user_id=current_user_id,
        pro_id=pro.id,
        date=dispo.date,
        heure=dispo.heure,
        status='pending'
    )

    dispo.disponible = False

    db.session.add(new_rdv)
    db.session.commit()

    return jsonify({
        "message": "RDV réservé avec succès",
        "rdv_id": new_rdv.id,
        "date": new_rdv.date.isoformat(),
        "heure": new_rdv.heure,
        "pro_nom": pro.nom
    }), 201

@api_bp.route('/mes-rdv', methods=['GET'])
@jwt_required()
def get_my_rdv():
    """
    Liste des RDV de l'utilisateur connecté.
    """
    current_user_id = int(get_jwt_identity())

    rdvs = RDV.query.filter_by(user_id=current_user_id).all()

    return jsonify([{
        "id": r.id,
        "pro_nom": Pro.query.get(r.pro_id).nom if Pro.query.get(r.pro_id) else "Pro inconnu",
        "date": r.date.isoformat(),
        "heure": r.heure,
        "status": r.status,
        "created_at": r.created_at.isoformat() if hasattr(r, 'created_at') else None
    } for r in rdvs]), 200

@api_bp.route('/rdv/<int:rdv_id>', methods=['DELETE'])
@jwt_required()
def cancel_rdv(rdv_id):
    current_user_id = int(get_jwt_identity())

    rdv = RDV.query.get(rdv_id)
    if not rdv:
        return jsonify({"error": "RDV non trouvé"}), 404

    if rdv.user_id != current_user_id:
        return jsonify({"error": "Ce RDV ne vous appartient pas"}), 403

    if rdv.status == 'cancelled':
        return jsonify({"error": "RDV déjà annulé"}), 400

    # Rendre la dispo libre à nouveau
    dispo = Dispo.query.filter_by(
        pro_id=rdv.pro_id,
        date=rdv.date,
        heure=rdv.heure
    ).first()
    if dispo:
        dispo.disponible = True

    rdv.status = 'cancelled'

    db.session.commit()

    return jsonify({"message": "RDV annulé avec succès"}), 200