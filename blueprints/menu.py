from flask import Blueprint, current_app, session, render_template, redirect, jsonify, url_for, request
from utils import menu_helper


menu = Blueprint('menu', __name__)


# ----------------------- Initialize global variables -------------------------------
global TEMPORARY_STORAGE
TEMPORARY_STORAGE = {}
# ----------------------- END OF Initialize global variables. -----------------------


@menu.route('/', methods = ['GET'])
def index():
    if not session.get('login'):
        return redirect(url_for('auth.login', next = request.url))
    
    user_id = session.get('user')
    users_ref = current_app.config['firebase_google'].firestore_db.collection('users')

    results = menu_helper.index(user_id=user_id, users_ref=users_ref)

    if results['status'] == 0:
        return redirect(url_for('auth.login', next = request.url))
    

    template = 'menu-generator/launchpad'

    return render_template(f'{template}/index.html', **{
        'template_folder': url_for('static', filename = f'templates/{template}'),
        'recent_dishes': results['recent_dishes']
    })


@menu.route('/generate', methods = ['GET', 'POST'])
def generate():
    if request.method == 'GET':
        if not session.get('login'):
            return redirect(url_for('auth.login', next = request.url))
        
        user_id = session.get('user')
        users_ref = current_app.config['firebase_google'].firestore_db.collection('users')
        results = menu_helper.get_generate(user_id=user_id, users_ref=users_ref)
        if results['status'] == 0:
            return redirect(url_for('auth.login', next = request.url))
        
        template = 'menu-generator/choose-items'

        return render_template(f'{template}/index.html', 
                               **{
                                   'template_folder': url_for('static', filename = f'templates/{template}'),
                                   'fridge_items': results['fridge_items']
                               })
    
    elif request.method == 'POST':
        data = request.get_json()
        if not session.get('login'):
            return {
                'status': 0,
                'message': 'Login required.'
            }
        
        user_id = session.get('user')
        users_ref = current_app.config['firebase_google'].firestore_db.collection('users')
        gemini_model = current_app.config['ai_models']['gemini']

        results = menu_helper.post_generate(data=data, user_id=user_id, users_ref=users_ref, gemini_model=gemini_model)

        if results['status'] != 1:
            return jsonify(results)
        

        TEMPORARY_STORAGE[user_id] = results

        return jsonify({
            'status': 1,
            'message': 'Successfully!',
            'redirect_url': url_for('menu.results_generated')
        })
    


@menu.route('/generate/result', methods = ['GET'])
def results_generated():
    if not session.get('login'):
        return redirect(url_for('auth.login', next = request.url))
    
    user_id = session.get('user')
    data = TEMPORARY_STORAGE.get(user_id)

    if not data:
        return redirect(url_for('menu.generate'))
    
    TEMPORARY_STORAGE.pop(user_id)
    google_search = current_app.config['google_search']['engine']

    results = menu_helper.results_generated(data=data, google_search=google_search)

    template = 'menu-generator/results'

    return render_template(f'{template}/index.html',
                           **{
                               'template_folder': url_for('static', filename = f'templates/{template}'),
                               'dish': results['dish'],
                               'guidance': results['guidance'],
                               'shopping': results['shopping']
                           })