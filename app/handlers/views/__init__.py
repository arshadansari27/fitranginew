__author__ = 'arshad'

from jinja2 import Environment, FileSystemLoader
from app import app
from app.models import *
from app.settings import TEMPLATE_FOLDER
from flask import render_template, request, g, flash, redirect, url_for, session, send_file, jsonify

env = Environment(loader=FileSystemLoader(TEMPLATE_FOLDER))

from app.handlers.views.facet_view import FacetView
from app.handlers.views.menu_view import MenuView
from app.handlers.views.model_view import ModelView
from app.handlers.views.channel_view import ChannelView
from app.handlers.views.main_view import HomeView, SearchView


@app.route('/')
def home():
    return HomeView(query=None).render()

@app.route('/search')
def search():
    query = request.args.get('search-query', '')
    return SearchView(query=query).render()


@app.route('/img/<model_name>/<key>')
def get_img(model_name, key):
    from app.models import Node
    model_class = Node.model_factory(model_name.lower())
    img = model_class.objects(pk=key).first().get_image()
    return send_file(img, mimetype='image/' + img.format)

@app.route('/channel/<channel>')
def channel(channel):
    page = request.args.get('page', 1)
    query = request.args.get('query', '')
    subchannel = request.args.get('subchannel', '')
    _facets = request.args.get('facets','')
    facets = [v for v in (_facets.split(',') if len(_facets) > 0 else []) if v and len(v)  > 0]
    return ChannelView(channel, subchannel, paginated=False, selected_facets=facets, query=query,page=page).render()


def under_construction(e):
    return render_template('generic/main/under_construction.html'), 500

def page_not_found(e):
    return render_template('generic/main/under_construction.html'), 404

@app.route('/model/<channel>/<key>')
def model(channel, key):
    subchannel = request.args.get('subchannel', '')
    return ModelView(key, 'detail', channel_name=channel, subchannel_name=subchannel).render()

@app.route('/register', methods=['GET', 'POST'])
def registeration():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        password = request.form['password']
        confirm = request.form['confirm']
        if password != confirm:
            flash('Passwords do not match', category='error')
            return redirect(url_for('registeration'))
        profile = Profile.create_new(name, email, password)
        if profile:
            flash('Successfully created your account. Please login.', category='success')
            return redirect(url_for('login'))
    return render_template('/generic/main/registration.html', menu=MenuView(None))


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('username', None)
        password = request.form.get('password', None)
        profile = Profile.authenticate(email, password)
        if profile:
            session['user'] = str(profile._id)
            flash('Successfully logged in.', category='success')
            return redirect(url_for('home'))
    return render_template('/generic/main/login.html', menu=MenuView(None))

@app.route('/logout', methods=['GET', 'POST'])
def logout():
    if hasattr(g, 'user'):
        g.user = None
    session.clear()
    return redirect(url_for('home'))

@app.before_request
def before_request():
    userid = session.get('user', None)
    if userid is None or len(userid) == 0:
        g.user = None
    else:
        user = Profile.objects(pk=userid).first()
        if user:
            g.user = user
        else:
            g.user = None
