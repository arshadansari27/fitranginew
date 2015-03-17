import os

from flask import Flask
import flask_admin
from flask.ext.cache import Cache
from flask.ext.mongoengine import MongoEngine
from flask.ext.mandrill import Mandrill

from app import settings


app = Flask(__name__, template_folder='templates', static_folder='assets')
app.jinja_env.add_extension('jinja2.ext.loopcontrols')
app.config['SECRET_KEY'] = os.urandom(24)
app.config['MONGODB_SETTINGS'] = {'DB': settings.MONGODB_DB, 'HOST': settings.MONGODB_HOST, 'PORT': settings.MONGODB_PORT}
app.config['MANDRILL_API_KEY'] = 'AW8kuRPFtDyZpOrgSf-0BQ'
app.config['MANDRILL_DEFAULT_FROM'] = 'noreply@fitrangi.com'
mandrill = Mandrill(app)
db = MongoEngine()
db.init_app(app)

admin = flask_admin.Admin(app, 'Fitrangi Dashboard')

#from flask.ext import login
cache = Cache(app,config={'CACHE_TYPE': 'simple'})

def start_app():
    from app.models.extra.sessions import MongoSessionInterface
    from app.models.profile import Profile

    app.session_interface = MongoSessionInterface()

    #from app.handlers.views import *
    #from app.handlers.editors import *
    admin_user = Profile.objects(roles='Admin').first()
    if admin_user is None:
        profile = Profile(name='Arshad Ansari', roles=['Admin'], email='arshadansari27@gmail.com')
        profile.password = 'testing'
        profile.save()


    import logging
    if not app.debug:
        logging.basicConfig(filename='fitrangi-flask-error.log',level=logging.DEBUG)
    else:
        logging.basicConfig()
        logging.getLogger().setLevel(logging.DEBUG)

    from app.views.admin import *



start_app()
#from app.handlers.examples import *

