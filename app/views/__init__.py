from app.config import get_activities
from app.models.profile import Profile
from app import  app, cache

__author__ = 'arshad'



from functools import wraps
from flask import g, redirect, request, url_for, abort, session
from datetime import timedelta
from jinja2 import Environment, FileSystemLoader
from app.settings import TEMPLATE_FOLDER
from app.settings import CDN_URL
from app import USE_CDN

env = Environment(loader=FileSystemLoader(TEMPLATE_FOLDER))

@app.before_request
def before_request():
    session.permanent = True
    if session.get('user') is not None:
        g.user = Profile.objects(pk=session['user']).first()
    else:
        g.user = None
    if session.get('just_logged_in', False):
        g.just_logged_in = True
        session['just_logged_in'] = False

def force_setup_context(context={}):
    user = g.user if hasattr(g, 'user') and g.user is not None else None
    d = dict(user=user, menu=get_menu_selection(request.path))
    if user:
        context['public_activity_count'] = user.public_activity_count if user.public_activity_count else 0
        context['private_activity_count'] = user.private_activity_count if user.private_activity_count else 0
    for k, v in d.iteritems():
        context[k] = v
    context['cdn_url'] = CDN_URL if USE_CDN else ''
    if hasattr(g, 'just_logged_in') and g.just_logged_in:
        context['show_message_notification'] = True
    return context


@app.context_processor
def setup_context():
    user = g.user if hasattr(g, 'user') and g.user is not None else None
    if hasattr(g, 'just_logged_in') and g.just_logged_in:
        show_message_notification = True
    else:
        show_message_notification = False
    return dict(user=user, menu=get_menu_selection(request.path), cdn_url=CDN_URL if USE_CDN else '', show_message_notification=show_message_notification)

#@cache.cached(timeout=3600 * 24)
def get_menu_selection(request_path):
    top, main, inner = None, None, None

    menu_args = [
        ('/activities', ('explore', 'activity')),
        ('/adventures', ('explore', 'adventure')),
        ('/journals', ('explore', 'journal')),
        ('/blog', ('explore', 'blog')),
        ('/profiles', ('community', 'profile')),
        ('/discussions', ('community', 'discussion')),
        ('/events', ('community', 'event')),
        ('/trips', ('explore', 'trip')),
        ('/campsites', ('explore', 'campsite')),
        ('/gears', ('explore', 'gear')),
        ('/', ('explore', None))
    ]

    for k, v in menu_args:
        if k in request.path:
            top, main = v
            break

    if '/activity' in request_path:
        inner = request.args.get('name', None)

    menu = Menu(top, main, inner)
    return menu

class Menu(object):
    def __init__(self, top, main, inner):
        self.app_name = top
        self.main_menu = main
        self.inner = inner

    def __repr__(self):
        return "%s -> %s -> %s" % (self.app_name, self.main_menu, self.inner)


from .messaging import *