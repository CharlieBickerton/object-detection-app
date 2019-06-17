from flask import request, Blueprint, abort, jsonify
from flask_login import login_user, current_user, logout_user, login_required
from app import mongo, bcrypt, JSONEncoder
from app.schemas import validate_user
from bson.objectid import ObjectId


main = Blueprint('main', __name__)


@main.route("/api/user/register", methods=['POST'])
def register():
    '''Registration route'''
    if not request.json:
        abort(400)
    data = validate_user(request.json)
    if data['ok']:
        user = data['data']
        user['password'] = bcrypt.generate_password_hash(request.json['password']).decode('utf-8')
        print(user)
        mongo.db.user.insert_one(user)
        return jsonify({'ok': True, 'message': 'User created successfully!'}), 200
    else:
        return jsonify({'ok': False, 'message': 'Bad request parameters: {}'.format(data['message'])}), 400


@main.route("/api/user", methods=['GET', 'DELETE', 'PATCH'])
def user():
    # get by anything
    if request.method == 'GET':
        query = request.args
        if not query['_id']:
            print('_id')
            data = mongo.db.user.find_one(query)
        else:
            query = {"_id" : ObjectId(query['_id'])}
            data = mongo.db.user.find_one(query)
        return jsonify(data), 200

    data = request.json
    # Delete by _id
    if request.method == 'DELETE':
        if data.get('_id') is not None:
            db_response = mongo.db.user.delete_one({"_id" : ObjectId(data['_id'])})
            if db_response.deleted_count == 1:
                response = {'ok': True, 'message': 'record deleted'}
            else:
                response = {'ok': True, 'message': 'no record found'}
            return jsonify(response), 200
        else:
            return jsonify({'ok': False, 'message': 'Bad request parameters!'}), 400

    # update by id
    if request.method == 'PATCH':
        print("request: ", request.json)
        if data.get('query') is not None and data['query'].get('_id') is not None:
            query = { "_id": ObjectId(data['query']['_id']) }
            print('in else:', data['payload'])
            mongo.db.user.update_one(
                query, {'$set': data['payload']})
            return jsonify({'ok': True, 'message': 'record updated'}), 200
        else:
            return jsonify({'ok': False, 'message': 'Bad request parameters!'}), 400  


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

