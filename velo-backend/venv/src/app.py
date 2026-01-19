from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///velo.db'
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET', 'super-secret-key')  # Change in prod
db = SQLAlchemy(app)
CORS(app)
jwt = JWTManager(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)  # Hash in prod (bcrypt)
    role = db.Column(db.String(20), nullable=False)  # 'user' or 'pro'
    ville = db.Column(db.String(100))

class Pro(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    nom = db.Column(db.String(100), nullable=False)
    adresse = db.Column(db.String(200))
    types_reparation = db.Column(db.String(200))  # CSV: 'freins,pneus'

class Dispo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    pro_id = db.Column(db.Integer, db.ForeignKey('pro.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    heure = db.Column(db.String(5), nullable=False)  # '09:00'
    disponible = db.Column(db.Boolean, default=True)

class RDV(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    pro_id = db.Column(db.Integer, db.ForeignKey('pro.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    heure = db.Column(db.String(5), nullable=False)

# Routes
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    # Simplifié : no hash, prod use bcrypt
    new_user = User(email=data['email'], password=data['password'], role=data['role'], ville=data.get('ville'))
    db.session.add(new_user)
    db.session.commit()
    if data['role'] == 'pro':
        new_pro = Pro(user_id=new_user.id, nom=data['nom'], adresse=data['adresse'], types_reparation=','.join(data['types_reparation']))
        db.session.add(new_pro)
        db.session.commit()
    token = create_access_token(identity=new_user.id)
    return jsonify(token=token), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email'], password=data['password']).first()  # Prod: hash check
    if user:
        token = create_access_token(identity=user.id)
        return jsonify(token=token, role=user.role)
    return jsonify(msg='Invalid credentials'), 401

@app.route('/pros', methods=['GET'])
@jwt_required(optional=True)  # Public search
def get_pros():
    ville = request.args.get('ville')
    type_rep = request.args.get('type')
    query = Pro.query
    if ville:
        query = query.join(User).filter(User.ville.ilike(f'%{ville}%'))
    if type_rep:
        query = query.filter(Pro.types_reparation.ilike(f'%{type_rep}%'))
    pros = query.all()
    return jsonify([{'id': p.id, 'nom': p.nom, 'adresse': p.adresse, 'types': p.types_reparation.split(',')} for p in pros])

@app.route('/dispos/<int:pro_id>', methods=['GET'])
def get_dispos(pro_id):
    dispos = Dispo.query.filter_by(pro_id=pro_id).all()
    return jsonify([{'id': d.id, 'date': d.date.isoformat(), 'heure': d.heure, 'disponible': d.disponible} for d in dispos])

@app.route('/dispos', methods=['POST'])
@jwt_required()
def add_dispo():
    data = request.json
    user_id = get_jwt_identity()
    pro = Pro.query.filter_by(user_id=user_id).first()
    if not pro:
        return jsonify(msg='Not a pro'), 403
    new_dispo = Dispo(pro_id=pro.id, date=datetime.strptime(data['date'], '%Y-%m-%d').date(), heure=data['heure'])
    db.session.add(new_dispo)
    db.session.commit()
    return jsonify(msg='Dispo added'), 201

@app.route('/rdv', methods=['POST'])
@jwt_required()
def book_rdv():
    data = request.json
    user_id = get_jwt_identity()
    dispo = Dispo.query.get(data['dispo_id'])
    if not dispo or not dispo.disponible:
        return jsonify(msg='Slot unavailable'), 400
    dispo.disponible = False
    new_rdv = RDV(user_id=user_id, pro_id=dispo.pro_id, date=dispo.date, heure=dispo.heure)
    db.session.add(new_rdv)
    db.session.commit()
    return jsonify(msg='RDV booked'), 201

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create DB if not exists
    app.run(debug=True)