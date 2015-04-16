
__author__ = 'arshad'

from flask import request, redirect, flash, g, render_template, jsonify, send_file, url_for

#from app.handlers.editors.model_editor import ModelEditor
from app.handlers.messaging import send_single_email
from app import app
#from app.handlers import login_required, redirect_url
#from app.models import Profile, Post, Content
from StringIO import StringIO
import random, os
from PIL import Image



from app.models import PROFILE, ACTIVITY, ADVENTURE, ARTICLE, POST, EVENT, TRIP, DISCUSSION
#from app.views.site.extractors import NodeExtractor

__author__ = 'arshad'

from flask import jsonify


def response_handler(success, failure, login_required=True):
    def wrap(f):
        def wrapped_f(*kargs, **kwargs):
            if login_required:
                if not hasattr(g, 'user') or g.user is None or not hasattr(g.user, 'id') or g.user.id is None:
                    return dict(status='error', message='Please login before making requests')
            try:
                node = f(*kargs, **kwargs)
                print node
                return dict(status='success', message=success, node=str(node.id))
            except Exception, e:
                return dict(status='error', message=failure, exception=str(e))
        return wrapped_f
    return wrap


class NodeEditor(object):

    def __init__(self, message):
        self.message = message
        self.command = message.get('command', None)
        self.action = message.get('action', None)
        self.data = message.get('data', None)
        self.node = message.get('node', None)
        self.type = message.get('type', None)

    def invoke(self):
        try:
            print '[Editor] Request:', self.message
            response = self._invoke()
            print '[Editor] Response:', response
            return jsonify(response)
        except Exception, e:
            return jsonify(dict(status='error', message='Failed to execute the command'))

    def _invoke(self):
        raise Exception("Not implemented")

    @classmethod
    def factory(cls, message):
        from app.handlers.editors.profile import ProfileEditor
        from app.handlers.editors.post import PostEditor
        from app.handlers.editors.content import ContentEditor
        type = message['type']
        if type is None:
            raise Exception("Invalid message")
        elif type == PROFILE:
            return ProfileEditor(message)
        elif type == POST:
            return PostEditor(message)
        elif type == ARTICLE:
            return ContentEditor(message, ARTICLE)
        elif type == DISCUSSION:
            return ContentEditor(message, DISCUSSION)
