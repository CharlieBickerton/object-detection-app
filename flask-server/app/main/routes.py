from flask import request, Blueprint, abort, jsonify
from flask_jwt_extended import (create_access_token, create_refresh_token,
                                jwt_required, jwt_refresh_token_required, get_jwt_identity)
from app import mongo, bcrypt, JSONEncoder, jwt
from app.schemas import validate_user
from bson.objectid import ObjectId
from app.main.utils import save_picture


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
        user['images'] = []
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
        user = mongo.db.users.find_one({'username': data['username']})
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

@main.route('/api/user/authed', methods=['GET'])
@jwt_required
def authed():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    if current_user:
        return jsonify(logged_in_as=current_user), 200
    else:
        return jsonify('Could not authenticate'), 404


@main.route("/api/user/<string:_id>", methods=['GET', 'DELETE', 'PATCH'])
@jwt_required
def user(_id):
    # get by anything
    if request.method == 'GET':
        data = mongo.db.users.find_one({"_id" : ObjectId(_id)})
        del data['password']
        return jsonify(data), 200

    # Delete by _id
    if request.method == 'DELETE':
        if _id is not None:
            db_response = mongo.db.users.delete_one({"_id" : ObjectId(_id)})
            if db_response.deleted_count == 1:
                response = {'ok': True, 'message': 'record deleted'}
            else:
                response = {'ok': True, 'message': 'no record found'}
            return jsonify(response), 200
        else:
            return jsonify({'ok': False, 'message': 'Bad request parameters!'}), 400

    data = request.json
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

@main.route('/api/user/<string:_id>/predictions', methods=['GET', 'POST'])
@jwt_required
def predictions(_id):
    if request.method == 'POST':
        if request.json:
            data = request.json
            picture_name = save_picture(data)
            result = mongo.db.users.update_one(
                {'_id': ObjectId(_id)}, {'$push': {'images': {'file-name': picture_name}}}
            )
            print(result)
            return jsonify({'ok': True, 'message': 'image recieved'}), 200
        else:
            return jsonify({'ok': False, 'message': 'No image'}), 400
    elif request.method == 'GET':
        user = mongo.db.users.find_one({"_id" : ObjectId(_id)})
        image_files = user['images']
        img_address_list = []
        print(image_files)
        for img in image_files:
            img_address_list.append({'url': '/static/prediction_pics/' + img['file-name']})
        print(img_address_list)
        return jsonify(img_address_list), 200
