from app.models.forms import ProfileEdit

__author__ = 'arshad'

from flask import render_template, request, g, flash, redirect

from app.models import *
from app.handlers.views.menu_view import MenuView
from app.utils import arrange_facets

class AdEditor(object):

    def __init__(self, model):
        if isinstance(model, str) or isinstance(model, unicode):
            self.model = Advertisement.objects(pk=model).first()
        else:
            self.model = model

        self.template = "/model/advertisement/editor.html"

    def render(self):
        return render_template(self.template, content=self.model, user=g.user, channel='Advertisement')  # facets=arrange_facets(Facet.all_facets)


class ModelEditor(object):

    def __init__(self, model, channel_name=None, form=None, **kwargs):
        self.channel = Channel.getByName(channel_name)
        self.form = form
        model_class = Node.model_factory(self.channel.name)
        if model:
            self.model = model_class.objects(pk=model).first()
            if not self.model.main_image or not self.model.main_image.image:
                self.model.has_no_image = True
            else:
                self.model.has_no_image = False

        else:
            self.model = None

        self.template = '%s%s' % (model_class.__template__, 'editor.html')
        self.message = None
        self.category = None

    def render(self):
        if not g.user and not 'Admin' in g.user.roles and not self.model.created_by.id == g.user.id:
            return redirect('/model/%s/%s' % (self.channel.name, str(self.model.id)))
        return render_template(self.template, content=self.model, user=g.user, channel=self.channel.name)  # facets=arrange_facets(Facet.all_facets)

    @classmethod
    def create_new(cls, owner, channel, title):
        model_class = Node.model_factory(channel)
        if channel == 'Profile':
            model = model_class().add_new(owner, channels=[channel], facets=[], name=title)
        else:
            model = model_class().add_new(owner, channels=[channel], facets=[], title=title)
        if channel == 'Stream':
            model.published, model.admin_published = True, True
        if channel == 'Blog':
            model.published, model.admin_published = False, False
        model.save()
        #editor = ModelEditor(model, channel_name=channel)
        return dict(node=str(model.id), status='success', message='successfully created')

    @classmethod
    def update_existing(cls, channel, model, **kwargs):
        model_class = Node.model_factory(channel)
        if isinstance(model, str):
            model = model_class.get_by_id(model)
        else:
            model = model_class.get_by_id(model.id)
        for k, v in kwargs.iteritems():
            model.update_existing(**kwargs)
            if k == 'published' and (v == 'on' or v == 'true' or v == 'True' or v == True):
                model.published = True
            else:
                model.published = False
            if k == 'admin_published' and (v == 'on' or v == 'true' or v == 'True' or v == True):
                model.admin_published = True
            else:
                model.admin_published = False
            model.save()

        return ModelEditor(model, channel_name=channel)


    @classmethod
    def upload_image(cls, channel, model):
        image = request.files['image']
        model_class = Node.model_factory(channel)
        if isinstance(model, str):
            model = model_class.get_by_id(model)
        else:
            model = model_class.get_by_id(model.id)
        model = model.upload_image(image)
        return ModelEditor(model, channel_name=channel)