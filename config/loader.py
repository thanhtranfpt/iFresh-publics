import yaml
import json


class Configs:
    def __init__(self) -> None:
        self.basic_configs = {}
        self.env = {}
        self.app = {}
        self.google_login = {}
        self.firebase_google = {}
        self.gemini_google = {}
        self.google_cloud = {}

        self.load_basic_configs()
        self.load_env_configs()
        self.load_app_configs()
        self.load_google_login_configs()
        self.load_firebase_google_configs()
        self.load_gemini_google_configs()
        self.load_google_cloud_configs()

    def load_basic_configs(self):
        with open('config/configs.yaml', 'r', encoding='UTF-8') as file:
            cfs = yaml.safe_load(file)
        self.basic_configs = cfs

    def load_app_configs(self):
        with open('config/secrets/app.json', 'r', encoding='UTF-8') as file:
            cfgs = json.load(file)
        self.app = { **self.basic_configs['app'], **cfgs}

    def load_google_login_configs(self):
        with open(self.basic_configs['google_cloud']['client_secrets_file']) as file:
            client_secrets = json.load(file)
        self.google_login = { 
            **self.basic_configs['google_login'],
            **client_secrets,
            **{
                'client_secrets_file': self.basic_configs['google_cloud']['client_secrets_file']
            }
        }

    def load_env_configs(self):
        with open('envs.json', 'r', encoding='UTF-8') as file:
            envs = json.load(file)
        self.env = envs[self.basic_configs['env']['selected']]


    def load_firebase_google_configs(self):
        with open(self.basic_configs['firebase_google']['firebase_config_file']) as file:
            firebase_configs = json.load(file)

        self.firebase_google = {
            **self.basic_configs['firebase_google'],
            **{
                'firebase_configs': firebase_configs
            }
        }


    def load_gemini_google_configs(self):
        with open(self.basic_configs['gemini_google']['google_api_key_file']) as file:
            google_api_key = json.load(file)

        self.gemini_google = {
            **self.basic_configs['gemini_google'],
            **google_api_key
        }


    def load_google_cloud_configs(self):
        with open(self.basic_configs['google_cloud']['configs_file']) as file:
            configs = json.load(file)

        self.google_cloud = {
            **self.basic_configs['google_cloud'],
            **configs
        }




configs = Configs()