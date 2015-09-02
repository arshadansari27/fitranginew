from app.models.feedbacks import ClaimProfile
from flask.ext.admin import BaseView, expose, AdminIndexView
from flask.ext.admin.menu import MenuLink
from app.models import NodeFactory
from markupsafe import Markup
from wtforms import fields, widgets, form
from mongoengine import Q
import flask_admin, hashlib, datetime
from flask_admin.form import rules
from flask_admin.contrib.mongoengine import ModelView
from flask import g, request, flash, url_for, redirect
from app import admin
from app.utils import get_current_user
from app.views.forms import ChangePasswordForm, UserPreferenceForm, ProfileForm, LocationForm

# Define wtforms widget and field
from app.models.profile import Profile, ProfileType
from app.models.streams import ActivityStream, ChatMessage
from app.models.content import Content, Channel, Comment, Article, Post, PostVote, Discussion, Advertisement
from app.models.activity import Activity
from app.models.adventure import Adventure
from app.models.event import Event
from app.models.trip import Trip
from app.models.contest import Contest, ContestAnswer
from app.models.page import ExtraPage
from app.models.booking import TripBooking
from app.models.media import Media, TripGalleryImage
from app.models.feedbacks import NotOkFeedBack, ClaimProfile
from app.models.relationships import RelationShips
import mongoengine
from mongoengine import Q
from flask.ext.admin.contrib.mongoengine.filters import BooleanEqualFilter, FilterLike, BaseMongoEngineFilter

#from flask.ext.admin.contrib.mongoengine.ajax import QueryAjaxModelLoader
#from flask.ext.admin.model.ajax import DEFAULT_PAGE_SIZE
from app import app

@app.context_processor
def process_context_admin():
    if g.user:
        return dict(user=g.user, is_admin='Admin' in g.user.roles)
    else:
        return {}

class FilterAdventure(BaseMongoEngineFilter):
    def apply(self, query, value):
        adventure = Adventure.objects(name__icontains=value).first()
        return query.filter(adventures__iexact=[adventure.id])

    def operation(self):
        return 'is'

class FilterTrip(BaseMongoEngineFilter):
    def apply(self, query, value):
        trip = Trip.objects(name__icontains=value).first()
        return query.filter(trip=trip.id)

    def operation(self):
        return 'is'

class FilterActivities(BaseMongoEngineFilter):
    def apply(self, query, value):
        activity = Activity.objects(name__icontains=value).first()
        return query.filter(activities__in=[activity.id])

    def operation(self):
        return 'is'

class FilterChannel(BaseMongoEngineFilter):
    def apply(self, query, value):
        channel = Channel.objects(name__icontains=value).first()
        return query.filter(channels__in=[channel.id])

    def operation(self):
        return 'is'

class FilterProfileType(BaseMongoEngineFilter):
    def apply(self, query, value):
        type = ProfileType.objects(name__icontains=value).first()
        return query.filter(type__iexact=type.id)

    def operation(self):
        return 'is'

def create_named_filter():
    class NameFilter(BaseMongoEngineFilter):
        def apply(self, query, value):
            return query.filter(name__icontains=value)

        def operation(self):
            return 'like'

    return NameFilter('name', 'Name')

def create_title_filter():
    class TitleFilter(BaseMongoEngineFilter):
        def apply(self, query, value):
            return query.filter(title__icontains=value)

        def operation(self):
            return 'like'

    return TitleFilter('title', 'Title')

'''
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
'''
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



class ActivityAdminView(ModelView):
    create_template = 'admin/my_custom/create.html'
    edit_template = 'admin/my_custom/edit.html'
    form_columns = ['name', 'description', 'icon', 'about', 'dos', 'donts', 'safety_tips', 'tips', 'facts', 'highlights', 'cover_image', 'path_cover_image', ]
    column_list = ('name', 'description', 'cover_image')
    column_filters = [create_named_filter()]
    column_searchable_list = ('name',)
    form_overrides = dict(description=SummernoteTextAreaField, about=SummernoteTextAreaField)
    column_default_sort = '-created_timestamp'

    def is_accessible(self):
        if hasattr(g, 'user') and g.user is not None and 'Admin' in g.user.roles:
            return True
        return False


class AdventureAdminView(ModelView):
    create_template = 'admin/my_custom/create.html'
    edit_template = 'admin/my_custom/edit.html'
    form_columns = ['name', 'description', 'about', 'best_season', 'nearby_stay','nearby_eat', 'nearby_station', 'nearby_airport','extremity_level', 'reach_by_air', 'reach_by_train', 'reach_by_road', 'reach_by_sea', 'cover_image', 'activities', 'path_cover_image']
    column_list = ('name', 'description', 'cover_image', 'location')
    column_filters = [create_named_filter(), FilterActivities('activities.id', 'Activity')]
    column_searchable_list = ('name',)
    form_overrides = dict(description=SummernoteTextAreaField, about=SummernoteTextAreaField)
    column_default_sort = '-created_timestamp'

    def is_accessible(self):
        if hasattr(g, 'user') and g.user is not None and 'Admin' in g.user.roles:
            return True
        return False

    def _location_formatter(view, context, model, name):
        url = '/admin/location_update?model_id=%s&model_type=%s&back=%s' % (str(model.id), model.__class__.__name__, '/admin/adventure/')
        if model.location:
            text = '%s<br/><a href="%s">Change</a>' % (model.location, url)
        else:
            text = '<a href="%s">Set Location</a>' % url

        return Markup(text)

    column_formatters = {'location': _location_formatter}


class EventAdminView(ModelView):
    create_template = 'admin/my_custom/create.html'
    edit_template = 'admin/my_custom/edit.html'
    form_columns = ['name', 'description', 'about', 'scheduled_date', 'organizer','cover_image', 'external_link', 'path_cover_image']
    column_list = ('name', 'description', 'organizer', 'cover_image', 'location')
    column_filters = [create_named_filter()]
    column_searchable_list = ('name', )
    form_overrides = dict(description=SummernoteTextAreaField, about=SummernoteTextAreaField)
    column_default_sort = '-created_timestamp'

    def is_accessible(self):
        if hasattr(g, 'user') and g.user is not None and 'Admin' in g.user.roles:
            return True
        return False

    def _location_formatter(view, context, model, name):
        url = '/admin/location_update?model_id=%s&model_type=%s&back=%s' % (str(model.id), model.__class__.__name__, '/admin/event/')
        if model.location:
            text = '%s<br/><a href="%s">Change</a>' % (model.location, url)
        else:
            text = '<a href="%s">Set Location</a>' % url

        return Markup(text)

    column_formatters = {'location': _location_formatter}


class TripAdminView(ModelView):
    form_columns = ['name', 'departure_type', 'description', 'optional_location_name', 'about', 'price', 'organizer',  'activities', 'start_date', 'end_date', 'itinerary', 'other_details', 'inclusive_exclusive', 'announcements', 'cover_image', 'path_cover_image', 'slug', 'published']
    column_list = ('name', 'organizer_name', 'cover_image', 'location', 'bookings', 'gallery', 'departure_type')
    column_filters = [create_named_filter(), FilterAdventure('adventure.id', 'Adventure'), FilterActivities('activities.id', 'Activity'), 'departure_type']
    column_searchable_list = ('name', 'departure_type')
    form_overrides = dict(description=SummernoteTextAreaField, about=SummernoteTextAreaField, itinerary=SummernoteTextAreaField, other_details=SummernoteTextAreaField, inclusive_exclusive=SummernoteTextAreaField, announcements=SummernoteTextAreaField)
    column_default_sort = '-created_timestamp'

    def is_accessible(self):
        if hasattr(g, 'user') and g.user is not None and 'Admin' in g.user.roles:
            return True
        return False

    def organizer(view, context, model, name):
        return Markup('%s' % model.organizer.name if model.organizer else 'Unknown')

    def gallery(view, context, model, name):
        images = TripGalleryImage.objects(trip=model).all()
        count = len(images)
        '<a href="#"></a>'
        paths = ['<img src="%s"/><br/>' % i.image_path_small for i in images]
        return Markup("%d" % count)

    def _bookings(view, context, model, name):
        return Markup('<a href="%s" target="new">%s</a>' % (url_for('enquiries_for_trip_view.index_view', trip_id=str(model.id)), TripBooking.objects(trip=model).count()))

    def _location_formatter(view, context, model, name):
        url = '/admin/location_update?model_id=%s&model_type=%s&back=%s' % (str(model.id), model.__class__.__name__, '/admin/trip/')
        if model.location:
            text = '%s<br/><a href="%s">Change</a>' % (model.location, url)
        else:
            text = '<a href="%s">Set Location</a>' % url

        return Markup(text)

    column_formatters = {'location': _location_formatter, 'bookings': _bookings, 'organizer_name': organizer}

class TripBookingAdminView(ModelView):
    form_columns = ['trip', 'booking_by', 'preferred_name', 'preferred_email', 'preferred_phone', 'contact_preference', 'enquiry', 'total_charge', 'discount_percent', 'status',  'payment_status']
    column_list = ('trip', 'booking_by', 'preferred_name', 'preferred_email', 'preferred_phone', 'contact_preference', 'message', 'status', 'payment_status', 'total_charge', 'discount_percent', 'actual_charge')
    column_filters = [FilterTrip('trip.id', 'Trip'), 'status', 'payment_status']
    column_searchable_list = ('preferred_name', 'preferred_phone', 'preferred_email')
    column_default_sort = '-created_timestamp'

    def is_accessible(self):
        if hasattr(g, 'user') and g.user is not None and 'Admin' in g.user.roles:
            return True
        return False

    def _actual_charge(view, context, model, name):
        return Markup(model.actual_charge)

    def _message(view, context, model, name):
        return Markup('<a href="#" onclick="javascript:BootstrapDialog.alert(\''+ model.enquiry +'\');">Click to view</a>')

    column_formatters = {'actual_charge': _actual_charge, 'message': _message}


class SelectedTripBookingAdminView(TripBookingAdminView):
    def get_query(self):
        trip_id = request.args.get('trip_id', None)
        if trip_id is not None:
            return TripBooking.objects(trip=trip_id)
        else:
            return TripBooking.objects()

    def is_visible(self):
        return False


class ProfileAdminView(ModelView):
    create_template = 'admin/my_custom/create.html'
    edit_template = 'admin/my_custom/edit.html'
    form_columns = ['name', 'email', 'address', 'alternative_email', 'featured', 'about', 'phone', 'alternative_phone', 'website', 'facebook', 'twitter', 'google_plus', 'linked_in',  'youtube_channel', 'blog_channel', 'email_enabled', 'email_frequency', 'bookmarks', 'is_business_profile', 'roles', 'cover_image', 'type', 'managed_by', 'interest_in_activities', 'admin_approved', 'path_cover_image', 'is_premium_profile']
    column_list = ('name', 'email', 'cover_image', 'user_since', 'last_login', 'type', 'featured', 'location', 'is_verified', 'is_premium_profile')
    column_filters = [create_named_filter(), 'is_verified', 'is_premium_profile'] #, FilterProfileType('type.id', 'Type')]
    column_searchable_list = ('name', 'email')
    form_overrides = dict(about=SummernoteTextAreaField)
    column_default_sort = '-created_timestamp'

    def is_accessible(self):
        if hasattr(g, 'user') and g.user is not None and 'Admin' in g.user.roles:
            return True
        return False

    def _location_formatter(view, context, model, name):
        url = '/admin/location_update?model_id=%s&model_type=%s&back=%s' % (str(model.id), model.__class__.__name__, '/admin/profile/')
        if model.location:
            text = '%s<br/><a href="%s">Change</a>' % (model.location, url)
        else:
            text = '<a href="%s">Set Location</a>' % url

        return Markup(text)

    column_formatters = {'location': _location_formatter}



class CommentAdminView(ModelView):
    can_create = False
    create_template = 'admin/my_custom/create.html'
    edit_template = 'admin/my_custom/edit.html'
    form_columns = ['content', 'author']
    column_list = ('author', 'content')
    form_overrides = dict(content=SummernoteTextAreaField)
    column_default_sort = '-created_timestamp'

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
    create_template = 'admin/my_custom/create.html'
    edit_template = 'admin/my_custom/edit.html'
    form_columns = ['author', 'content', 'cover_image', 'type', 'video_embed', 'map_embed', 'parent', 'comments', 'parent', 'path_cover_image']
    column_list = ( 'author', 'content', 'vote_count', 'parent', 'type')
    form_overrides = dict(content=SummernoteTextAreaField)
    column_default_sort = '-created_timestamp'

    def is_accessible(self):
        if hasattr(g, 'user') and g.user is not None:
            return True
        return False

    def get_query(self):
        if 'Admin' in g.user.roles:
            return self.model.objects
        else:
            return self.model.objects(author=g.user)

class ContestParticipantAdminView(ModelView):
    can_create = False
    can_edit = False
    can_delete = False
    create_template = 'admin/my_custom/create.html'
    edit_template = 'admin/my_custom/edit.html'
    column_list = ( 'name', 'email', 'contest', 'answers', 'correct_answers')
    column_default_sort = '-created_timestamp'
    column_filters = [create_named_filter()] #, FilterProfileType('type.id', 'Type')]

    def _contest(view, context, model, name):
        return Markup("%s" % Contest.objects(pk=str(request.args.get('contest_id')).strip()).first())


    def _answers(view, context, model, name):
        answers = ContestAnswer.answers_by_contest_and_user(request.args.get('contest_id'), model)
        return Markup("%s" % str(answers))

    def _correct_answers(view, context, model, name):
        return Markup("%d" % ContestAnswer.correct_answers_by_contest_and_user(request.args.get('contest_id'), model))

    def _possible_winner(view, context, model, name):
        return Markup("%s" % str(ContestAnswer.check_all_correct_answers_by_contest_and_user(request.args.get('contest_id'), model)))

    column_formatters = {'contest': _contest, 'answers': _answers, 'correct_answers': _correct_answers, 'possible_winner': _possible_winner}

    def is_accessible(self):
        if hasattr(g, 'user') and g.user is not None:
            return True
        return False

    def get_query(self):
        contest_id = request.args.get('contest_id', None)
        if contest_id is not None:
            participants = ContestAnswer.get_all_participants_by_contest(contest_id)
            return Profile.objects(id__in=[str(p.id) for p in participants])
        else:
            return Profile.objects()

    def is_visible(self):
        return False

class PostForContentAdminView(PostAdminView):
    can_create = False

    def get_query(self):
        content_id = request.args.get('content_id', None)
        content_type = request.args.get('content_type', None)
        if content_type == 'Article':
            cls = Article
        elif content_type == 'Discussion':
            cls = Discussion
        elif content_type == 'Contest':
            cls = Contest
        else:
            cls = Post

        if content_id is not None:
            parent = cls.objects(pk=content_id).first()
            return Post.objects(parent=parent)
        else:
            return Post.objects


    def is_visible(self):
        return False

class ContestAdminView(ModelView):
    create_template = 'admin/my_custom/create.html'
    edit_template = 'admin/my_custom/edit.html'
    form_columns = ['title', 'sponsorer', 'description', 'cover_image', 'content', 'author', 'start_date', 'end_date', 'closed', 'associated_advertisements', 'winner', 'winner2', 'winner3', 'questions', 'published', 'tags', 'admin_published', 'slug', 'path_cover_image']
    column_list = ('title', 'author', 'start_date', 'end_date', 'is_live', 'is_closed', 'winner', 'winner2', 'winner3', 'participants', 'published', 'admin_published', 'download_participants')
    column_searchable_list = ('title', )
    form_overrides = dict(content=SummernoteTextAreaField)
    column_default_sort = '-created_timestamp'
    column_filters = [create_title_filter(), 'published', 'admin_published'] #, FilterProfileType('type.id', 'Type')]

    form_args = dict(author=dict(default=get_current_user))

    def is_accessible(self):
        if hasattr(g, 'user') and g.user is not None:
            return True
        return False

    def get_query(self):
        if 'Admin' in g.user.roles:
            return self.model.objects
        else:
            return self.model.objects(author=g.user)

    def _is_closed(view, context, model, name):
        return Markup("%s" % str(model.is_closed))

    def _is_live(view, context, model, name):
        now = datetime.datetime.now()
        return Markup("%s" % "Yes" if model.is_started else 'No')

    def _participants(view, context, model, name):
        return Markup('<a href="%s" target="new">%s</a>' % (url_for('participants_for_context_view.index_view', contest_id=str(model.id)), ContestAnswer.get_all_participants_by_contest_count(model)))


    def _participants_download(view, context, model, name):
        return Markup('<a href="/user-csv-download/%s">Download User CSV</a>' % str(model.id))

    column_formatters = {'is_closed': _is_closed, 'is_live': _is_live, 'participants': _participants, 'download_participants': _participants_download}


class ContentAdminView(ModelView):
    create_template = 'admin/my_custom/create.html'
    edit_template = 'admin/my_custom/edit.html'
    form_columns = ['title', 'slug', 'description', 'content', 'author', 'channels', 'cover_image', 'video_embed', 'map_embed', 'source', 'published', 'admin_published', 'tags', 'path_cover_image']
    column_list = ('title', 'author', 'published', 'admin_published', 'comments', 'cover_image', 'channels', 'image_download')
    column_filters = ['title', FilterChannel('channel.id', 'Channel')]
    column_searchable_list = ('title', )
    form_overrides = dict(content=SummernoteTextAreaField)
    column_default_sort = '-created_timestamp'
    column_filters = [create_title_filter(), 'published', 'admin_published'] #, FilterProfileType('type.id', 'Type')]

    form_args = dict(author=dict(default=get_current_user))

    def is_accessible(self):
        if hasattr(g, 'user') and g.user is not None:
            return True
        return False

    def get_query(self):
        if 'Admin' in g.user.roles:
            return self.model.objects
        else:
            return self.model.objects(author=g.user)

    def _comments_formatter(view, context, model, name):
        return Markup("<a href='%s'>%d</a>" % (url_for('content_post_admin_view.index_view', content_id=str(model.id), content_type=model.__class__.__name__), Post.objects(parent=model).count())) if Post.objects(parent=model).count() > 0 else ""

    def _image_downloader(view, context, model, name):
        return Markup('<a href="%s" target="new">%s</a>' % (model.cover_image_path, 'Download') if model.cover_image_path is not None and len(model.cover_image_path) > 0 else 'No Cover Image')

    column_formatters = {'comments': _comments_formatter, 'image_download': _image_downloader}

class ChannelAdminView(ModelView):
    create_template = 'admin/my_custom/create.html'
    edit_template = 'admin/my_custom/edit.html'
    form_columns = ['name', 'type', 'parent']
    column_list = ('name', 'type', 'parent.name')
    column_filters = ['name']
    column_searchable_list = ('name', )
    form_overrides = dict(description=SummernoteTextAreaField)
    column_default_sort = '-created_timestamp'
    column_filters = [create_named_filter()] #, FilterProfileType('type.id', 'Type')]

    def is_accessible(self):
        if hasattr(g, 'user') and g.user is not None and 'Admin' in g.user.roles:
            return True
        return False

class ApprovalContentAdminView(ModelView):
    can_create = False
    can_edit = True
    create_template = 'admin/my_custom/create.html'
    edit_template = 'admin/my_custom/edit.html'
    form_columns = ['title', 'description', 'content', 'author', 'cover_image', 'video_embed', 'map_embed', 'source', 'published', 'admin_published']
    column_list = ('title', 'author', 'published', 'admin_published')
    form_overrides = dict(description=SummernoteTextAreaField, content=SummernoteTextAreaField)

    def is_accessible(self):
        if hasattr(g, 'user') and g.user is not None and 'Admin' in g.user.roles:
            return True
        return False

    def get_query(self):
        if 'Admin' in g.user.roles:
            q = {'$and':
                [
                    {'published': True},
                    {
                        '$or':
                        [
                            {
                                'admin_published': None
                            },
                            {
                                'admin_published': False
                            }
                        ]
                    }
                ]
            }

            return self.model.objects(__raw__=q)
        return None

class ApprovalProfileAdminView(ModelView):
    can_create = False
    can_edit = True
    create_template = 'admin/my_custom/create.html'
    edit_template = 'admin/my_custom/edit.html'
    form_columns = ['name', 'description', 'managed_by', 'about', 'website', 'phone', 'email', 'facebook', 'linked_in', 'google_plus', 'blog_channel', 'youtube_channel', 'cover_image', 'type','admin_approved']
    column_list = ('name', 'description', 'managed_by', 'admin_approved', 'cover_image', 'type')
    form_overrides = dict(description=SummernoteTextAreaField, content=SummernoteTextAreaField)

    def is_accessible(self):
        if hasattr(g, 'user') and g.user is not None and 'Admin' in g.user.roles:
            return True
        return False

    def get_query(self):
        if 'Admin' in g.user.roles:
            q = {'admin_approved': False, 'is_business_profile': True}
            return self.model.objects(__raw__=q)
        return None

class NotOkAdminView(ModelView):
    can_create = False
    can_edit = False
    create_template = 'admin/my_custom/create.html'
    edit_template = 'admin/my_custom/edit.html'
    form_columns = ['profile', 'not_ok', 'option', 'message']
    column_list = ('flagged_by', 'not_ok_content', 'content_type',  'option', 'message')

    def content_type_formatter(view, context, model, name):
        return Markup("%s" % model.not_ok.__class__.__name__)

    def node_formatter(view, context, model, name):
        return Markup('<a href="%s" target="_new">%s</a>' % (model.not_ok.slug, model.not_ok))

    def profile_formatter(view, context, model, name):
        return Markup('<a href="%s" target="_new">%s</a>' % (model.profile.slug, model.profile))

    column_formatters = {'content_type': content_type_formatter, 'not_ok_content': node_formatter, 'flagged_by': profile_formatter}

    def is_accessible(self):
        if hasattr(g, 'user') and g.user is not None and 'Admin' in g.user.roles:
            return True
        return False

class ClaimAdminView(ModelView):
    can_create = False
    can_edit = False

    create_template = 'admin/my_custom/create.html'
    edit_template = 'admin/my_custom/edit.html'
    column_list = ('profile', 'profile_email', 'claimed', 'claimed_email', 'claimed_verified')

    def is_accessible(self):
        if hasattr(g, 'user') and g.user is not None and 'Admin' in g.user.roles:
            return True
        return False

    def verified_email_formatter(view, context, model, name):
        return Markup("%s" % model.claimed.is_verified)

    def profile_email_formatter(view, context, model, name):
        return Markup("%s" % (model.profile.email if model.profile else 'No Profile (Invalid row)'))

    def claimed_email_formatter(view, context, model, name):
        return Markup("%s" % (model.claimed.email if model.claimed else 'No Profile Claimed (Invalid row)'))

    column_formatters = {'profile_email': profile_email_formatter, 'claimed_email': claimed_email_formatter, 'claied_verified': claimed_email_formatter}


class ExtraPageAdminView(ModelView):
    create_template = 'admin/my_custom/create.html'
    edit_template = 'admin/my_custom/edit.html'
    form_overrides = dict(page_content=SummernoteTextAreaField)
    column_list = ['name', 'page_title']

    def is_accessible(self):
        if hasattr(g, 'user') and g.user is not None and 'Admin' in g.user.roles:
            return True
        return False


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
        return self.render('/admin/my_custom/settings.html', form=form, action_name='Edit Preferences', settings='prefs')

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
        return self.render('/admin/my_custom/settings.html', form=form, action_name='Change Password', settings='password')

    def is_visible(self):
        return False
'''
class LocationAdminView(ModelView):
    column_list = ('name', 'location', 'geo_location')
    column_sortable_list = ('name', 'location')

    column_searchable_list = ('name', 'location')

    form = LocationForm
    form_widget_args = dict(name={'class': 'geo-complete'})

    def get_query(self):
        model_id = request.args.get('model_id', None)
        model_type = request.args.get('model_type', None)
        model_class = NodeFactory.get_class_by_name(model_type)

        return model_class.objects


    def edit_form(self, obj):
        form = super(LocationAdminView, self).edit_form(obj)
        form.geo_location_name.data = obj.name
        x, y = obj.geo_location['coordinates']
        form.geo_location_lat.data, form.geo_location_long.data = x, y
        return form

    # Correct user_id reference before saving

    def on_model_change(self, form, model):
        name    = form['geo_location_name'].data
        lat     = form['geo_location_lat'].data
        long    = form['geo_location_long'].data
        print '[*] Saving location', name, lat, long
        model.name = name
        model.geo_location = [float(lat), float(long)]
        return model

    def is_accessible(self):
        if hasattr(g, 'user') and g.user is not None and 'Admin' in g.user.roles:
            return True
        return False
'''
class LocationSettingAdminView(flask_admin.BaseView):

    @flask_admin.expose('/', methods=['GET', 'POST'])
    def set_location(self):
        form = LocationForm()
        model_id = request.args.get('model_id')
        model_type = request.args.get('model_type')
        back = request.args.get('back', request.referrer)
        model_class = NodeFactory.get_class_by_name(model_type)

        model = model_class.objects(pk=model_id).first()
        if request.method == 'POST':
            model.location = request.form.get('formatted_address', '')
            lat = float(request.form.get('lat'))
            long = float(request.form.get('lng'))
            city = request.form.get('locality_short')
            region = request.form.get('administrative_area_level_2')
            state = request.form.get('administrative_area_level_1')
            country = request.form.get('country_short')
            model.geo_location = [lat, long]
            model.city = city
            model.state = state
            model.region = region
            model.country = country
            model.save()
            flash('Profiled updated successfully', category='success')
        if model.location:
            form.formatted_address.data = model.location
            form.location.data = model.location
        if model.geo_location:
            if type(model.geo_location) == list:
                lat = model.geo_location[0]
                lng = model.geo_location[1]
            else:
                lat = model.geo_location['coordinates'][0]
                lng = model.geo_location['coordinates'][1]
            form.lat.data =  str(lat)
            form.lng.data =  str(lng)
            form.locality_short.data = model.city
            form.administrative_area_level_2.data = model.region
            form.administrative_area_level_1.data = model.state
            form.country_short.data = model.country
        return self.render('/admin/my_custom/location.html', model=model, form=form, action_name='Update Location', settings='profile', back_to_url=back)

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
        return self.render('/admin/my_custom/settings.html', form=form, action_name='Edit Your Profile', settings='profile')

    def is_visible(self):
        return False

class RestrictedAdminView(ModelView):

    def is_accessible(self):
        if hasattr(g, 'user') and g.user is not None and 'Admin' in g.user.roles:
            return True
        return False


class TripGalleryAdminView(RestrictedAdminView):
    column_list = ('image', 'trip_name')

    def trip_name_formatter(view, context, model, name):
        return Markup("%s" % model.trip.name)

    column_formatters = dict(trip_name=trip_name_formatter)


admin.add_view(ApprovalContentAdminView(Article, name='Article', endpoint='approval.article', category="Approvals"))
#admin.add_view(ApprovalContentAdminView(Blog, name='Blog', endpoint='approval.blog', category="Approvals"))
admin.add_view(ApprovalContentAdminView(Discussion, name='Discussion', endpoint='approval.discussion', category="Approvals"))
admin.add_view(ApprovalProfileAdminView(Profile, name='Business Profile', endpoint='approval.business_profile', category="Approvals"))
admin.add_view(ClaimAdminView(ClaimProfile, name='Claimed Profiles', endpoint='approval.claimed_profiles', category="Approvals"))
admin.add_view(ProfileAdminView(Profile, category="Administration"))
admin.add_view(ActivityAdminView(Activity, category="Administration"))
admin.add_view(LocationSettingAdminView(name='Location Update', endpoint='location_update'))
admin.add_view(AdventureAdminView(Adventure, category="Administration"))
admin.add_view(RestrictedAdminView(Advertisement, category="Administration"))


admin.add_view(ContentAdminView(Article, category="Editorial"))
admin.add_view(ContentAdminView(Discussion, category="Editorial"))
admin.add_view(PostAdminView(Post, category="Editorial"))
admin.add_view(PostForContentAdminView(Post, name="Posts on content", endpoint="content_post_admin_view"))
admin.add_view(ContestAdminView(Contest, category="Editorial"))
admin.add_view(ContestParticipantAdminView(Profile, name="Answering stats for contest", endpoint="participants_for_context_view"))

admin.add_view(EventAdminView(Event, category="Organizers"))
admin.add_view(TripAdminView(Trip, category="Organizers"))
admin.add_view(TripBookingAdminView(TripBooking, category="Organizers"))
admin.add_view(SelectedTripBookingAdminView(TripBooking, name="Bookings for trip", endpoint="enquiries_for_trip_view"))
admin.add_view(TripGalleryAdminView(TripGalleryImage, category="Organizers"))

admin.add_view(NotOkAdminView(NotOkFeedBack, category="Feedbacks", endpoint='feedback.not_ok'))

admin.add_view(RestrictedAdminView(ProfileType, category="Tools"))
#admin.add_view(LocationAdminView(Location, category="Tools"))
admin.add_view(ChannelAdminView(Channel, category="Tools"))
admin.add_view(ExtraPageAdminView(ExtraPage, category="Tools"))
admin.add_view(PreferenceView(name='Preference', endpoint='settings.preference', category="Settings"))
admin.add_view(ChangePasswordView(name='Change Password', endpoint='settings.password', category="Settings"))
admin.add_view(ProfileSettingAdminView(name='My Profile', endpoint='settings.my_profile', category="Settings"))

