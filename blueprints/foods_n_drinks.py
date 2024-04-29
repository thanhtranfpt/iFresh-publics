from flask import Blueprint, current_app, session, url_for, redirect, render_template, jsonify, request
from utils import foods_n_drinks_helper



foods_n_drinks = Blueprint('foods_n_drinks', __name__)



# ----------------------------- Initialize global variables ---------------------
# gemini_model = None
# ----------------------------- END OF Initialize global variables. --------------


@foods_n_drinks.before_request
def before_request():
    # global gemini_model
    # gemini_model = current_app.config['ai_models']['gemini']
    pass


@foods_n_drinks.route('/check-combine', methods = ['POST'])
def check_combine():
    if not session.get('login'):
        return {
            'status': 0,
            'message': 'Login required.'
        }
    
    data = request.get_json()

    gemini_model = current_app.config['ai_models']['gemini']

    response = foods_n_drinks_helper.check_combine(data=data, gemini_model=gemini_model)

    return jsonify(response)



@foods_n_drinks.route('/view-info', methods = ['GET'])
def view_info():
    if not session.get('login'):
        return redirect(url_for('auth.login', next = request.url))
    
    item_id = request.args.get('itemId', None)
    item_name = request.args.get('itemName', None)
    product_barcode = request.args.get('productBarcode', None)

    if item_id:
        db_food_items_ref = current_app.config['firebase_google'].realtime_db.child('Foods_Preservation_Database')
        
        results = foods_n_drinks_helper.view_info(**{
            'search_type': 'id',
            'db_food_items_ref': db_food_items_ref,
            'item_id': item_id
        })

        if results['status'] == 0:
            return redirect(url_for('auth.login', next = request.url))
        

        template = 'home/item-info'

        return render_template(f'{template}/index.html', **{
            'template_folder': url_for('static', filename = f'templates/{template}'),
            'item': results['item']
        })
    

    if item_name:
        results = foods_n_drinks_helper.view_info(**{
            'search_type': 'name',
            'item_name': item_name
        })

        template = 'home/item-info/intro'

        return render_template(f'{template}/index.html', 
                               **{
                                   'template_folder': url_for('static', filename = f'templates/{template}'),
                                   'item': results['item']
                               })