from flask import request, Blueprint, abort, jsonify
from flask_jwt_extended import (create_access_token, create_refresh_token,
                                jwt_required, jwt_refresh_token_required, get_jwt_identity)
from app import mongo, bcrypt, JSONEncoder, jwt
from app.schemas import validate_user
from bson.objectid import ObjectId


main = Blueprint('main', __name__)


@jwt.unauthorized_loader
def unauthorized_response(callback):
    return jsonify({
        'ok': False,
        'message': 'Missing Authorization Header'
    }), 401


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
        mongo.db.users.insert_one(user)
        return jsonify({'ok': True, 'message': 'User created successfully!'}), 200
    else:
        return jsonify({'ok': False, 'message': 'Bad request parameters: {}'.format(data['message'])}), 400


@main.route('/api/user/login', methods=['POST'])
def auth_user():
    ''' login endpoint '''
    data = validate_user(request.json)
    if data['ok']:
        data = data['data']
        user = mongo.db.users.find_one({'username': data['username'], 'email': data['email']})
        if user and bcrypt.check_password_hash(user['password'], data['password']):
            print('user', user)
            del user['password']
            access_token = create_access_token(identity=data)
            refresh_token = create_refresh_token(identity=data)
            user['token'] = access_token
            user['refresh'] = refresh_token
            return jsonify({'ok': True, 'data': user}), 200
        else:
            return jsonify({'ok': False, 'message': 'invalid username or password'}), 401
    else:
        return jsonify({'ok': False, 'message': 'Bad request parameters: {}'.format(data['message'])}), 400


@main.route('/api/user/refresh', methods=['POST'])
@jwt_refresh_token_required
def refresh():
    ''' refresh token endpoint '''
    current_user = get_jwt_identity()
    ret = {
            'token': create_access_token(identity=current_user)
    }
    return jsonify({'ok': True, 'data': ret}), 200


@main.route("/api/user", methods=['GET', 'DELETE', 'PATCH'])
@jwt_required
def user():
    # get by anything
    if request.method == 'GET':
        query = request.args
        print(query)
        if not query.get('_id'):
            data = mongo.db.users.find_one(query)
        else:
            print('in here:', query['_id'])
            query = {"_id" : ObjectId(query['_id'])}
            print(query)
            data = mongo.db.users.find_one(query)
            print(data)
        return jsonify(data), 200

    data = request.json
    # Delete by _id
    if request.method == 'DELETE':
        if data.get('_id') is not None:
            db_response = mongo.db.users.delete_one({"_id" : ObjectId(data['_id'])})
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
            mongo.db.users.update_one(
                query, {'$set': data['payload']})
            return jsonify({'ok': True, 'message': 'record updated'}), 200
        else:
            return jsonify({'ok': False, 'message': 'Bad request parameters!'}), 400