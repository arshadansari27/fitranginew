__author__ = 'arshad'

from jinja2 import Environment, FileSystemLoader
from flask import render_template, request, g, flash, redirect, url_for, session, send_file, jsonify

from app import app, cache
from app.models import *
from app.settings import TEMPLATE_FOLDER
from app.handlers.views import api
from email.utils import parseaddr
import re

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
    channel = request.args.get('channel', None)
    if not channel:
        return SearchView(query=query).render()
    else:
        return ChannelView(channel, paginated=False, selected_facets=[], query=query,page=1, only_facet=False).render()


@app.route('/user/subscribe', methods=['POST'])
def subscribe():
    try:
        user_email = request.form['email']
        message = SubscriptionMessage(message=parseaddr(user_email)[1])
        message.save()
        flash('Successfully subscribed.', category='success')
    except Exception, e:
        print e
        flash('Something went wrong with subscription, please try again later', category='error')
    return redirect('/')

@app.route('/img/<model_name>/<key>')
def get_img(model_name, key):
    from app.models import Node
    model_class = Node.model_factory(model_name)
    img = model_class.objects(pk=key).first().get_image()
    if img:
        return send_file(img, mimetype='image/' + img.format)
    else:
        return ''

@app.route('/img/advertisement/<key>')
def get_img_advert(key):
    from app.models import Advertisement
    a = Advertisement.objects(pk=key).first()
    if not a:
        return '', 404
    img, format = a.get_image()
    if not img:
        return 404
    return send_file(img, mimetype='image/'+format)

@app.route('/model/Activity')
def getActivity():
    name = request.args.get('title', None)
    if name:
        from app.models import Content
        regx = re.compile(name, re.IGNORECASE)
        activity =  Content.objects(__raw__={'title': {'$regex': regx}}).first()
        print "Activy: ", activity
        return redirect('/model/Activity/%s' % str(activity.id))
    else:
        return redirect("/")

@app.route('/channel/<channel>')
def channel(channel):
    page = request.args.get('page', 1)

    query = request.args.get('query', '')
    _facets = request.args.get('facets','')
    if request.args.get('only', False):
        only = True
    else:
        only = False
    facets = [v for v in (_facets.split(',') if len(_facets) > 0 else []) if v and len(v)  > 0]
    print facets
    return ChannelView(channel, paginated=False, selected_facets=facets, query=query,page=page, only_facet=only).render()


def under_construction(e):
    return render_template('generic/main/under_construction.html'), 500

def page_not_found(e):
    return render_template('generic/main/under_construction.html'), 404

@app.route('/model/<channel>/<key>')
def model(channel, key):
    return ModelView(key, 'detail', channel_name=channel).render()

@app.route('/api/models/<channel>', methods=['GET'])
def search_models(channel):
    d = api.ModelApi(channel_name=channel, facets=request.args.get('facets', None), query=request.args.get('query', None), paged=True)
    return jsonify(dict(result=d.dictify()))

@app.route("/comments/<content_key>/delete/<key>", methods=["POST"])
def comment_delete(content_key, key):
    try:
        content = Content.get_by_id(content_key)
        location = request.form['location']
        comment_delete = None
        for comment in content.comments:
            if comment.key == key:
                comment_delete = comment
                break
        if comment_delete:
            content.comments.remove(comment)
            content.save()
            flash("Successfully added the comment", category='success')
        else:
            flash("Comment could not be deleted", category='error')
        return redirect(location)
    except Exception, e:
        flash("Failed to add the comment", category='error')
        return jsonify(status='error', node=None, message="Failed to add the comment")

@app.route("/comment", methods=["POST"])
@app.route("/comment/<key>", methods=["POST"])
def comment(key=None):
    _type = request.json['type'] if request.json.get('type') is not None else "comment"
    try:
        user = g.user
        comment = request.json['comment']
        if not key:
            key = request.json['key']
        content = Content.get_by_id(key)
        content.addComment(content.id, comment, user.id)
        flash("Successfully added the comment", category='success')
        return jsonify(status='success', node=None, message="Successfully added the %s." % _type)
    except Exception, e:
        flash("Failed to add the comment", category='error')
        return jsonify(status='error', node=None, message="Failed to add the %s." % _type)


@app.route('/register', methods=['GET', 'POST'])
def registration():
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
        if profile and (profile._id or profile.id):
            session['user'] = str(profile._id)
            event = LoginEvent(user=session['user'], url=request.url, ip_address=request.remote_addr)
            event.save()
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


@app.after_request
def after_request(response):
    if hasattr(g, 'user') and hasattr(g.user, 'id'):
        user = g.user
    else:
        user = None
    if '/assets' in request.url or '/img' in request.url or '/login' in request.url:
        return response
    event = VisitEvent(user=str(user.id) if user else None, url=request.url, ip_address=request.remote_addr)
    event.save()
    return response
