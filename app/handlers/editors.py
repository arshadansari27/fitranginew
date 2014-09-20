from app.models import *
from flask import render_template, request, g, session, flash, redirect, url_for
from jinja2 import Environment, FileSystemLoader
from app.settings import TEMPLATE_FOLDER
from app import app
from app.handlers.pageviews import MenuView
import simplejson as json

env = Environment(loader=FileSystemLoader(TEMPLATE_FOLDER))

class ModelEditor(object):

    def __init__(self, model, channel_name=None, subchannel_name=None, form=None):
        self.channel = Channel.getByName(channel_name)
        if subchannel_name:
            self.subchannel = Channel.getByName(subchannel_name)
        else:
            self.subchannel = None
        model_name = self.channel.model
        model_class = Node.model_factory(model_name.lower())
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
        self.menu_view = MenuView(channel_name, subchannel_name if subchannel_name else None)
        self.form = form
        self.message = None
        self.category = None

    def render(self):
        if hasattr(self, 'subchannel') and self.subchannel is not None:
            subchannel = self.subchannel
        else:
            subchannel = None
        return render_template(self.template, model=self.model, menu=self.menu_view, user=g.user, channel=self.channel.name, subchannel=subchannel)

    def add_new(self):
        data = dict((k, v) for k, v in self.form.iteritems())
        try:
            category = 'success'
            model_class = Node.model_factory(self.channel.model.lower())
            self.model = model_class()
            self.model = self.model.update_existing(**data)
            message = 'Added profile for ' + self.__class__.__name__.lower() +'.'
        except Exception, e:
            category = 'error'
            message = str(e)
        flash(message, category=category)


    def update(self):
        data = dict((k, v) for k, v in self.form.iteritems())
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


@app.route('/model/<channel>/<key>/edit', methods=['GET', 'POST'])
@app.route('/model/<channel>/add', methods=['GET', 'POST'])
def model_editor_view(channel, key=None):
    if request.method == 'POST':
        if key:
            ModelEditor(key, channel_name=channel, form=request.form).update()
        else:
            form = {}
            for k, v in request.form.iteritems():
                if k == 'channels':
                    form[k] = request.form.getlist(k)
                else:
                    form[k] = v
            if not form.has_key('channels'):
                form['channels'] = [channel]
                if channel == 'Profile':
                    form['channels'].append('Enthusiast')
            me = ModelEditor(key, channel_name=channel, form=form)
            me.add_new()
            key = str(me.model.id)
            return redirect('/model/%s/%s/edit' % (channel, key))
    if key:
        return ModelEditor(key, channel_name=channel).render()
    else:
        return ModelEditor(key, channel_name=channel).render()
