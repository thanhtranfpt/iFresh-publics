from flask import Blueprint, request, redirect, render_template, url_for, session, current_app, jsonify
from utils import home_helper



home = Blueprint('home', __name__)



# -------------------- Initialize global variables ------------------
# users_ref = None
# db_food_items_ref = None
# gemini_model = None
# -------------------- END OF Initialize global variables. --------------------



@home.before_request
def before_request():
    # global users_ref, gemini_model, db_food_items_ref
    # users_ref = current_app.config['firebase_google'].firestore_db.collection('users')
    # db_food_items_ref = current_app.config['firebase_google'].realtime_db.child('Foods_Preservation_Database')
    # gemini_model = current_app.config['ai_models']['gemini']
    pass



@home.route('/', methods = ['GET'])
def index():
    if not session.get('login'):
        return redirect(url_for('auth.login', next = request.url))
    
    user_id = session.get('user')
    open_search_tab = request.args.get('openSearchTab', default=False, type=bool)

    users_ref = current_app.config['firebase_google'].firestore_db.collection('users')
    gemini_model = current_app.config['ai_models']['gemini']
    db_food_items_ref = current_app.config['firebase_google'].realtime_db.child('Foods_Preservation_Database')

    results = home_helper.index(users_ref=users_ref, user_id=user_id, gemini_model=gemini_model, db_food_items_ref=db_food_items_ref)

    if results['status'] == 0:
        return redirect(url_for('auth.login', next = request.url))
    
    results['open_search_tab'] = open_search_tab

    template = 'home/home-n-add-items'
    page_params = {
        'template_folder': url_for('static', filename = f'templates/{template}'),
        **results
    }


    return render_template(f'{template}/index.html', **page_params)