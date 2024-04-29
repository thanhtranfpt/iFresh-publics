from flask import Blueprint, session, redirect, url_for, render_template, jsonify, request, current_app
from utils import fridge_helper
from werkzeug.utils import secure_filename
from utils.common_utils import upload_image
import base64


fridge = Blueprint('fridge', __name__)


@fridge.route('/add-new-item', methods = ['POST'])
def add_new_item():
    if not session.get('login'):
        return {
            'status': 0,
            'message': 'Login required!'
        }
    
    user_id = session.get('user')
    data = request.get_json()
    users_ref = current_app.config['firebase_google'].firestore_db.collection('users')

    results = fridge_helper.add_new_item(data=data, user_id=user_id, users_ref=users_ref)

    return jsonify(results)

@fridge.route('/add-new-item/upload-image', methods = ['POST'])
def upload_item_image():
    if 'item_image' not in request.files:
        return {
            'status': 2,
            'message': 'No file part.'
        }
    
    file = request.files['item_image']

    if file.filename == '':
        return {
            'status': 3,
            'message': 'No selected file.'
        }
    
    file_name = secure_filename(file.filename)
    image_data = file.read()
    # Convert image data to base64
    base64_image_data = base64.b64encode(image_data).decode('utf-8')

    results = upload_image(image_source=base64_image_data)

    if results['status'] == 1:
        return jsonify({
            'status': 1,
            'message': 'Success.',
            'image_link': results['image']['url']
        })
    

    return jsonify({
        'status': 0,
        'message': results['message']
    })

    

@fridge.route('/remove-item', methods = ['POST'])
def remove_item():
    if not session.get('login'):
        return {
            'status': 0,
            'message': 'Login required!'
        }
    
    user_id = session.get('user')
    data = request.get_json()
    users_ref = current_app.config['firebase_google'].firestore_db.collection('users')

    results = fridge_helper.remove_item(data=data, user_id=user_id, users_ref=users_ref)

    return jsonify(results)