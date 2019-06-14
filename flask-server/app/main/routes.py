from flask import request, Blueprint, abort, jsonify
from flask_login import login_user, current_user, logout_user, login_required
from app import mongo, bcrypt


main = Blueprint('main', __name__)


@main.route("/api/user/register", methods=['GET', 'POST'])
def register():
    if not request.json:
        abort(400)
    if current_user.is_authenticated:
        return "Already authed"
    user = mongo.db.user
    hashed_password = bcrypt.generate_password_hash(request.json['password']).decode('utf-8')
    user.insert({
      'username': request.json['username'],
      'email': request.json['email'],
      'password': hashed_password,
    })
    return jsonify({'registered': 'success'})

@main.route("/")
def about():
    return 'hi'

