from flask import Flask
from flask_pymongo import PyMongo
from app.config import Config

mongo = PyMongo()


def create_app(config_class=Config):
    app = Flask(__name__)

    app.config.from_object(Config) # import config variables and execute for app

    mongo.init_app(app)

    from app.main.routes import main
    app.register_blueprint(main)

    return app