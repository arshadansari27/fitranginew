import os

from flask import Flask
import flask_admin
from flask.ext.cache import Cache
from flask.ext.mongoengine import MongoEngine
from app import settings


app = Flask(__name__, template_folder='templates', static_folder='assets')
app.jinja_env.add_extension('jinja2.ext.loopcontrols')
app.config['SECRET_KEY'] = os.urandom(24)
app.config['MONGODB_SETTINGS'] = {'DB': settings.MONGODB_DB, 'HOST': settings.MONGODB_HOST, 'PORT': settings.MONGODB_PORT}

db = MongoEngine()
db.init_app(app)

#from flask.ext import login
cache = Cache(app,config={'CACHE_TYPE': 'simple'})

def start_app():
    from app.models.sessions import MongoSessionInterface
    from app.models import *
    import logging
    app.session_interface = MongoSessionInterface()
    logging.basicConfig()
    logging.getLogger().setLevel(logging.DEBUG)

    from app.models.admin import ProfileView, ContentView, EventView, ProductView, AnalyticsView, MessageView, AdvertisementView
    admin = flask_admin.Admin(app, 'Fitrangi Admin Panel')
    admin.add_view(ProfileView(Profile))
    admin.add_view(ContentView(Content))
    admin.add_view(EventView(Event))
    admin.add_view(ProductView(Product))
    admin.add_view(AnalyticsView(AnalyticsEvent)) # Use aggregate values
    admin.add_view(MessageView(Message))
    admin.add_view(AdvertisementView(Advertisement))

    from app.handlers.views import *
    from app.handlers.editors import *

    import logging
    if not app.debug:
        logging.basicConfig(filename='fitrangi-flask-error.log',level=logging.DEBUG)


start_app()
from app.handlers.examples import *
