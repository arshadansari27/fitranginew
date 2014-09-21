from flask.ext.admin.form import rules
from flask.ext.admin.contrib.mongoengine import ModelView, filters
from flask.ext.admin.contrib.mongoengine.filters import BaseMongoEngineFilter


from .models import (Role, Profile, Channel, Content, Event, Product)

Channel.load_channels()
Role.load_roles()

class FilterProfile(BaseMongoEngineFilter):
    def apply(self, query, value):
        return query.filter(channels__contains=value)

    def operation(self):
        return 'contains' #self.gettext('contains')

class ProfileView(ModelView):
    column_filters = ['name']
    column_searchable_list = ('name', 'username', 'email')
    column_exclude_list = ['password']
    column_list = ('name', 'username', 'roles', 'email', 'channels', 'main_image.image')
    
    column_filters = (FilterProfile('channels', 'Profile Type'),)
    create_template = 'admin_custom/create.html'
    edit_template = 'admin_custom/edit.html'
    form_widget_args = {
        'text': {
            'rows': 10,
            'class': 'ckeditor'
        },
        'name': {
            'class': 'span12'
        },
        'title': {
            'class': 'hide'
        },
        'description': {
            'class': 'span12'
        }
    }

    """
    form_ajax_refs = {
        "roles": {
            'fields': ['name']
        }
    }
    """

"""
class RoleView(ModelView):
    column_filters = ['name']
    column_list = ('name', )
    column_searchable_list = ('name',)

class ChannelView(ModelView):
    column_filters = ['name']
    column_list = ('name', )
    column_searchable_list = ('name',)
"""

class ContentView(ModelView):
    global Channel
    column_filters = ['title']
    column_searchable_list = ('title',)
    column_list = ('title', 'published', 'channels',  'main_image.image')
    column_filters = (FilterProfile('channels', 'Category - Channel'),)
    form_widget_args = {
        'text': {
            'rows': 10,
            'class': 'ckeditor'
        },
        'title': {
            'class': 'span12'
        },
        'description': {
            'class': 'span12'
        }
    }
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



class EventView(ModelView):
    column_filters = ['title']
    column_searchable_list = ('title',)
    column_list = ('title', 'description', 'start_timestamp', 'end_timestamp', 'main_image.image')
    form_ajax_refs = {
        "created_by": {
            'fields': ['name']
        },
    }
    create_template = 'admin_custom/create.html'
    edit_template = 'admin_custom/edit.html'
    form_widget_args = {
        'text': {
            'rows': 10,
            'class': 'ckeditor'
        },
        'title': {
            'class': 'span12'
        },
        'description': {
            'class': 'span12'
        }
    }

class ProductView(ModelView):
    column_filters = ['title']
    column_searchable_list = ('title',)
    column_list = ('title', 'description', 'price', 'discount', 'main_image.image')
    form_ajax_refs = {
        "created_by": {
            'fields': ['name']
        },
    }
    create_template = 'admin_custom/create.html'
    edit_template = 'admin_custom/edit.html'
    form_widget_args = {
        'text': {
            'rows': 10,
            'class': 'ckeditor'
        },
        'title': {
            'class': 'span12'
        },
        'description': {
            'class': 'span12'
        }
    }

