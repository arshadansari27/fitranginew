
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

            if self.command == 'save-cover':
                response = save_cover(self.type, self.data['model'], self.data['url'])
            else:
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
        if type == 'base':
            return NodeEditor(message)
        elif type == PROFILE:
            return ProfileEditor(message)
        elif type == POST:
            return PostEditor(message)
        elif type == ARTICLE:
            return ContentEditor(message, ARTICLE)
        elif type == DISCUSSION:
            return ContentEditor(message, DISCUSSION)


@response_handler(success="Successfully uploaded cover image", failure="Failed to upload cover image")
def save_cover(type, model, url):
    from app.models import NodeFactory
    node = NodeFactory.get_by_id(type, model)
    if not node:
        raise Exception("Invalid model id")
    image = url
    if image and len(image) > 0:
        image       = image.split('/')[-1]
        path        = os.getcwd() + '/tmp/' + image
    else:
        raise Exception('Invalid image')
    if path:
        node.cover_image.replace(open(path, 'rb'))
    if type == 'profile':
        node.uploaded_image_cover = True
    path = os.getcwd() + '/app/assets/' + node.path_cover_image if len(node.path_cover_image) > 0 else 'some-non-existent-path'
    if os.path.exists(path):
        os.remove(path)

    node.save()
    return node
