import json
from bson.objectid import ObjectId
import datetime
from flask import Flask
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from app.config import Config

mongo = PyMongo()
bcrypt = Bcrypt()
login_manager = LoginManager()

class JSONEncoder(json.JSONEncoder):
    ''' extend json-encoder class'''

    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        if isinstance(o, datetime.datetime):
            return str(o)
        return json.JSONEncoder.default(self, o)


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(Config) # import config variables and execute for app
    mongo.init_app(app)
    bcrypt.init_app(app)
    # use the modified encoder class to handle mongo objects ObjectId & datetime 
    # object while jsonifying the response.
    app.json_encoder = JSONEncoder
    from app.main.routes import main
    app.register_blueprint(main)
    return app

