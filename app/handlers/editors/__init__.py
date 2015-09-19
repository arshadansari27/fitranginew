
__author__ = 'arshad'

from flask import request, redirect, flash, g, render_template, jsonify, send_file, url_for

from app.models import PROFILE, CONTEST, CAMPSITE, ARTICLE, POST, TRIP, DISCUSSION, GEAR, EVENT
from app.models import BusinessException
from app.settings import EXCEPTION_API
import os

__author__ = 'arshad'

from flask import jsonify


def response_handler(success, failure, login_required=True, flash_message=False, no_flash_on_error=False):
    def wrap(f):
        def wrapped_f(*kargs, **kwargs):
            if login_required:
                if not hasattr(g, 'user') or g.user is None or not hasattr(g.user, 'id') or g.user.id is None:
                    return dict(status='error', message='Please login before making requests')
            try:
                node = f(*kargs, **kwargs)
                if flash_message:
                    flash(success)
                return dict(status='success', message=success, node=str(node.id))
            except Exception, e:
                if EXCEPTION_API:
                    raise
                if isinstance(e, BusinessException):
                    if flash_message and not no_flash_on_error:
                        flash(str(e))
                    return dict(status='error', message=str(e), exception=str(e))
                else:
                    if flash_message and not no_flash_on_error:
                        flash(failure)
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
            if self.command == 'save-cover':
                response = save_cover(self.type, self.data['model'], self.data['url'])
            else:
                response = self._invoke()
            return jsonify(response)
        except Exception, e:
            if EXCEPTION_API:
                raise
            return jsonify(dict(status='error', message='Failed to execute the command'))

    def _invoke(self):
        raise Exception("Not implemented")

    @classmethod
    def factory(cls, message):
        from app.handlers.editors.profile import ProfileEditor
        from app.handlers.editors.post import PostEditor
        from app.handlers.editors.content import ContentEditor
        from app.handlers.editors.trip import TripEditor
        from app.handlers.editors.campsite import CampsiteEditor
        from app.handlers.editors.gear import GearEditor
        from app.handlers.editors.event import EventEditor

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
        elif type == CONTEST:
            return ContentEditor(message, CONTEST)
        elif type == TRIP:
            return TripEditor(message, TRIP)
        elif type == CAMPSITE:
            return CampsiteEditor(message, CAMPSITE)
        elif type == GEAR:
            return GearEditor(message, GEAR)
        elif type == EVENT:
            return EventEditor(message, EVENT)
        else:
            raise Exception("Invalid Type")


@response_handler(success="Successfully uploaded cover image", failure="Failed to upload cover image")
def save_cover(type, model, url):
    from app.models import NodeFactory
    node = NodeFactory.get_by_id(type, model)
    print '[*] Uploading cover image...', node, url
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
    node.save()
    node = NodeFactory.get_by_id(type, model)
    path = os.getcwd() + '/app/assets/' + node.path_cover_image if hasattr(node, 'path_cover_image') and node.path_cover_image and len(node.path_cover_image) > 0 else 'some-non-existent-path'
    if os.path.exists(path):
        os.remove(path)
        node.path_cover_image = ''
        node.save()
    return node
