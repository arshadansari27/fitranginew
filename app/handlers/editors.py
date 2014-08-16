from flask import Blueprint, request, redirect, render_template, url_for, abort, flash, g
from flask.views import MethodView
from app.models import * 
import os, urllib, binascii
from extractors import get_logged_in_user

from app import app

class RegisterationEditor(object):

    def post(self):
        payload = request.json or {}
        print '*' * 100
        print "JSON", request.json
        print payload
        print '*' * 100
        name, email, password = payload.get('name'), payload.get('email'), payload.get('password')
        node = Service.registerProfile(name, email, password)
        if node:
            return {'status': 'success', 'node': node.__dict__, "message": "Successfully registered with email: " + email}
        else:
            return {'status': 'error', 'node': None, 'message': 'Unable to register at this moment'}


class LoginView(object):

    def post(self):
        payload = request.json or {}
        print '*' * 100
        print "JSON", request.json
        print payload
        print '*' * 100
        email, password = payload.get('email'), payload.get('password')
        user = User.authenticate(email, password)
        if user:
            return {'status': 'success', 'node': user.__dict__, "message": "Successfully logged in"}
        else:
            return {'status': 'error', 'node': None, 'message': 'Unable to log you in'}

class LogoutView(object):
    def post(self):
        user = logged_in_user() 
        if user:
            print "Logging out", user.id
            if user.logout_user():
                return {'status': 'success', 'message': 'Logout successfull'}

        return {'status': 'error', 'message': 'Something went bad'}


@app.route('/comment', methods=['POST'])
def postComment():
    author = get_logged_in_user() 
    if author:
        payload = request.json or {}
        comment_text = payload.get('comment')
        post_key    = payload.get('key')
        Content.addComment(post_key, comment_text, author)
        return {'status': 'success',  'message': 'Successfully posted the comment'}
    else:
        return {'status': 'error', 'message': 'Please login first.'}



