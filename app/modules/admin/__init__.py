__author__ = 'arshad'


from flask import Blueprint

admin_module = Blueprint('manage', __name__, template_folder="templates", url_prefix='/manage')
from views import *

