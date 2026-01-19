from flask import Blueprint, request, jsonify
from .app import db
from .model import User

api_bp = Blueprint('api', __name__, url_prefix='/api')

@api_bp.route('/hello', methods=['GET'])
def hello():
    return {"message": "Hello from API !"}, 200

@api_bp.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()

    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Email et password requis"}), 400

    # Vérifie si l'email existe déjà (simple)
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