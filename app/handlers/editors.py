from app.models import *
#from flask import render_template
from flask import render_template, make_response, abort, request, g, redirect, url_for, session, send_file
from jinja2 import Environment, FileSystemLoader
from app.settings import TEMPLATE_FOLDER
from Queue import Queue
from mongoengine import Q
from app.handlers.extractors import get_all_facets, get_all_models, get_all_models_all_channels
from app.models import Profile
from app import app
from app.handlers.pageviews import MenuView
import simplejson as json

env = Environment(loader=FileSystemLoader(TEMPLATE_FOLDER))

def model_editor(channel, model_key=None, subchannel=None, form=None):
    if form is not None:
        ModelEditor(model_key, channel_name=channel, subchannel_name=subchannel, form=form).update()
        return None
    else:
        return ModelEditor(model_key, channel_name=channel, subchannel_name=subchannel).render()


def setup_flash(category, message):
    session['flash_message'] = json.dumps({'category': category, 'message': message})

def clear_flash():
    session['flash_message'] = None

class ModelEditor(object):

    def __init__(self, model, channel_name=None, subchannel_name=None, form=None):
        self.channel = Channel.getByName(channel_name)
        if subchannel_name:
            self.subchannel = Channel.getByName(subchannel_name)
        else:
            self.subchannel = None
        model_name = self.channel.model 
        model_class = Node.model_factory(model_name.lower())
        self.model = model_class.objects(pk=model).first()
        if not self.model.main_image or not self.model.main_image.image:
            self.model.has_no_image = True
        else:
            self.model.has_no_image = False
        self.template = '%s%s' % (self.model.__class__.__template__, 'editor.html')
        self.menu_view = MenuView(channel_name, subchannel_name if subchannel_name else None)
        self.form = form
        self.message = None
        self.category = None

    def render(self):
        template = env.get_template(self.template)
        return template.render(model=self.model, menu=self.menu_view, user=g.user)

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
        setup_flash(category, message)

        #return ModelEditor(str(self.model.id), self.channel.name, self.subchannel.name if self.subchannel else None).render()

@app.route('/model/<channel>/<key>/edit', methods=['GET', 'POST'])
def model_editor_view(channel, key):
    if request.method == 'POST':
        model_editor(channel, model_key=key, form=request.form)
        return redirect(url_for('model_editor_view', channel=channel, key=key))
    return model_editor(channel, model_key=key)
