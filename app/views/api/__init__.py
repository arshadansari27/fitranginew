__author__ = 'arshad'
from flask import g, request
from flask.ext.mongorest.authentication import AuthenticationBase

def check_auth():
    if hasattr(g, 'user')  and g.user is not None and g.user.id is not None:
        return True

class AllRequestAuthentication(AuthenticationBase):
    def authorized(self):
        return check_auth()

class AllRequestSaveGetAuthentication(AuthenticationBase):
    def authorized(self):
        if request.method == 'GET':
            return True
        return check_auth()


