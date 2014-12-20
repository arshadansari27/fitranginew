__author__ = 'arshad'

from flask.ext.admin.form import rules
from flask.ext.admin.contrib.mongoengine import ModelView, filters
from flask.ext.admin.contrib.mongoengine.filters import BaseMongoEngineFilter


from .models import (Role, Profile, Channel, Content, Event, Product)
from flask import g

class FilterProfile(BaseMongoEngineFilter):
    def apply(self, query, value):
        return query.filter(channels__contains=value)

    def operation(self):
        return 'contains' #self.gettext('contains')

class MyModelView(ModelView):

    def is_accessible(self):
        if hasattr(g, 'user') and hasattr(g.user, 'id') and 'Admin' in g.user.roles:
            return True
        return False

class ProfileView(MyModelView):
    column_filters = ['name']
    column_searchable_list = ('name', 'email')
    column_exclude_list = ['password']
    column_list = ('name', 'username', 'roles', 'email', 'channels', 'main_image.image')

    column_filters = (FilterProfile('Profile', 'Profile Type'),)


    """
    form_ajax_refs = {
        "roles": {
            'fields': ['name']
        }
    }
    """

class ContentView(MyModelView):
    global Channel
    column_filters = ['title']
    column_searchable_list = ('title',)
    column_list = ('title', 'published', 'channels',  'main_image.image')
    column_filters = (FilterProfile('channels', 'Category - Channel'),)

    form_widget_args = {
        'text': {
            'rows': 10,
            'class': 'ckeditor'
        }
    }

    """
    create_template = 'admin_custom/create.html'
    edit_template = 'admin_custom/edit.html'

    form_ajax_refs = {
        "created_by": {
            'fields': ['name']
        },
        "parent": {
            'fields': ['title']
        },
    }

    def _feed_channel_choices(self, form):
        form.channels.choices = [(str(x.name), x.name) for x in [x for x in Channel.all_data_channel]]
        return form

    def create_form(self):
        form = super(ContentView, self).create_form()
        return self._feed_channel_choices(form)

    def edit_form(self, obj):
        form = super(ContentView, self).edit_form(obj)
        return self._feed_channel_choices(form)

    """


class EventView(MyModelView):
    column_filters = ['title']
    column_searchable_list = ('title',)
    column_list = ('title', 'description', 'start_timestamp', 'end_timestamp', 'main_image.image')
    form_ajax_refs = {
        "created_by": {
            'fields': ['name']
        },
    }

class ProductView(MyModelView):
    column_filters = ['title']
    column_searchable_list = ('title',)
    column_list = ('title', 'description', 'price', 'discount', 'main_image.image')
    form_ajax_refs = {
        "created_by": {
            'fields': ['name']
        },
    }

class AnalyticsView(MyModelView):
    column_list = ('ip_address', 'user', 'url', 'event_details')

class MessageView(MyModelView):
    column_list = ('created_by','created_for', 'message')

class AdvertisementView(MyModelView):
    column_list = ('created_by', 'title', 'main_image.image', 'url', 'published')

class TagView(MyModelView):
    column_list = ('name',)
