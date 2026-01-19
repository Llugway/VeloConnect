from datetime import timedelta
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from .app import db
from .model import Pro, User

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

@api_bp.route('/pros', methods=['POST'])
@jwt_required()
def create_pro():

    """
    Create a professional profile linked to the authenticated user.
    Only allowed for users with role 'pro'.
    """

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