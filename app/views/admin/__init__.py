from flask.ext.admin.menu import MenuLink
from wtforms import fields, widgets, form
from mongoengine import Q
import flask_admin, hashlib
from flask_admin.form import rules
from flask_admin.contrib.mongoengine import ModelView
from flask import g, request, flash
from app import admin
from app.views.forms import ChangePasswordForm, UserPreferenceForm, ProfileForm

# Define wtforms widget and field
from app.models.profile import Profile
from app.models.streams import ActivityStream, Message
from app.models.content import Content, Channel, Comment, Article, Tag, Post, PostVote, Blog, Discussion
from app.models.activity import Activity
from app.models.adventure import Adventure, Location
from app.models.event import Event
from app.models.trip import Trip
from app.models.relationships import RelationShips

import mongoengine

from flask.ext.admin.contrib.mongoengine.ajax import QueryAjaxModelLoader
from flask.ext.admin.model.ajax import DEFAULT_PAGE_SIZE
from app import app

@app.context_processor
def process_context_admin():
    return dict(user=g.user)


class TagAjaxModelLoader(QueryAjaxModelLoader):
    """
    """
    def __init__(self, name, model, **options):
        self.filters = options.pop('filters', None)
        super(TagAjaxModelLoader, self).__init__(name, model, **options)

    def get_list(self, term, offset=0, limit=DEFAULT_PAGE_SIZE):
        query = self.model.objects

        criteria = None

        for field in self._cached_fields:
            flt = {u'%s__icontains' % field.name: term}

            if not criteria:
                criteria = mongoengine.Q(**flt)
            else:
                criteria |= mongoengine.Q(**flt)

        query = query.filter(criteria)

        if self.filters:
            query = query.filter(**self.filters)

        if offset:
            query = query.skip(offset)

        return [u.name for u in query.limit(limit).all()]

class SummernoteTextAreaWidget(widgets.TextArea):
    def __call__(self, field, **kwargs):
        kwargs.setdefault('class_', 'summernote')
        kwargs.setdefault('rows', '4')
        return super(SummernoteTextAreaWidget, self).__call__(field, **kwargs)

class GeneralTextAreaWidget(widgets.TextArea):
    def __call__(self, field, **kwargs):
        kwargs.setdefault('class_', 'span12')
        return super(GeneralTextAreaWidget, self).__call__(field, **kwargs)


class SummernoteTextAreaField(fields.TextAreaField):
    widget = SummernoteTextAreaWidget()

class GeneralTextAreaField(fields.TextAreaField):
    widget = GeneralTextAreaWidget()

class TagAdminView(ModelView):
    column_filters = ['name']

    column_searchable_list = ('name', )


    def is_accessible(self):
        if hasattr(g, 'user') and g.user is not None and 'Admin' in g.user.roles:
            return True
        return False


class LocationAdminView(ModelView):
    create_template = 'admin_custom/create.html'
    edit_template = 'admin_custom/edit.html'
    form_columns = ['name', 'address', 'is_city', 'city', 'region', 'state', 'country', 'zipcode', 'geo_location', 'cover_image', 'image_gallery']
    column_list = ('name', 'is_city', 'state', 'country')
    column_filters = ['city', 'region', 'country']
    column_searchable_list = ('city', 'region', 'country')

    def is_accessible(self):
        if hasattr(g, 'user') and g.user is not None and 'Admin' in g.user.roles:
            return True
        return False


class ActivityAdminView(ModelView):
    create_template = 'admin_custom/create.html'
    edit_template = 'admin_custom/edit.html'
    form_columns = ['name', 'description', 'about', 'dos', 'donts', 'safety_tips', 'tips', 'facts', 'highlights', 'cover_image', 'image_gallery', 'video_embed', 'map_embed']
    column_list = ('name', 'description', 'cover_image')
    column_filters = ['name']
    column_searchable_list = ('name',)
    form_overrides = dict(description=SummernoteTextAreaField, about=SummernoteTextAreaField, dos=SummernoteTextAreaField, donts=SummernoteTextAreaField, safety_tips=SummernoteTextAreaField,
                          tips=SummernoteTextAreaField, facts=SummernoteTextAreaField, highlights=SummernoteTextAreaField)

    def is_accessible(self):
        if hasattr(g, 'user') and g.user is not None and 'Admin' in g.user.roles:
            return True
        return False


class AdventureAdminView(ModelView):
    create_template = 'admin_custom/create.html'
    edit_template = 'admin_custom/edit.html'
    form_columns = ['name', 'description', 'about', 'location', 'best_season', 'nearby_stay', 'nearby_eat', 'nearby_station', 'nearby_airport', 'reviews', 'activities','extremity_level', 'reach_by_air', 'reach_by_train', 'reach_by_road', 'reach_by_sea', 'cover_image','image_gallery', 'video_embed', 'map_embed']
    column_list = ('name', 'description', 'cover_image')
    column_filters = ['name']
    column_searchable_list = ('name',)
    form_overrides = dict(description=SummernoteTextAreaField, about=SummernoteTextAreaField, nearby_eat=SummernoteTextAreaField, nearby_airport=SummernoteTextAreaField,
                          nearby_station=SummernoteTextAreaField, reach_by_train=SummernoteTextAreaField, reach_by_road=SummernoteTextAreaField, reach_by_sea=SummernoteTextAreaField, reach_by_air=SummernoteTextAreaField)
    def is_accessible(self):
        if hasattr(g, 'user') and g.user is not None and 'Admin' in g.user.roles:
            return True
        return False


class EventAdminView(ModelView):
    create_template = 'admin_custom/create.html'
    edit_template = 'admin_custom/edit.html'
    form_columns = ['name', 'description', 'about', 'scheduled_date', 'location', 'organizer','cover_image','image_gallery', 'video_embed', 'map_embed']
    column_list = ('name', 'description', 'organizer', 'cover_image')
    column_filters = ['name']
    column_searchable_list = ('name', )
    form_overrides = dict(description=SummernoteTextAreaField, about=SummernoteTextAreaField)

    def is_accessible(self):
        if hasattr(g, 'user') and g.user is not None and 'Admin' in g.user.roles:
            return True
        return False


class TripAdminView(ModelView):
    form_columns = ['name', 'description', 'about', 'adventure', 'starting_from', 'price', 'currency', 'discount_percentage', 'organizer',  'activities', 'difficulty_rating', 'registration', 'start_date', 'end_date', 'schedule', 'things_to_carry', 'inclusive', 'exclusive', 'others', 'comments', 'enquiries', 'announcements', 'cover_image','image_gallery', 'video_embed', 'map_embed']
    column_list = ('name', 'description', 'organizer', 'cover_image')
    column_filters = ['name']
    column_searchable_list = ('name', )
    form_overrides = dict(description=SummernoteTextAreaField, about=SummernoteTextAreaField)

    def is_accessible(self):
        if hasattr(g, 'user') and g.user is not None and 'Admin' in g.user.roles:
            return True
        return False


class ProfileAdminView(ModelView):
    create_template = 'admin_custom/create.html'
    edit_template = 'admin_custom/edit.html'
    form_columns = ['name', 'email', 'about', 'location', 'phone', 'website', 'facebook', 'twitter', 'google_plus', 'linked_in',  'youtube_channel', 'blog_channel', 'email_enabled', 'email_frequency', 'bookmarks', 'is_business_profile', 'roles', 'cover_image','image_gallery']
    column_list = ('name', 'email', 'cover_image', 'user_since', 'last_login')
    column_filters = ['name', 'email']
    column_searchable_list = ('name', 'email')
    form_overrides = dict(about=SummernoteTextAreaField)

    def is_accessible(self):
        if hasattr(g, 'user') and g.user is not None and 'Admin' in g.user.roles:
            return True
        return False

class CommentAdminView(ModelView):
    can_create = False
    create_template = 'admin_custom/create.html'
    edit_template = 'admin_custom/edit.html'
    form_columns = ['content', 'author', 'cover_image']
    column_list = ('author', 'content')
    form_overrides = dict(content=SummernoteTextAreaField)

    def is_accessible(self):
        if hasattr(g, 'user') and g.user is not None:
            return True
        return False

    def get_query(self):
        if 'Admin' in g.user.roles:
            return self.model.objects
        else:
            return self.model.objects(author=g.user)

class PostAdminView(ModelView):
    create_template = 'admin_custom/create.html'
    edit_template = 'admin_custom/edit.html'
    form_columns = ['title', 'content', 'author', 'cover_image','image_gallery', 'video_embed', 'map_embed']
    column_list = ('title', 'author', 'vote_count')
    column_filters = ['title']
    column_searchable_list = ('title', )
    form_overrides = dict(content=SummernoteTextAreaField)

    def is_accessible(self):
        if hasattr(g, 'user') and g.user is not None:
            return True
        return False

    def get_query(self):
        if 'Admin' in g.user.roles:
            return self.model.objects
        else:
            return self.model.objects(author=g.user)

class ContentAdminView(ModelView):
    create_template = 'admin_custom/create.html'
    edit_template = 'admin_custom/edit.html'
    form_columns = ['title', 'description', 'content', 'author', 'cover_image','image_gallery', 'video_embed', 'map_embed', 'source', 'published', 'tag_refs']
    column_list = ('title', 'author', 'comments_count', 'admin_published')
    column_filters = ['title']
    column_searchable_list = ('title', )
    form_overrides = dict(content=SummernoteTextAreaField)

    def is_accessible(self):
        if hasattr(g, 'user') and g.user is not None:
            return True
        return False

    def get_query(self):
        if 'Admin' in g.user.roles:
            return self.model.objects
        else:
            return self.model.objects(author=g.user)


class ChannelAdminView(ModelView):
    create_template = 'admin_custom/create.html'
    edit_template = 'admin_custom/edit.html'
    form_columns = ['name', 'type', 'parent']
    column_list = ('name', 'type', 'parent.name')
    column_filters = ['name']
    column_searchable_list = ('name', )
    form_overrides = dict(description=SummernoteTextAreaField)

    def is_accessible(self):
        if hasattr(g, 'user') and g.user is not None and 'Admin' in g.user.roles:
            return True
        return False


class DiscussionAdminView(ModelView):
    create_template = 'admin_custom/create.html'
    edit_template = 'admin_custom/edit.html'
    form_columns = ['title', 'description', 'content', 'author', 'cover_image','image_gallery', 'video_embed', 'map_embed', 'comments', 'source', 'type', 'published', 'admin_published', 'tag_refs', 'group']
    column_list = ('title', 'author', 'comments_count')
    column_filters = ['title']
    column_searchable_list = ('title', )
    form_overrides = dict(description=SummernoteTextAreaField, content=SummernoteTextAreaField)


    def is_accessible(self):
        if hasattr(g, 'user') and g.user is not None:
            return True
        return False

    def get_query(self):
        if 'Admin' in g.user.roles:
            return self.model.objects
        else:
            return self.model.objects(author=g.user)

class ApprovalContentAdminView(ModelView):
    can_create = False
    can_edit = False
    create_template = 'admin_custom/create.html'
    edit_template = 'admin_custom/edit.html'
    form_columns = ['title', 'description', 'content', 'author', 'cover_image','image_gallery', 'video_embed', 'map_embed', 'comments', 'source', 'published', 'admin_published', 'tag_refs']
    column_list = ('title', 'author', 'published', 'admin_published')
    form_overrides = dict(description=SummernoteTextAreaField, content=SummernoteTextAreaField)

    def is_accessible(self):
        if hasattr(g, 'user') and g.user is not None and 'Admin' in g.user.roles:
            return True
        return False

    def get_query(self):
        if 'Admin' in g.user.roles:
            return self.model.objects(published=True, admin_published=False)
        else:
            return self.model.objects(author=g.user, published=True, admin_published=False)


class PreferenceView(flask_admin.BaseView):


    @flask_admin.expose('/', methods=['GET', 'POST'])
    def index(self):
        form=UserPreferenceForm()
        profile = Profile.objects(pk=g.user.id).first()
        if request.method == 'POST':
            freq, enabled = request.form.get('email_frequency', 'monthly'), request.form.get('email_enabled', False)
            print "{*}", freq, enabled
            profile.email_enabled = True if enabled in ('y', 'Y') else False
            profile.email_frequency = freq

            profile.save()
            flash('Preference saved successfully', category='success')
        print "[*]", profile.email_enabled, profile.email_frequency
        form.email_frequency.data = profile.email_frequency
        form.email_enabled.data = 'y' if profile.email_enabled else None
        return self.render('/admin_custom/settings.html', form=form, action_name='Edit Preferences', settings='prefs')

    def is_visible(self):
        return False

class ChangePasswordView(flask_admin.BaseView):

    @flask_admin.expose('/', methods=['GET', 'POST'])
    def change_password(self):
        form=ChangePasswordForm()
        profile = Profile.objects(pk=g.user.id).first()
        if request.method == 'POST':
            current, new_pass, confirm = request.form.get('current_password', ''), request.form.get('new_password', ''), request.form.get('confirm_password', '')
            if confirm == new_pass  and hashlib.md5(current).hexdigest() == profile.password:
                profile.password = new_pass
                profile.save()
                flash('Password saved successfully', category='success')
            elif confirm != new_pass:
                flash('Password did not match', category='warning')
            else:
                flash('Wrong password', category='danger')
        return self.render('/admin_custom/settings.html', form=form, action_name='Change Password', settings='password')

    def is_visible(self):
        return False

class ProfileSettingAdminView(flask_admin.BaseView):

    @flask_admin.expose('/', methods=['GET', 'POST'])
    def change_password(self):
        form = ProfileForm()
        profile = Profile.objects(pk=g.user.id).first()
        if request.method == 'POST':
            profile.name = request.form.get('name', '')
            profile.about = request.form.get('about', '')
            profile.phone = request.form.get('phone', '')
            profile.website = request.form.get('website', '')
            profile.facebook = request.form.get('facebook', '')
            profile.twitter = request.form.get('twitter', '')
            profile.google_plus = request.form.get('google_plus', '')
            profile.linked_in= request.form.get('linked_in', '')
            profile.youtube_channel = request.form.get('youtube_channel', '')
            profile.blog_channel = request.form.get('blog_channel', '')
            profile.save()
            flash('Profiled updated successfully', category='success')
        form.name.data = profile.name
        form.about.data = profile.about
        form.phone.data = profile.phone
        form.website.data = profile.website
        form.facebook.dta = profile.facebook
        form.twitter.data = profile.twitter
        form.google_plus.data = profile.google_plus
        form.linked_in.data = profile.linked_in
        form.youtube_channel.data = profile.youtube_channel
        form.blog_channel.data = profile.blog_channel
        return self.render('/admin_custom/settings.html', form=form, action_name='Edit Your Profile', settings='profile')

    def is_visible(self):
        return False


admin.add_view(ApprovalContentAdminView(Article, name='Article', endpoint='approval.article', category="Approvals"))
admin.add_view(ApprovalContentAdminView(Blog, name='Blog', endpoint='approval.blog', category="Approvals"))
admin.add_view(ApprovalContentAdminView(Discussion, name='Discussion', endpoint='approval.discussion', category="Approvals"))
admin.add_view(ProfileAdminView(Profile, category="Admin"))
admin.add_view(ActivityAdminView(Activity, category="Admin"))
admin.add_view(AdventureAdminView(Adventure, category="Admin"))

admin.add_view(ContentAdminView(Article, category="Editor"))
admin.add_view(ContentAdminView(Blog, category="Editor"))
admin.add_view(ContentAdminView(Discussion, category="Editor"))
admin.add_view(PostAdminView(Post, category="Editor"))

admin.add_view(EventAdminView(Event, category="Organizer"))
admin.add_view(TripAdminView(Trip, category="Organizer"))

admin.add_view(LocationAdminView(Location, category="Tools"))
admin.add_view(ChannelAdminView(Channel, category="Tools"))
admin.add_view(TagAdminView(Tag, category="Tools"))
admin.add_view(PreferenceView(name='Preference', endpoint='settings.preference', category="Settings"))
admin.add_view(ChangePasswordView(name='Change Password', endpoint='settings.password', category="Settings"))
admin.add_view(ProfileSettingAdminView(name='My Profile', endpoint='settings.my_profile', category="Settings"))

