# velo-backend/app.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from .config import config

# Instances globales
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app(config_name='default'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)

    # Initialisation des extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app)  # À affiner plus tard avec origins spécifiques

    # Import des models (après db.init_app !)
    from .model import User, Pro, Dispo, RDV

    # Import des routes/blueprints
    from .routes import api_bp
    
    app.register_blueprint(api_bp, url_prefix='/api')

    # Commande shell pour tester dans le terminal
    @app.shell_context_processor
    def make_shell_context():
        return dict(db=db, User=User, Pro=Pro, Dispo=Dispo, RDV=RDV)

    return app


# Lancement direct pour dev
if __name__ == '__main__':
    app = create_app('development')
    # Crée le dossier instance s'il n'existe pas
    os.makedirs(os.path.join(app.root_path, 'instance'), exist_ok=True)
    app.run(debug=True)