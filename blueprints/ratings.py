from flask import Blueprint, current_app, session, render_template, jsonify, redirect, url_for, request
from utils import ratings_helper


ratings = Blueprint('ratings', __name__)


@ratings.route('/', methods = ['POST'])
def index():
    if not session.get('login'):
        return jsonify({
            'status': 0,
            'message': 'Login required.'
        })
    
    data = request.get_json()
    user_id = session.get('user')
    users_ref = current_app.config['firebase_google'].firestore_db.collection('users')

    results = ratings_helper.index(data=data, user_id=user_id, users_ref=users_ref)

    return jsonify(results)