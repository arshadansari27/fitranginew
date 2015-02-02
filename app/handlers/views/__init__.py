__author__ = 'arshad'

from jinja2 import Environment, FileSystemLoader
from flask import render_template, request, g, flash, redirect, url_for, session, send_file, jsonify

from app import app, cache
from app.models import *
from app.settings import TEMPLATE_FOLDER
from app.handlers.views import api
from email.utils import parseaddr
from app.handlers.messaging import send_single_email
import re

env = Environment(loader=FileSystemLoader(TEMPLATE_FOLDER))

from app.handlers import login_required
from app.handlers.views.facet_view import FacetView
from app.handlers.views.menu_view import MenuView
from app.handlers.views.model_view import ModelView
from app.handlers.views.channel_view import ChannelView,StreamView
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


@app.route('/forgot_password', methods=['POST'])
def forgot_password():
    try:
        profile = Profile.objects(email__iexact=request.form['email']).first()
        if profile is None or profile.id is None:
            flash('This email is not registered, please try registering or login with social account.', category='danger')
            return redirect(url_for('login'))
        else:
            flash("Successfully sent email with new password.", category='success')
            mail_data = render_template('notifications/password_reset.html', user=profile)
            import random
            u, v, w = list('ABCEFGHIJKLMNOPQRSTUVWXYZ'), list('abcefghijklmnopqrstuvwxyz'), range(0, 10)
            random.shuffle(u), random.shuffle(v), random.shuffle(w)
            old_password = profile.password
            profile.password = "%s%s%s" % (''.join(u[0:5]), ''.join(v[0:5]), ''.join(str(x) for x in w[0:3]))
            profile.save()
            from app.handlers.messaging import send_single_email
            send_single_email("[Fitrangi] Password reset on Fitrangi.com", to_list=[profile.email], data=mail_data)
            return redirect('/')
    except Exception,e:
        flash('Something went wrong with subscription, please try again later', category='danger')
        if profile and old_password:
            profile.password = old_password
            profile.save()
    return redirect('/')

@app.route('/user/subscribe', methods=['POST'])
def subscribe():
    try:
        user_email = request.form['email']
        message = SubscriptionMessage(message=parseaddr(user_email)[1])
        mail_data = render_template('notifications/subscribed.html')
        send_single_email("[Fitrangi] Successfully subscribed for fitrangi updates", to_list=[user_email], data=mail_data)
        message.save()
        flash('Successfully subscribed.', category='success')
    except Exception, e:
        print e
        flash('Something went wrong with subscription, please try again later', category='danger')
    return redirect('/')

@app.route('/img/<model_name>/<key>')
def get_img(model_name, key):
    from app.models import Node
    model_class = Node.model_factory(model_name)
    img = model_class.objects(pk=key).first().get_image()
    if img:
        return send_file(img, mimetype='image/' + img.format, add_etags=False, conditional=True)
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
    return send_file(img, mimetype='image/'+format, add_etags=False, conditional=True)

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

@app.route('/stream/<i>')
@login_required
def stream(i):
    page = request.args.get('page', 1)
    return StreamView(page=page).render()


def under_construction(e):
    return render_template('generic/main/under_construction.html'), 500

def page_not_found(e):
    return render_template('generic/main/under_construction.html'), 404

@app.route('/model/<channel>/<key>')
def model(channel, key):
    return ModelView(key, 'detail', channel_name=channel).render()

@app.route('/profile/<slug>')
@app.route('/content/<slug>')
def model_by_slug(slug):
    return ModelView(request.path, 'detail', is_slug=True).render()


@app.route('/api/tags', methods=['GET'])
def search_tags():
    d = api.TagApi(query=request.args.get('query', None))
    return jsonify(dict(result=d.dictify()))

@app.route('/api/models/<channel>', methods=['GET'])
def search_models(channel):
    d = api.ModelApi(channel_name=channel, facets=request.args.get('facets', None), query=request.args.get('query', None), paged=True)
    return jsonify(dict(result=d.dictify()))

@app.route("/comments/<content_key>/delete/<key>", methods=["POST"])
@login_required
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
            flash("Comment could not be deleted", category='danger')
        return redirect(location)
    except Exception, e:
        flash("Failed to add the comment", category='danger')
        return jsonify(status='error', node=None, message="Failed to add the comment")

@app.route("/comment", methods=["POST"])
@app.route("/comment/<key>", methods=["POST"])
@login_required
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
        mail_data = render_template('notifications/comment_posted.html', model=content)
        send_single_email("[Fitrangi] Response to your content posted", to_list=[user.email], data=mail_data)
        return jsonify(status='success', node=None, message="Successfully added the %s." % _type)
    except Exception, e:
        print e
        flash("Failed to add the comment", category='danger')
        return jsonify(status='error', node=None, message="Failed to add the %s." % _type)


@app.route('/register', methods=['GET', 'POST'])
def registration():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        password = request.form['password']
        confirm = request.form['confirm']
        if password != confirm:
            flash('Passwords do not match', category='danger')
            return redirect(url_for('registration'))
        if Profile.objects(email__iexact=email).first():
            flash('Email already exists, have you forgotten your password?', category='danger')
            return redirect(url_for('registration'))
        profile = Profile.create_new(name, email, password)
        print profile.name, profile.email
        profile = Profile.authenticate(email, password)
        print profile.name, profile.email
        if profile and profile.id:
            set_session_and_login(profile)
            flash('Successfully Created Your Account.', category='success')
            mail_data = render_template('notifications/successfully_registered.html', user=profile)
            send_single_email("[Fitrangi] Successfully registered", to_list=[profile.email], data=mail_data)
            return redirect(url_for('home'))

    return render_template('/generic/main/registration.html', menu=MenuView(None))


@app.route('/sociallogin', methods=['POST'])
def social_login():
    if request.method != 'POST':
        return render_template('/generic/main/login.html', menu=MenuView(None))
    name = request.form['name']
    email = request.form['email']
    profile = Profile.objects(email__iexact=email).first()
    if profile is None or profile.id is None:
        profile = Profile.create_new(name, email, "", is_verified=True, roles=['Enthusiast'])
        profile.save()
    if profile.is_social_login is None or not profile.is_social_login:
        profile.is_social_login = True
        profile.save()
    if profile.is_social_login and profile.id:
        set_session_and_login(profile)
        return jsonify(dict(location=url_for('home'), status='success'))
    return jsonify(dict(location=url_for('login'), status='error'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('username', None)
        password = request.form.get('password', None)
        profile = Profile.authenticate(email, password)
        if profile and profile.id:
            set_session_and_login(profile)
            flash('Successfully logged in.', category='success')
            return redirect(url_for('home'))
    return render_template('/generic/main/login.html', menu=MenuView(None))


def set_session_and_login(profile):
    session['user'] = str(profile.id)
    event = LoginEvent(user=session['user'], url=request.url, ip_address=request.remote_addr)
    event.save()

@app.route('/logout', methods=['GET', 'POST'])
@login_required
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
