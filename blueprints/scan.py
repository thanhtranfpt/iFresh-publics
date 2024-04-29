from flask import Blueprint, current_app, session, render_template, redirect, url_for, jsonify, request
from utils import scan_helper


scan = Blueprint('scan', __name__)


@scan.route('/', methods = ['GET', 'POST'])
def index():
    if not session.get('login'):
        return redirect(url_for('auth.login', next = request.url))
    
    if request.method == 'GET':
    
        template = 'scanner/launchpad'

        return render_template(f'{template}/index.html',
                            **{
                                'template_folder': url_for('static', filename = f'templates/{template}')
                            })
    
    elif request.method == 'POST':
        data = request.get_json()
        user_id = session.get('user')
        users_ref = current_app.config['firebase_google'].firestore_db.collection('users')
        barcode_handler = current_app.config['scanner']['barcode_handler']

        results = scan_helper.post_index(data=data, user_id=user_id, users_ref=users_ref, barcode_handler=barcode_handler)

        
        return jsonify(results)
    

@scan.route('/image', methods = ['GET'])
def view_image_scanning():
    if not session.get('login'):
        return redirect(url_for('auth.login', next = request.url))
    
    template = 'scanner/scan'

    return render_template(f'{template}/index.html', 
                           **{
                               'template_folder': url_for('static', filename = f'templates/{template}')
                           })


@scan.route('/result', methods = ['GET'])
def view_scanned_items():
    if not session.get('login'):
        return redirect(url_for('auth.login', next = request.url))
    
    user_id = session.get('user')
    users_ref = current_app.config['firebase_google'].firestore_db.collection('users')

    results = scan_helper.view_scanned_items(user_id=user_id, users_ref=users_ref)

    if results['status'] == 0:
        return redirect(url_for('auth.login', next = request.url))
    

    template = 'scanner/result'

    return render_template(f'{template}/index.html', 
                           **{
                               'template_folder': url_for('static', filename = f'templates/{template}'),
                               'items': results['items']
                           })



@scan.route('/recently/remove', methods = ['POST'])
def remove_scanned_item():
    if not session.get('login'):
        return jsonify({
            'status': 0,
            'message': 'Login required.'
        })
    
    data = request.get_json()
    user_id = session.get('user')
    users_ref = current_app.config['firebase_google'].firestore_db.collection('users')

    results = scan_helper.remove_scanned_item(data=data, user_id=user_id, users_ref=users_ref)

    return jsonify(results)