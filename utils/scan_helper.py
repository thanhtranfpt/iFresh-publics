import base64
from PIL import Image
import io
from flask import url_for
import cloudmersive_barcode_api_client
from cloudmersive_barcode_api_client.rest import ApiException
import requests
from utils.common_utils import upload_image
from collections import OrderedDict
import time
from qreader import QReader
import cv2
import os

