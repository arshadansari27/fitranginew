import os
import flask_admin
from flask.ext.admin import AdminIndexView, expose
from flask import Flask, g
from flask.ext.cache import Cache
from flask.ext.mongoengine import MongoEngine
from flask.ext.mandrill import Mandrill
from flask.ext.mongorest import MongoRest
from app import settings


app = Flask(__name__, template_folder='templates', static_folder='assets', static_url_path='')
app.jinja_env.add_extension('jinja2.ext.loopcontrols')
app.config['SECRET_KEY'] = os.urandom(24)
app.config['MONGODB_SETTINGS'] = {'db': settings.MONGODB_DB, 'host': settings.MONGODB_HOST, 'port': settings.MONGODB_PORT}
app.config['MANDRILL_API_KEY'] = 'AW8kuRPFtDyZpOrgSf-0BQ'
app.config['MANDRILL_DEFAULT_FROM'] = 'noreply@fitrangi.com'
mandrill = Mandrill(app)
db = MongoEngine()
db.init_app(app)


#from flask.ext import login
cache = Cache(app,config={'CACHE_TYPE': 'simple'})
admin = None
api = MongoRest(app)
app.jinja_env.cache = {}

def start_app():
    global admin
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

    class MyAdminIndexView(AdminIndexView):

        @expose('/')
        def index(self):
            if not (hasattr(g, 'user') and g.user is not None and 'Admin' in g.user.roles):
                return redirect('/')
            return super(MyAdminIndexView, self).index()


    admin = flask_admin.Admin(app, 'Fitrangi Dashboard',index_view=MyAdminIndexView(), base_template='/admin/base_admin.html')




start_app()
from app.views.admin import *
from app.views.site import *
#from app.handlers.examples import *

