from flask import Blueprint, render_template, redirect, url_for, session, current_app, request, jsonify
from utils import account_helper
from werkzeug.utils import secure_filename


account = Blueprint('account', __name__)


# ------------------- Initialize global variables --------------
# users_ref = None
# storage_firebabse = None
# firebase_google = None
# ------------------- END OF Initialize global variables. --------------


@account.before_request
def before_request():
    # global users_ref, storage_firebabse, firebase_google
    # users_ref = current_app.config['firebase_google'].firestore_db.collection('users')
    # storage_firebabse = current_app.config['firebase_google'].storage
    # firebase_google = current_app.config['firebase_google']
    pass


@account.route('/update-info', methods = ['POST'])
def update_info():
    if not session.get('login'):
        return {
            'status': 10,
            'message': "Bạn cần đăng nhập để thực hiện việc thay đổi thông tin cá nhân."
        }
    
    user_id = session.get('user')
    data = request.get_json()

    users_ref = current_app.config['firebase_google'].firestore_db.collection('users')

    response = account_helper.update_info(users_ref=users_ref, data=data, user_id=user_id)

    return jsonify(response)


@account.route('/update-info/change-avatar', methods = ['POST'])
def upload_avatar():
    if not session.get('login'):
        return {
            'status': 0,
            'message': "Bạn cần đăng nhập để thực hiện việc thay đổi này."
        }
    
    user_id = session.get('user')
    
    if 'avatar_image' not in request.files:
        return {
            'status': 2,
            'message': 'No file part.'
        }
    
    file = request.files['avatar_image']

    if file.filename == '':
        return {
            'status': 3,
            'message': 'No selected file.'
        }
    

    users_ref = current_app.config['firebase_google'].firestore_db.collection('users')
    firebase_google = current_app.config['firebase_google']
    storage_firebabse = current_app.config['firebase_google'].storage

    personal_info = users_ref.document(user_id).get().to_dict()['personal_info']

    # Delete the old avatar
    if 'avatar_hosted_path' in personal_info:
        if firebase_google.delete_file_from_storage(personal_info['avatar_hosted_path'])['status'] != 1:
            return {
                'status': 6,
                'message': "Đã xảy ra lỗi trong quá trình cập nhật cơ sở dữ liệu. (Cannot delete old avatar)"
            }
        
    # Upload the file to Firebase Storage
    try:
        file_name = secure_filename(filename=file.filename)
        file_path = f'uploads/user_avatars/{user_id}/{file_name}'
        storage_firebabse.child(file_path).put(file)
        file_url = storage_firebabse.child(file_path).get_url(None)
    except:
        return {
            'status': 4,
            'message': "Đã xảy ra lỗi trong quá trình tải ảnh lên cơ sở dữ liệu."
        }
    
    # Update avatar url in personal info
    personal_info['avatar'] = file_url
    personal_info['avatar_hosted_path'] = file_path
    try:
        users_ref.document(user_id).update({
            'personal_info': personal_info
        })
    except:
        return {
            'status': 5,
            'message': "Đã xảy ra lỗi trong quá trình cập nhật cơ sở dữ liệu."
        }
    
    return {
        'status': 1,
        'message': "Cập nhật ảnh đại diện thành công!",
        'avatar_link': personal_info['avatar']
    }


@account.route('/recovery', methods = ['GET'])
def recovery():
    return render_template('others/feature_coming_soon.html')


@account.route('/delete', methods = ['POST'])
def delete():
    if not session.get('login'):
        return {
            'status': 0,
            'message': 'Bạn cần đăng nhập để thực hiện hành động này!'
        }
    
    data = request.get_json()
    reason = data['reason']

    user_id = session.get('user')

    users_ref = current_app.config['firebase_google'].firestore_db.collection('users')
    firebase_google = current_app.config['firebase_google']
    
    response = account_helper.delete(users_ref=users_ref, user_id=user_id, firebase_google=firebase_google)

    if response['status'] == 1:
        session.pop('login', None)


    return jsonify(response)