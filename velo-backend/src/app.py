from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from .config import config
import os
instance_path = '/opt/render/project/src/instance'
os.makedirs(instance_path, exist_ok=True)


db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app(config_name='production'):
    app = Flask(__name__)

    CORS(app, origins="*")

    app.config.from_object(config[config_name])
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(instance_path, 'velo-prod.db')
    config[config_name].init_app(app)

    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response

    # CORS(app, resources={r"/api/*": {"origins": "https://velo-connect.vercel.app"}})

    # Initialisation des extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app) 

    from .model import User, Pro, Dispo, RDV
    
    from .routes import api_bp

    app.register_blueprint(api_bp, url_prefix='/api')

    # Shell command to test in terminal
    @app.shell_context_processor
    def make_shell_context():
        return dict(db=db, User=User, Pro=Pro, Dispo=Dispo, RDV=RDV)

    return app



if __name__ == '__main__':
    app = create_app('development')
    os.makedirs(os.path.join(app.root_path, 'instance'), exist_ok=True)
    app.run(debug=True)