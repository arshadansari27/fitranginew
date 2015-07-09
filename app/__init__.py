import os
import flask_admin
from flask.ext.admin import AdminIndexView, expose
from flask import Flask, g
from flask.ext.cache import Cache
from flask.ext.cdn import CDN
from flask.ext.mongoengine import MongoEngine
from flask.ext.mandrill import Mandrill
from flask.ext.mongorest import MongoRest
from flask.ext.assets import Environment
from app import settings
from pymongo import read_preferences
from datetime import timedelta


app = Flask(__name__, template_folder='templates', static_folder='assets', static_url_path='')
app.jinja_env.add_extension('jinja2.ext.loopcontrols')
app.config['SECRET_KEY'] = 'd2f700ed-ff0f-4f9d-91bc-43b03805303e' #os.urandom(24)
app.config['MONGODB_SETTINGS'] = {
    'db': settings.MONGODB_DB,
    'host': settings.MONGODB_HOST,
    'port': settings.MONGODB_PORT,
    'read_preference': read_preferences.ReadPreference.PRIMARY
}
app.config['MANDRILL_API_KEY'] = settings.MANDRILL_API_KEY
app.config['MANDRILL_DEFAULT_FROM'] = settings.MANDRILL_DEFAULT_FROM
app.config['CDN_DOMAIN'] = settings.CDN_DOMAIN
app.config['FLASK_ASSETS_USE_CDN']=True
CDN(app)

mandrill = Mandrill(app)
db = MongoEngine()
db.init_app(app)

#from flask.ext import login
cache = Cache(app,config={'CACHE_TYPE': 'simple'})
admin = None
api = MongoRest(app)
app.jinja_env.cache = {}

ASSETS_DEBUG = os.environ.get('ASSETS_DEBUG', None)
if ASSETS_DEBUG and ASSETS_DEBUG == 'TRUE':
    app.config['ASSETS_DEBUG'] = True
    USE_CDN = False
else:
    USE_CDN = True

assets = Environment(app)

def start_app():
    global admin
    from app.models.extra.sessions import MongoSessionInterface
    from app.models.profile import Profile
    app.secret_key = os.urandom(24)

    #app.permanent_session_lifetime = timedelta(minutes=120)
    app.session_interface = MongoSessionInterface()

    #from app.handlers.views import *
    #from app.handlers.editors import *
    print Profile.objects.count()
    admin_user = Profile.objects(roles__in=['Admin']).first()
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

    class MyAdminIndexView(AdminIndexView):

        @expose('/')
        def index(self):
            if not (hasattr(g, 'user') and g.user is not None and 'Admin' in g.user.roles):
                return redirect('/')
            return super(MyAdminIndexView, self).index()


    admin = flask_admin.Admin(app, 'Fitrangi Dashboard',index_view=MyAdminIndexView(), base_template='/admin/base_admin.html')


state = os.environ.get('APP_STATE')

if not state or state != 'BACK':
    start_app()
    from app.views.admin import *
    from app.views.site import *
#from app.handlers.examples import *

