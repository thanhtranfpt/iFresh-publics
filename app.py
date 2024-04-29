from flask import Flask, render_template, url_for, redirect, send_from_directory
from flask_cors import CORS
import os

from blueprints.auth import auth
from blueprints.home import home
from blueprints.account import account
from blueprints.settings import settings
from blueprints.foods_n_drinks import foods_n_drinks
from blueprints.explore import explore
from blueprints.fridge import fridge
from blueprints.menu import menu
from blueprints.plans import plans
from blueprints.ratings import ratings
from blueprints.scan import scan


from config.loader import configs
from utils.logging_utils import Logger
from utils.common_utils import FirebaseGoogle, GeminiModel, GoogleSearch
from utils.scan_helper import BarcodeHandler
from utils.auth_helper import GoogleLogin



app = Flask(__name__, template_folder='./static/templates')
CORS(app=app)



# ------------------ Set configs ----------------------
app.config['logger'] = Logger(logs_file_path=configs.app['logs_file']['path'],
                              max_logged_size=configs.app['logs_file']['max_logged_size'],
                              max_kept_size=configs.app['logs_file']['max_kept_size'])

app.secret_key = configs.app['secret_key']

# Environment
app.config['env'] = configs.env
if "OAUTHLIB_INSECURE_TRANSPORT" in app.config['env']:
    os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = app.config['env']['OAUTHLIB_INSECURE_TRANSPORT']

# Folders
app_folders = ['UPLOAD_FOLDER', 'DOWNLOAD_FOLDER', 'RESULTS_FOLDER']
for folder in app_folders:
    app.config[folder] = configs.app[folder]
    if not os.path.isdir(app.config[folder]):
        os.mkdir(app.config[folder])

# Admin
app.config['admin'] = configs.app['admin']

# Login with Google
app.config['google_login'] = configs.google_login
app.config['google_login']['flow'] = GoogleLogin().get_flow(client_secrets_file=app.config['google_login']['client_secrets_file'],
                                                          scopes=app.config['google_login']['scopes'],
                                                          redirect_uri='http://127.0.0.1:5000/login/google/callback')


# Google Cloud
app.config['google_cloud'] = configs.google_cloud


# ------------------- Initialize ----------------------
app.config['firebase_google'] = FirebaseGoogle(service_account_keys_file=configs.firebase_google['service_account_keys_file'],
                                               firebase_configs=configs.firebase_google['firebase_configs'])

app.config['ai_models'] = {}
app.config['ai_models']['gemini'] = GeminiModel(GOOGLE_API_KEY=configs.gemini_google['GOOGLE_API_KEY'])

app.config['google_search'] = {}
app.config['google_search']['engine'] = GoogleSearch(
    image_search_configs={
        'dev_api_key': configs.google_cloud['API_KEY'],
        'search_engine_cx': configs.google_cloud['image_search_engine_id']
    }
)

app.config['scanner'] = {}
app.config['scanner']['barcode_handler'] = BarcodeHandler()




# ---------------- Register blueprints --------------------
app.register_blueprint(auth, url_prefix = '')

app.register_blueprint(home, url_prefix = '/home')

app.register_blueprint(account, url_prefix = '/my-account')

app.register_blueprint(settings, url_prefix = '/settings')

app.register_blueprint(foods_n_drinks, url_prefix = '/foods-n-drinks')

app.register_blueprint(explore, url_prefix = '/explore')

app.register_blueprint(fridge, url_prefix = '/my-fridge')

app.register_blueprint(menu, url_prefix = '/menu')

app.register_blueprint(plans, url_prefix = '/plans')

app.register_blueprint(ratings, url_prefix = '/ratings')

app.register_blueprint(scan, url_prefix = '/scan')




app.config['logger'].info(str(app.config), 'App Configs')
app.config['logger'].info(str(app.config.keys()), 'App Configs Keys')






@app.route('/')
def index():
    return redirect(url_for('home.index'))





if __name__ == '__main__':
    app.run(debug=True)