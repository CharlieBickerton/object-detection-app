from flask import request, Blueprint
from app import mongo


main = Blueprint('main', __name__)


@main.route("/api/user/register/")
def register():
    user = mongo.db.user
    username = 'Test'
    email = 'test@test.com'
    user.insert({'username': username, 'email': email })
    return 'registerd'


@main.route("/")
def about():
    return 'hi'

