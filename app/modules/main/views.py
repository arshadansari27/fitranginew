__author__ = 'arshad'
from app.handlers import login_required

__author__ = 'arshad'

from flask import render_template,g, request,flash, redirect, jsonify, session, url_for
from mongoengine import Q
from flask.ext.classy import FlaskView, route
from app import cache
from app.modules.main import main_module
from app.models.forms import ProfileEdit
from app.models.models import Profile, Content, LoginEvent, Advertisement
from app.handlers.messaging import send_single_email
from app.handlers.extractors.model_extractor import get_models_by
import random, simplejson as json, requests

class AuthenticationView(FlaskView):
    route_base = "/"

    @route('/register', methods=['GET', 'POST'])
    def registration(self):
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
            profile = Profile.authenticate(email, password)
            if profile and profile.id:
                set_session_and_login(profile)
                flash('Successfully Created Your Account.', category='success')
                mail_data = render_template('notifications/successfully_registered.html', user=profile)
                send_single_email("[Fitrangi] Successfully registered", to_list=[profile.email], data=mail_data)
                return redirect('/stream/me')

        return render_template('registration.html')


    @route('/sociallogin', methods=['POST'])
    def social_login(self):
        if request.method != 'POST':
            return render_template('login.html')
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
            return jsonify(dict(location='/stream/me', status='success'))
        return jsonify(dict(location=url_for('AuthenticationView:login'), status='error'))

    @route('/login', methods=['GET', 'POST'])
    def login(self):
        if request.method == 'POST':
            email = request.form.get('username', None)
            password = request.form.get('password', None)
            profile = Profile.authenticate(email, password)
            if profile and profile.id:
                set_session_and_login(profile)
                flash('Successfully logged in.', category='success')
                return redirect('/main/stream/me')
        return render_template('login.html')

    @route('/logout', methods=['GET', 'POST'])
    @login_required
    def logout(self):
        if hasattr(g, 'user'):
            g.user = None
        session.clear()
        return redirect(url_for('AuthenticationView:login'))

class HomeView(FlaskView):
    route_base = "/"

    @route("/subscribe", methods=['GET', 'POST'])
    def subscribe(self):
        return render_template("subscribe.html")

    @route("/forgot_password", methods=['GET', 'POST'])
    def forgot_password(self):
        return render_template("forgot-password.html")

    @route("/")
    def index(self):
        destinations = get_models_by('Destination', limit=6)
        organizers = get_models_by('Profile', ['Organizer'], limit=6)
        articles = get_models_by('Article', limit=4)
        banner_articles = []
        banner_articles.extend(get_models_by('Article', facets=['Top 5 Series'], limit=1))
        banner_articles.extend(get_models_by('Article', facets=['Explore'], limit=1))
        banner_articles.extend(get_models_by('Article', facets=['Informative'], limit=1))
        adventure_trips = get_models_by('Adventure Trip', limit=6)
        _adverts = list(Advertisement.objects(published__exact=True).all()[0: 3])
        adverts = _adverts[0:2]
        if len(_adverts) > 2:
            bottom_add = _adverts[2]
        else:
            bottom_add = None
        return render_template("home.html", banner_articles=banner_articles, articles=articles, destinations=destinations, organizers=organizers,  adventure_trips=adventure_trips, user=g.user, yt_links=get_youtube_links(), adverts=adverts)


def set_session_and_login(profile):
    session['user'] = str(profile.id)
    event = LoginEvent(user=session['user'], url=request.url, ip_address=request.remote_addr)
    event.save()

@cache.cached(timeout=3600)
def get_youtube_links():
    try:
        j_video = json.loads(requests.get("http://gdata.youtube.com/feeds/api/videos?max-results=4&alt=json&orderby=published&author=FitRangi").content)
        youtube_links = []
        for e in j_video['feed']['entry']:
            link = e['id']['$t'].split('/')[-1]
            if link and len(link) > 0:
                youtube_links.append(link)
        return youtube_links
    except:
        return ''


AuthenticationView.register(main_module)
HomeView.register(main_module)
