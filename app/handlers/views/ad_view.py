__author__ = 'arshad'
__author__ = 'arshad'

from flask import render_template, g

from app.models import Channel, Content, Node
from app.handlers.views.menu_view import MenuView
from app.handlers.views import env
from app.handlers.extractors import model_extractor


class AdView(object):

    def __init__(self, action, advertisement=None):
        self.action = action
        self.model = advertisement
        _template = "%s%s"
        if action == 'list':
            self.template = _template % (self.model.__class__.__template__, 'card.html')
        elif action == 'detail':
            raise Exception("Not implemented")

    def render(self, size=3):
        if self.action == 'list':
            template = env.get_template(self.template)
            return template.render(model=self.model)
        else:
            raise Exception("Not implemented yet.")


