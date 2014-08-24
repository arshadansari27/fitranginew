from flask import Flask, request, render_template, session
from flask.ext.mongoengine import MongoEngine
from flask.ext import admin as flask_admin
import os
from app import settings

from flask import send_file
import argparse
import cStringIO
import mimetypes
import requests
from PIL import Image

app = Flask(__name__, template_folder='templates', static_folder='assets')
app.jinja_env.add_extension('jinja2.ext.loopcontrols')
app.config['SECRET_KEY'] = os.urandom(24)
app.config['MONGODB_SETTINGS'] = {'DB': settings.MONGODB_DB, 'HOST': settings.MONGODB_HOST, 'PORT': settings.MONGODB_PORT}
app.debug = True

db = MongoEngine()
db.init_app(app)

#from flask.ext import login

def register_blueprints(app):
    from app.views import blueprints
    from app.views import the_api
    for blueprint in blueprints:
        app.register_blueprint(blueprint)
    app.register_blueprint(the_api)

def start_app():
    from app.models.sessions import MongoSessionInterface
    from app.models import *
    import logging 
    app.session_interface = MongoSessionInterface()
    logging.basicConfig()
    logging.getLogger().setLevel(logging.DEBUG)
    Channel.load_channels()
    Role.load_roles()
    Facet.load_facets()

    admin = flask_admin.Admin(app, 'Fitrangi Admin Panel')
    admin.add_view(ProfileView(Profile))
    admin.add_view(ContentView(Content))
    admin.add_view(EventView(Event))
    admin.add_view(ProductView(Product))

    from app.handlers import *
    from app.handlers.pageviews import *
    from app.handlers.editors import *




#register_blueprints(app)
start_app()
from app.handlers.examples import *
