# velo-backend/models.py
from .app import db
from flask_bcrypt import Bcrypt
from datetime import datetime

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    _password = db.Column(db.String(255), nullable=False)  
    role = db.Column(db.String(20), nullable=False)      
    ville = db.Column(db.String(100))

    bcrypt = Bcrypt()

    @property
    def password(self):
        raise AttributeError("Password is not readable")

    @password.setter
    def password(self, plaintext_password):
        self._password = self.bcrypt.generate_password_hash(plaintext_password).decode('utf-8')

    def check_password(self, plaintext_password):
        return self.bcrypt.check_password_hash(self._password, plaintext_password)

    def __repr__(self):
        return f'<User {self.email}>'

class Pro(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    nom = db.Column(db.String(100), nullable=False)
    adresse = db.Column(db.String(200))
    types_reparation = db.Column(db.String(200))  # ex: "freins,pneus,roues"

class Dispo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    pro_id = db.Column(db.Integer, db.ForeignKey('pro.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    heure = db.Column(db.String(5), nullable=False)  # "09:00"
    disponible = db.Column(db.Boolean, default=True)

class RDV(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    pro_id = db.Column(db.Integer, db.ForeignKey('pro.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    heure = db.Column(db.String(5), nullable=False)
    status = db.Column(db.String(20), default='pending')  # pending, confirmed, cancelled