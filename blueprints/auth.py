from flask import Blueprint, session, request, redirect, render_template, current_app, url_for, jsonify
from utils import auth_helper
from utils.auth_helper import GoogleLogin
import google.auth.transport.requests
from google.oauth2 import id_token
from pip._vendor import cachecontrol
import requests


auth = Blueprint('auth', __name__)


# ------------------ Initialize global variables ---------------------
# users_ref = {}
# flow_google_login = None
# ------------------ END OF Initialize global variables. ---------------------------


@auth.before_request
def before_request():
    # global users_ref, flow_google_login
    # users_ref = current_app.config['firebase_google'].firestore_db.collection('users')
    pass


@auth.route('/login', methods = ['GET', 'POST'])
def login():
    if request.method == 'GET':
        redirect_url = request.args.get('next', '/')
        template = 'login/launchpad'
        page_params = {
            'template_folder': url_for('static', filename = f'templates/{template}'),
            'next': redirect_url
        }
        return render_template(f'{template}/index.html', **page_params)
    
    elif request.method == 'POST':
        # Login with iFresh account
        data = request.get_json()
        users_ref = current_app.config['firebase_google'].firestore_db.collection('users')
        response = auth_helper.login(users_ref=users_ref, data=data)
        if response['status'] == 1:
            session['user'] = response['user_id']
            session['login'] = True
        return jsonify(response)
    

@auth.route('/login/iFresh', methods = ['GET'])
def login_iFresh():
    redirect_url = request.args.get('next', '/')
    template = 'login/iFresh'
    page_params = {
        'template_folder': url_for('static', filename = f'templates/{template}'),
        'next': redirect_url
    }
    return render_template(f'{template}/index.html', **page_params)


@auth.route('/login/facebook')
def login_facebook():
    redirect_url = request.args.get('next', '/')
    return redirect(url_for('auth.login', next = redirect_url))

@auth.route('/login/apple')
def login_apple():
    redirect_url = request.args.get('next', '/')
    return redirect(url_for('auth.login', next = redirect_url))


@auth.route('/login/google')
def login_google():
    flow = current_app.config['google_login']['flow']
    redirect_url = request.args.get('next', '/')
    authorization_url, state = flow.authorization_url()
    session['state'] = state
    session['redirect_url'] = redirect_url
    return redirect(authorization_url)

@auth.route('/login/google/callback')
def login_google_callback():
    flow = current_app.config['google_login']['flow']
    redirect_url = session.get('redirect_url', '/')
    session.pop('redirect_url', None)
    flow.fetch_token(authorization_response = request.url)
    GOOGLE_CLIENT_ID = current_app.config['google_login']['web']['client_id']
    
    if not ('state' in session and session['state'] == request.args['state']):
        return redirect(url_for('auth.login', next = redirect_url))
    
    session.pop('state', None)
    
    credentials = flow.credentials
    request_session = requests.session()
    cached_session = cachecontrol.CacheControl(request_session)
    token_request = google.auth.transport.requests.Request(session=cached_session)
    id_info = id_token.verify_oauth2_token(
        id_token=credentials._id_token,
        request=token_request,
        audience=GOOGLE_CLIENT_ID
    )

    session['user'] = id_info['email']
    session['login'] = True

    users_ref = current_app.config['firebase_google'].firestore_db.collection('users')

    result = GoogleLogin().sign_up_account(id_info=id_info, users_ref=users_ref)

    if result['status'] == 1:
        # Mới đăng ký lần đầu.
        template = 'settings'
        page_params = {
            'template_folder': url_for('static', filename = f'templates/{template}'),
            'update_health_conditions': True,
            'next': redirect_url,
            'user': result['user_info'],
            'app': {
                'language': "Tiếng Việt (mặc định)"
            }
        }

        return render_template(f'{template}/index.html', **page_params)
    
    return redirect(redirect_url)



@auth.route('/log-out')
def log_out():
    redirect_url = request.args.get('next', '/')
    session.pop('user', None)
    session.pop('login', None)
    return redirect(redirect_url)


@auth.route('/sign-up', methods = ['POST'])
def sign_up():
    data = request.get_json()
    users_ref = current_app.config['firebase_google'].firestore_db.collection('users')
    response = auth_helper.sign_up(users_ref=users_ref, data=data, health_conditions_extracted=False)
    return jsonify(response)