from .app import create_app, db
from .models import User, Pro, Dispo, RDV
from flask_bcrypt import Bcrypt
from datetime import date, timedelta

app = create_app('development')
bcrypt = Bcrypt(app)

def seed_data():
    with app.app_context():
        print("Suppression des données existantes...")
        db.drop_all()
        db.create_all()

        # Création d'un user normal
        user_normal = User(
            email="user@test.com",
            password=bcrypt.generate_password_hash("123456").decode('utf-8'),
            role="user",
            ville="Bordeaux"
        )
        db.session.add(user_normal)

        # Création d'un pro
        user_pro = User(
            email="pro@test.com",
            password=bcrypt.generate_password_hash("123456").decode('utf-8'),
            role="pro",
            ville="Bordeaux"
        )
        db.session.add(user_pro)
        db.session.commit()  # On commit pour avoir les IDs

        # Profil pro
        pro = Pro(
            user_id=user_pro.id,
            nom="VéloPro Bordeaux",
            adresse="12 rue Sainte-Catherine, 33000 Bordeaux",
            types_reparation="Freins,Pneus,Changement de chaîne,Cadre"
        )
        db.session.add(pro)
        db.session.commit()

        # Ajout de 5 dispos sur les 5 prochains jours
        today = date.today()
        for i in range(5):
            dispo = Dispo(
                pro_id=pro.id,
                date=today + timedelta(days=i),
                heure="14:00",
                disponible=True
            )
            db.session.add(dispo)

        # Un RDV déjà réservé (pour tester le statut réservé)
        rdv_test = RDV(
            user_id=user_normal.id,
            pro_id=pro.id,
            date=today + timedelta(days=2),
            heure="14:00",
            status="confirmed"
        )
        db.session.add(rdv_test)

        # Marquer la dispo correspondante comme réservée
        dispo_reserve = Dispo.query.filter_by(
            pro_id=pro.id,
            date=today + timedelta(days=2),
            heure="14:00"
        ).first()
        if dispo_reserve:
            dispo_reserve.disponible = False

        db.session.commit()

        print("Données de test créées avec succès !")
        print(f"User normal    : user@test.com / 123456")
        print(f"User pro        : pro@test.com / 123456")
        print(f"Pro créé        : VéloPro Bordeaux (ID: {pro.id})")
        print(f"Dispos créées   : 5 créneaux (dont 1 réservé)")
        print(f"RDV test créé   : ID {rdv_test.id}")

if __name__ == '__main__':
    seed_data()