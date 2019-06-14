from flask import request, Blueprint, abort, jsonify
from flask_login import login_user, current_user, logout_user, login_required
from app import mongo, bcrypt


main = Blueprint('main', __name__)


@main.route("/api/user/register", methods=['POST'])
def register():
    if not request.json:
        abort(400)
    if current_user.is_authenticated:
        return "You are already authed"
    users = mongo.db.user
    hashed_password = bcrypt.generate_password_hash(request.json['password']).decode('utf-8')
    users.insert({
      'username': request.json['username'],
      'email': request.json['email'],
      'password': hashed_password,
    })
    return jsonify({'registered': 'success'})

@main.route("/api/user/login", methods=['POST'])
def login():
    if current_user.is_authenticated:
        return "You are already logged in"
    user = mongo.db.user.find_one_or_404({"username": request.json['username']})
    print(user['password'])
    if user and bcrypt.check_password_hash(user['password'], request.json['password']):
        login_user(user)
        return jsonify({"login":"success"})
    else:
        return jsonify({"login":"unsuccessful"})
  
@main.route("/")
def about():
    return 'hi'

