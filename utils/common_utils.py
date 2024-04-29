import google.generativeai as genai
from firebase_admin import credentials
from firebase_admin import firestore
from firebase_admin import storage as admin_storage
import firebase_admin
import pyrebase
import markdown
import re
import requests
import json
from parsel import Selector
from urllib.parse import urlparse, parse_qs, urlencode
from google_images_search import GoogleImagesSearch
from io import BytesIO
from PIL import Image
import base64
from unidecode import unidecode
from youtubesearchpython import VideosSearch

