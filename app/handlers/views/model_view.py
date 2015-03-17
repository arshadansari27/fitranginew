__author__ = 'arshad'

from flask import render_template, g

from app.models import Content, Node
from app.handlers.views.menu_view import MenuView
from app.handlers.views.ad_view import AdView
from app.handlers.views import env
from app.handlers.extractors import model_extractor
import random

class ModelView(object):

    def __init__(self, model, action, default='card', channel_name=None, is_slug=False, detail_link=None):
        self.action = action
        self.model = model
        _template = "%s%s"
        if action == 'list':
            if default == 'card':
                self.template = _template % (model.__class__.__template__, 'card.html')
            elif default == 'row':
                self.template = _template % (model.__class__.__template__, 'row.html')
            elif default == 'banner':
                self.template = _template % (model.__class__.__template__, 'banner.html')
            elif default == 'list':
                self.template = _template % (model.__class__.__template__, 'list.html')
            elif default == 'circle':
                self.template = _template % (model.__class__.__template__, 'circle.html')
            else:
                raise Exception("Unsupported")
        elif action == 'detail':
            if channel_name:
                channel = None #Channel.getByName(channel_name)
                model_class = Node.model_factory(channel.name)
            else:
                model_class = Content
            if is_slug:
                self.model = model_class.get_by_slug(model)
                channel_name = self.model.channels[0]
            else:
                self.model = model_class.get_by_id(model)
            self.related_models = model_extractor.get_related(self.model)
            self.related = [ModelView(m, 'list')  for m in self.related_models]
            if not self.model.main_image or not self.model.main_image.image:
                self.model.has_no_image = True
            else:
                self.model.has_no_image = False
            self.template = _template % (self.model.__class__.__template__, 'detail.html')
            self.menu_view = MenuView(channel_name)
            self.channel_name = channel_name
        elif action == 'admin_list':
            self.detail = detail_link
            self.template = _template % (model.__class__.__template__, 'table.html')


    def render(self, size=3):
        if self.action == 'list':
            template = env.get_template(self.template)
            return template.render(model=self.model, size=size)
        elif self.action == 'admin_list':
            template = env.get_template(self.template)
            return template.render(model=self.model, size=size, detail=self.detail)
        else:
            if 'Profile' in self.model.channels or 'Enthusiast' in self.model.facets:
                contents = Content.objects(created_by__exact=self.model).all()[0: 3]
                adverts = []
            else:
                contents = []
                _adverts = None #Advertisement.get_internal_advertisements()
                random.shuffle(_adverts)
                adverts = [AdView('list', a) for a in _adverts]
            return render_template(self.template, channel=self.channel_name, model=self.model, menu=self.menu_view, user=g.user, contents=contents, related=self.related, adverts=adverts)

