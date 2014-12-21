from functools import wraps
from flask import g, redirect, request, url_for

def login_required(func):

    @wraps(func)
    def decoration(*args, **kwargs):
        if hasattr(g, 'user') and g.user is not None and g.user.id is not None:
            return func(*args, **kwargs)
        else:
            return redirect('login')

    return decoration

def redirect_url(default='login'):
    return request.args.get('next') or request.referrer or url_for(default)
