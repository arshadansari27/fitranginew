__author__ = 'arshad'


from flask import Blueprint

main_module = Blueprint('main', __name__, template_folder="templates", url_prefix='/main')
from views import *

