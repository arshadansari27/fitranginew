from app.config import get_activities
from app.models.profile import Profile
from app import  app, cache
from app.views.site import view_menu

__author__ = 'arshad'



from functools import wraps
from flask import g, redirect, request, url_for, abort

from jinja2 import Environment, FileSystemLoader
from app.settings import TEMPLATE_FOLDER

env = Environment(loader=FileSystemLoader(TEMPLATE_FOLDER))

def login_required(func):

    @wraps(func)
    def decoration(*args, **kwargs):
        admin_user = Profile.objects(roles='Admin').first()
        g.user = admin_user
        if hasattr(g, 'user') and g.user is not None and g.user.id is not None:
            return func(*args, **kwargs)
        else:
            return redirect('login')

    return decoration


def redirect_url(default='login'):
    return request.args.get('next') or request.referrer or url_for(default)


@app.before_request
def setup_user():
    g.user = None#Profile.objects(email__iexact='arshadansari27@gmail.com').first()

def force_setup_context(context={}):
    user = g.user if hasattr(g, 'user') and g.user is not None else None
    activity_menu = view_menu()
    d = dict(user=user, activity_menu=activity_menu, menu=get_menu_selection(request.path))
    for k, v in d.iteritems():
        context[k] = v
    return context


@app.context_processor
def setup_context():
    user = g.user if hasattr(g, 'user') and g.user is not None else None
    activity_menu = view_menu()
    return dict(user=user, activity_menu=activity_menu, menu=get_menu_selection(request.path))

@cache.cached(timeout=3600 * 24)
def get_menu_selection(request_path):
    top, main, inner = None, None, None
    if '/explore' in request_path:
        top = 'explore'
        if '/activity' in request_path:
            main = 'activity'
            for k, v in get_activities().iteritems():
                for i, j in v.iteritems():
                    if request_path in j or j in request_path:
                        inner = i
        elif '/adventure' in request_path:
            main = 'adventure'
        else:
            main = None
    elif '/community' in request_path:
        top = 'community'
        if '/discussion' in request_path:
            main = 'discussion'
        elif '/profile' in request_path:
            main = 'profile'
        else:
            main = None
    elif '/journal' in request_path:
        top = 'journal'
        if '/content' in request_path:
            main = 'content'
        elif '/write' in request_path:
            main = 'write'
        else:
            main = None
    else:
        top = None

    class Menu(object):
        def __init__(self, top, main, inner):
            self.app_name = top
            self.main_menu = main
            self.inner = inner

        def __repr__(self):
            return "%s -> %s -> %s" % (self.app_name, self.main_menu, self.inner)

    menu = Menu(top, main, inner)
    return menu

from .common import *