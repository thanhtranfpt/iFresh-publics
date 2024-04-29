from flask import Blueprint, current_app, session, render_template, redirect, url_for, request
from utils import explore_helper



explore = Blueprint('explore', __name__)



@explore.route('/', methods = ['GET'])
def index():
    if not session.get('login'):
        return redirect(url_for('auth.login', next = request.url))
    
    template = 'explore'

    return render_template(f'{template}/index.html', **{
        'template_folder': url_for('static', filename = f'templates/{template}'),
        'show_results': False,
        'search_query': ''
    })



@explore.route('/search', methods = ['GET'])
def search():
    if not session.get('login'):
        return redirect(url_for('auth.login', next = request.url))
    
    query = request.args.get('query')

    if not query:
        return redirect(url_for('explore.index'))
    

    gemini_model = current_app.config['ai_models']['gemini']
    google_search = current_app.config['google_search']['engine']
    users_ref = current_app.config['firebase_google'].firestore_db.collection('users')
    user_id = session.get('user')
    results = explore_helper.search(query=query, gemini_model=gemini_model, user_id=user_id, users_ref=users_ref, google_search=google_search)

    if results['status'] == 0:
        return redirect(url_for('auth.login', next = request.url))
    

    template = 'explore'

    return render_template(f'{template}/index.html', **{
        'template_folder': url_for('static', filename = f'templates/{template}'),
        'show_results': True,
        'search_query': query,
        'results': {
            'advice': results['advice'],
            'recommended_items': results['recommended_items']
        }
    })