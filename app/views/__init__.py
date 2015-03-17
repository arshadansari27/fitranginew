from app.models.profile import Profile
from app import  app

__author__ = 'arshad'



from functools import wraps
from flask import g, redirect, request, url_for, abort

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
    g.user = Profile.objects(email__iexact='arshadansari27@gmail.com').first() # arshadansari27
    print g.user
