__author__ = 'arshad'

from flask import render_template, g
from app.models import Channel, Content, Node
from app.handlers.views.facet_view import FacetView
from app.handlers.views.menu_view import MenuView
from app.handlers.views import env


class ModelView(object):

    def __init__(self, model, action, default='card', channel_name=None, subchannel_name=None):
        self.action = action
        self.model = model
        _template = "%s%s"
        if action == 'list':
            if default == 'card':
                self.template = _template % (model.__class__.__template__, 'card.html')
            elif default == 'row':
                self.template = _template % (model.__class__.__template__, 'row.html')
            else:
                raise Exception("Unsupported")
        elif action == 'detail':
            if channel_name:
                channel = Channel.getByName(channel_name)
                model_name = channel.model
                model_class = Node.model_factory(model_name.lower())
            else:
                model_class = Content
            self.model = model_class.objects(pk=model).first()
            if not self.model.main_image or not self.model.main_image.image:
                self.model.has_no_image = True
            else:
                self.model.has_no_image = False
            self.template = _template % (self.model.__class__.__template__, 'detail.html')
            self.menu_view = MenuView(channel_name, subchannel_name if subchannel_name else None)
            self.channel_name = channel_name
            self.subchannel_name = subchannel_name

    def render(self):
        if self.action == 'list':
            template = env.get_template(self.template)
            return template.render(model=self.model)
        else:
            if 'Profile' in self.model.channels or 'Enthusiast' in self.model.channels:
                contents = Content.objects(created_by__exact=self.model).all()[0: 3]
            else:
                contents = []
            return render_template(self.template, channel=self.channel_name, subchannel=self.subchannel_name, model=self.model, menu=self.menu_view, user=g.user, contents=contents)

