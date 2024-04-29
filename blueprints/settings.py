from flask import Blueprint, session, redirect, url_for, render_template, request, current_app, jsonify
from utils import settings_helper


settings = Blueprint('settings', __name__)


# --------------------- Initialize global variables --------------------------
# users_ref = None
defaults = {
    'language': "Tiếng Việt (mặc định)"
}
# --------------------- END OF Initialize global variables. -----------------------



@settings.before_request
def before_request():
    # global users_ref
    # users_ref = current_app.config['firebase_google'].firestore_db.collection('users')

    pass



@settings.route('/', methods = ['GET', 'POST'])
def index():
    users_ref = current_app.config['firebase_google'].firestore_db.collection('users')
    
    if request.method == 'GET':
        if not session.get('login'):
            return redirect(url_for('auth.login', next = request.url))
        
        user_id = session.get('user')
        results = settings_helper.get_settings(users_ref=users_ref, user_id=user_id, defaults=defaults)
        if results['status'] == 0:
            return redirect(url_for('auth.login', next = request.url))
        
        redirect_url = request.args.get('next', '')
        update_health_conditions = request.args.get('updateHealthConditions', False, type=bool)
        template = 'settings'

        page_params = {
            'template_folder': url_for('static', filename = f'templates/{template}'),
            'update_health_conditions': update_health_conditions,
            'next': redirect_url,
            'user': results['user'],
            'app': results['app']
        }

        return render_template(f'{template}/index.html', **page_params)
    

    elif request.method == 'POST':
        if not session.get('login'):
            return {
                'status': 3,
                'message': "Bạn cần đăng nhập để thay đổi các cài đặt!"
            }
        
        data = request.get_json()
        user_id = session.get('user')
        response = settings_helper.post_settings(users_ref=users_ref, data=data, user_id=user_id)

        return jsonify(response)