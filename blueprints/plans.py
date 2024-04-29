from flask import Blueprint, current_app, session, redirect, render_template, jsonify, url_for, request
from utils import plans_helper


plans = Blueprint('plans', __name__)


@plans.route('/', methods = ['GET'])
def index():
    if not session.get('login'):
        return redirect(url_for('auth.login', next = request.url))
    
    user_id = session.get('user')
    users_ref = current_app.config['firebase_google'].firestore_db.collection('users')

    results = plans_helper.index(user_id=user_id, users_ref=users_ref)

    if results['status'] == 0:
        return redirect(url_for('auth.login', next = request.url))
    
    template = 'goi-thanh-vien/plans'

    return render_template(f'{template}/index.html',
                           **{
                               'template_folder': url_for('static', filename = f'templates/{template}'),
                               'user_plan': results['user_plan']
                           })


@plans.route('/premium', methods = ['GET'])
def premium():
    if not session.get('login'):
        return redirect(url_for('auth.login', next = request.url))
    
    user_id = session.get('user')
    users_ref = current_app.config['firebase_google'].firestore_db.collection('users')

    results = plans_helper.premium(user_id=user_id, users_ref=users_ref)

    if results['status'] == 0:
        return redirect(url_for('auth.login', next = request.url))
    

    template = 'goi-thanh-vien/premium-plan'

    return render_template(f'{template}/index.html',
                           **{
                               'template_folder': url_for('static', filename = f'templates/{template}'),
                               'payment': results['payment']
                           })