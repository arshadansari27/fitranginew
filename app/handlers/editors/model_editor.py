__author__ = 'arshad'

from flask import render_template, request, g, flash

from app.models import *
from app.handlers.views.menu_view import MenuView
from app.utils import arrange_facets


class ModelEditor(object):

    def __init__(self, model, channel_name=None, form=None):
        self.channel = Channel.getByName(channel_name)
        model_class = Node.model_factory(self.channel.name)
        if model:
            self.model = model_class.objects(pk=model).first()
            if not self.model.main_image or not self.model.main_image.image:
                self.model.has_no_image = True
            else:
                self.model.has_no_image = False
        else:
            self.model = model_class()
            self.model.has_no_image = True

        self.template = '%s%s' % (model_class.__template__, 'editor.html')
        self.menu_view = MenuView(channel_name)
        self.form = form
        self.message = None
        self.category = None

    def render(self):
        return render_template(self.template, model=self.model, menu=self.menu_view, user=g.user, channel=self.channel.name, facets=arrange_facets(Facet.all_facets))

    def get_data_from_form(self):
        data = dict((k, v) for k, v in self.form.iteritems() if k != 'action')
        if data.has_key('published') and data['published'] == 'on':
            data['published'] = True
        else:
            data['published'] = False
        return data

    def add_new(self):
        data = self.get_data_from_form()
        try:
            category = 'success'
            model_class = Node.model_factory(self.channel.model.lower())
            self.model = model_class()
            if g.user and g.user.id:
                user = g.user
            else:
                user = None
            self.model = self.model.add_new(user, **data)
            message = 'Added '+ self.channel.name + '.'
        except Exception, e:
            category = 'error'
            message = str(e)
        flash(message, category=category)


    def update(self):
        data = self.get_data_from_form()
        try:
            category = 'success'
            if self.form['action'] == 'update_existing':
                self.model = self.model.update_existing(**data)
                message = 'Updated the ' + self.__class__.__name__.lower() +'.'
            elif self.form['action'] == 'change_password':
                if data['confirm'] != data['password']:
                    raise Exception('Passwords do not match.')
                self.model = self.model.change_password(**data)
                message = 'Successfully changed the password.'
            elif self.form['action'] == 'image_upload':
                image = request.files['image']
                self.model = self.model.upload_image(image)
                message = 'Successfully uploaded the image.'
            else:
                raise Exception("Unimplemented model updater")
        except Exception, e:
            category = 'error'
            message = str(e)
        flash(message, category=category)



