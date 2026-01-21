from datetime import date, timedelta
from .model import User, Pro, Dispo, RDV
from flask_bcrypt import Bcrypt

def seed(app,db):

    bcrypt = Bcrypt(app)
    with app.app_context():
        print("Suppression et recréation des tables...")
        db.drop_all()
        db.create_all()

        # Utilisateurs
        users = [
            User(
                email="alice.dupont@gmail.com",
                password=bcrypt.generate_password_hash("alice123").decode('utf-8'),
                role="user",
                ville="Bordeaux"
            ),
            User(
                email="thomas.martin@gmail.com",
                password=bcrypt.generate_password_hash("thomas123").decode('utf-8'),
                role="user",
                ville="Pessac"
            ),
            User(
                email="veloatelier.bdx@gmail.com",
                password=bcrypt.generate_password_hash("pro123").decode('utf-8'),
                role="pro",
                ville="Bordeaux"
            ),
            User(
                email="cyclesport.merignac@gmail.com",
                password=bcrypt.generate_password_hash("pro123").decode('utf-8'),
                role="pro",
                ville="Mérignac"
            ),
            User(
                email="reparvelo33@gmail.com",
                password=bcrypt.generate_password_hash("pro123").decode('utf-8'),
                role="pro",
                ville="Talence"
            )
        ]
        db.session.bulk_save_objects(users)
        db.session.commit()

        # Récupération des pros
        pro1 = User.query.filter_by(email="veloatelier.bdx@gmail.com").first()
        pro2 = User.query.filter_by(email="cyclesport.merignac@gmail.com").first()
        pro3 = User.query.filter_by(email="reparvelo33@gmail.com").first()

        pros = [
            Pro(
                user_id=pro1.id,
                nom="Vélo Atelier Bordeaux",
                adresse="12 Rue Sainte-Catherine, 33000 Bordeaux",
                types_reparation="freins,pneus,chaîne,cadre,électrique"
            ),
            Pro(
                user_id=pro2.id,
                nom="Cycle Sport Mérignac",
                adresse="Avenue de l'Argonne, 33700 Mérignac",
                types_reparation="vtt,route,gravel,course,cadre carbone"
            ),
            Pro(
                user_id=pro3.id,
                nom="Répar Vélo 33",
                adresse="Rue des Faures, 33400 Talence",
                types_reparation="freins,pneus,éclairage,voyage,urbain"
            )
        ]
        db.session.bulk_save_objects(pros)
        db.session.commit()

        # Dispos réalistes (7 jours à venir, 3 créneaux par jour pour chaque pro)
        today = date.today()
        for pro in pros:
            for day_offset in range(7):
                for hour in ["09:00", "14:00", "17:30"]:
                    dispo = Dispo(
                        pro_id=pro.id,
                        date=today + timedelta(days=day_offset),
                        heure=hour,
                        disponible=True
                    )
                    db.session.add(dispo)

        db.session.commit()

        # Quelques RDV pour Alice et Thomas
        alice = User.query.filter_by(email="alice.dupont@gmail.com").first()
        thomas = User.query.filter_by(email="thomas.martin@gmail.com").first()

        rdv1 = RDV(
            user_id=alice.id,
            pro_id=pros[0].id,
            date=today + timedelta(days=2),
            heure="14:00",
            status="pending"
        )
        rdv2 = RDV(
            user_id=thomas.id,
            pro_id=pros[1].id,
            date=today + timedelta(days=3),
            heure="17:30",
            status="confirmed"
        )

        db.session.add_all([rdv1, rdv2])

        # Marquer les dispos correspondantes comme non-disponibles
        for r in [rdv1, rdv2]:
            dispo = Dispo.query.filter_by(
                pro_id=r.pro_id,
                date=r.date,
                heure=r.heure
            ).first()
            if dispo:
                dispo.disponible = False

        db.session.commit()

        print("Base de données réaliste créée !")
        print(f"Utilisateurs test :")
        print("  • alice.dupont@gmail.com / alice123 (user)")
        print("  • thomas.martin@gmail.com / thomas123 (user)")
        print("Pros :")
        print("  • veloatelier.bdx@gmail.com / pro123")
        print("  • cyclesport.merignac@gmail.com / pro123")
        print("  • reparvelo33@gmail.com / pro123")
        print("RDV créés : 2 (un pending, un confirmed)")

