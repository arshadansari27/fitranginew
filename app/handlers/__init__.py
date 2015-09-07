__author__ = 'arshad'

import sys, traceback, datetime
from collections import defaultdict
from flask import g, request
from app.utils import convert_query_to_filter, get_descriptions
from app.settings import CDN_URL
from app import USE_CDN
from app.models.feedbacks import ClaimProfile
from app.handlers.extractors import NodeExtractor, article_extractor, advertisement_extractor, adventure_extractor, \
    activity_extractor, discussion_extractor, profile_type_extractor, event_extractor, profile_extractor, \
    trip_extractor, post_extractor, stream_extractor
from app.models import ACTIVITY, ADVENTURE, EVENT, TRIP, PROFILE, DISCUSSION, ARTICLE, POST, STREAM, Node, ADVERTISEMENT, CONTEST
from app.models.content import Content, Post, Article, Discussion
from app.models.adventure import Adventure
from app.models.contest import Contest
from app.models.activity import Activity
from app.models.trip import Trip
from app.models.profile import Profile, ProfileType
from app.models.page import ExtraPage

ICON_VIEW, GRID_VIEW, ROW_VIEW, GRID_ROW_VIEW, DETAIL_VIEW = 'icon', "grid", "row", "grid-row", "detail"
GENERIC_TITLE = 'Fitrangi.com - India\'s Complete Adventure Portal'
COLLECTION_PATHS = {
    STREAM: 'site/pages/searches/streams',
    ADVENTURE: 'site/pages/searches/adventures',
    PROFILE: 'site/pages/searches/profiles',
    POST: 'site/pages/searches/posts',
    DISCUSSION: 'site/pages/searches/discussions',
    EVENT: 'site/pages/searches/events',
    ARTICLE: 'site/pages/searches/articles',
    TRIP: 'site/pages/searches/trips',
    CONTEST: 'site/pages/searches/contests',
    "explore": 'site/pages/landings/home',
    "community": 'site/pages/landings/community',
    'aboutus': 'site/pages/landings/extra',
    'terms': 'site/pages/landings/extra',
    'faq': 'site/pages/landings/extra',
    'privacy': 'site/pages/landings/extra',
    'contribute': 'site/pages/landings/extra',
    'advertise': 'site/pages/landings/extra',
    'login': 'site/pages/landings/login',
    'register': 'site/pages/landings/register'
}
CAPITALIZED_NAMES = {
    STREAM: 'Streams',
    ADVENTURE: 'Adventures',
    PROFILE: 'Profiles',
    POST: 'Posts',
    DISCUSSION: 'Discussions',
    EVENT: 'Events and Initiatives',
    ARTICLE: 'Articles',
    TRIP: 'Trips',
    CONTEST: "Contests",
    "explore": 'Home',
    "community": 'Community',
    'aboutus': 'About Fitrangi',
    'terms': 'Terms and conditions',
    'faq': 'Frequently Asked Questions',
    'privacy': 'Privacy Policy',
    'contribute': 'Contribute',
    'advertise': 'Advertise on fitrangi',
    'login': 'Login',
    'register': 'Register'
}
WALL_IMAGE_STYLE = "background:  linear-gradient( rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4) ), url(%s) no-repeat center center;background-size: cover;"

if USE_CDN:
    prepend = CDN_URL
else:
    prepend = ''

WALL_IMAGE_NAMES = {
    ACTIVITY: dict(detail=lambda u: u.cover_image_path, search='', landing=''),
    STREAM: dict(detail=lambda u: None, search='', landing=''),
    ADVENTURE: dict(detail=lambda u: u.cover_image_path, search='%s/images/adventure-banner.jpg' % prepend, landing=''),
    PROFILE: dict(detail=lambda u: '%s/images/userprofile-banner.jpg' % prepend if not u.background_image_path else u.background_image_path, search='%s/images/finder-banner.jpg' % prepend, landing=''),
    POST: dict(detail=lambda u: None, search='', landing=''),
    DISCUSSION: dict(detail=lambda u: u.cover_image_path if u.cover_image_path is not None and len(u.cover_image_path) > 0 else '%s/images/discussion-banner.jpg' % prepend, search='%s/images/discussion-banner.jpg' % prepend, landing=''),
    EVENT: dict(detail=lambda u: u.cover_image_path, search='%s/images/events-banner.jpg' % prepend, landing=''),
    ARTICLE: dict(detail=lambda u: u.cover_image_path, search='%s/images/journal-banner.jpg' % prepend, landing=''),
    TRIP: dict(detail=lambda u: u.cover_image_path, search='%s/images/adventure-trips-banner.jpg' % prepend, landing=''),
    CONTEST: dict(detail=lambda u: u.cover_image_path if u.cover_image_path is not None else '%s/images/userprofile-banner.jpg' % prepend, search='%s/images/contest-cover.jpg' % prepend, landing=''),
    "explore": dict(detail=lambda u: None, search=None, landing='%s/images/home-banner2.jpg' % prepend),
    "community": dict(detail=lambda u: None, search=None, landing='%s/images/community-banner.jpg' % prepend),
    "aboutus": dict(detail=lambda u: None, search=None, landing='%s/images/home-banner.jpg' % prepend),
    "terms": dict(detail=lambda u: None, search=None, landing='%s/images/home-banner.jpg' % prepend),
    "privacy": dict(detail=lambda u: None, search=None, landing='%s/images/home-banner.jpg' % prepend),
    "faq": dict(detail=lambda u: None, search=None, landing='%s/images/home-banner.jpg' % prepend),
    "contribute": dict(detail=lambda u: None, search=None, landing='%s/images/home-banner.jpg' % prepend),
    "advertise": dict(detail=lambda u: None, search=None, landing='%s/images/home-banner.jpg' % prepend)
}

class View(object):

    def get_card(self):
        raise Exception('Not Implemented')

    def get_title(self):
        raise Exception('Not Implemented')


class EditorView(View):

    def __init__(self, model_name, id=None):
        self.model_name = model_name
        self.id = id

    def get_title(self):
        return 'Fitrangi: Edit' + self.model_name

    def get_card(self):
        if self.id:
            extractor = NodeExtractor.factory(self.model_name)
            model = extractor.get_single("pk:%s;" % str(self.id) )
            if not g.user:
                raise Exception("where is the user")
            if model and model.author.id != g.user.id and 'Admin' not in g.user.roles:
                raise Exception("Invalid User")
        else:
            model = None

        from app.views import env
        template_path = 'site/includes/content-editor.html'
        template = env.get_template(template_path)
        from app.views import force_setup_context
        context = force_setup_context({})
        context['model'] = model
        context['model_name'] = self.model_name
        context['is_edit'] = True if model else False
        return template.render(**context)

class CollectionView(object):

    def __init__(self, model_name, category):
        self.model_name = model_name
        self.category = category

    @classmethod
    def build(cls, model_name, card_type, category='all'):
        if card_type == 'row':
            return RowCollectionView(model_name, category)
        elif card_type == 'grid':
            return GridCollectionView(model_name, category)
        elif card_type == 'icon':
            return IconCollectionView(model_name, category)
        else:
            return GridRowCollectionView(model_name, category)

    def get_card(self, context={}):
        from app.views import env
        template_path = 'site/pages/collections/' + self.card_type + '.html'
        template = env.get_template(template_path)
        context['category'] = self.category
        context['model_name'] = self.model_name
        context['card_type'] = self.card_type
        html = template.render(**context)
        return html

    def only_list(self, models):
        return self.__get_model_cards(models)

    def __get_model_cards(self, models):
        if len(models) > 0:
            def iterate_models(models):
                for model in models:

                    temp = NodeView.get_collection_card(self.model_name, self.card_type, model)
                    yield model, temp
            cards = [u[1] for u in iterate_models(models)]
            if not self.card_type == GRID_VIEW:
                return ''.join(cards)
            else:

                final_cards = [[], [], []]
                j = 0
                temp_cards = []
                for i in xrange(0, len(cards)):
                    final_cards[i % 3].append(cards[i])
                for i in xrange(0, 3):
                    temp_cards.append(''.join(final_cards[i]))
                out = '<div class="row">' + ''.join(['<div class="col-lg-4 col-md-4 col-sm-6 col-xs-12">%s</div>' % t for t in temp_cards]) + '</div>'
                return out

        else:
            return ''

    def _get_template_path(self):
        raise Exception('Not implemented')


class IconCollectionView(CollectionView):
    def __init__(self, model_name, category='all'):
        super(IconCollectionView, self).__init__(model_name, category)
        self.card_type = 'icon'

class RowCollectionView(CollectionView):
    def __init__(self, model_name, category='all'):
        super(RowCollectionView, self).__init__(model_name, category)
        self.card_type = 'row'

class GridCollectionView(CollectionView):
    def __init__(self, model_name, category='all'):
        super(GridCollectionView, self).__init__(model_name, category)
        self.card_type = 'grid'

class GridRowCollectionView(CollectionView):
    def __init__(self, model_name, category='all'):
        super(GridRowCollectionView, self).__init__(model_name, category)
        self.card_type = 'grid-row'

class CollectionType(object):

    def __init__(self, collection_view):
        self.collection_view = collection_view

    def only_list(self, models):
        return self.collection_view.only_list(models)

    def get_card(self, context={}):
        from app.views import env
        card = self.collection_view.get_card(context)
        context.update(dict(list_container=card))
        if hasattr(self, 'size') and self.size is not None:
            context['size'] = self.size
        template_path = self._get_template()
        template = env.get_template(template_path)
        html = template.render(**context)
        return html


class FixedCollection(CollectionType):

    def __init__(self, collection_view, size=6):
        super(FixedCollection, self).__init__(collection_view)
        self.size = size

    def _get_template(self):
        return 'site/pages/collections/fixed.html'

class ScrollableCollection(CollectionType):

    def __init__(self, collection_view, is_last_page=False):
        super(ScrollableCollection, self).__init__(collection_view)
        self.is_last_page = is_last_page

    def _get_template(self):
        return 'site/pages/collections/scrollable.html'


class NodeCollectionFactory(object):

    @classmethod
    def resolve(cls, model_name, card_type, category='all', fixed_size=None):
        collection_view = CollectionView.build(model_name, card_type, category)
        if not fixed_size:
            return ScrollableCollection(collection_view)
        else:
            return FixedCollection(collection_view, fixed_size)


class NodeView(View):

    @classmethod
    def get_collection_card(cls, model_name, card_type, model, context={}):
        try:
            from app.views import env
            from app.views import force_setup_context
            template_path = 'site/models/' + model_name + '/' + card_type + ".html"
            context = force_setup_context(context)
            context['model'] = model
            if model_name == STREAM:
                if model.is_post_activity:
                    template_path = 'site/models/post/row.html'
                    context['model'] = model.object
                else:
                    if model.is_entity_activity:
                        if model.object and model.object.id:
                            m_name, id = (model.object.__class__.__name__.lower(), str(model.object.id))
                            if m_name == 'profile':
                                c_type = ICON_VIEW
                            else:
                                c_type = GRID_VIEW
                            entity_view =  NodeView.get_collection_card(m_name, ICON_VIEW, NodeExtractor.factory(m_name).get_single("pk:%s" % id), {})
                            context['entity_view'] = entity_view

            template = env.get_template(template_path)
            card = template.render(**context)
        except Exception, e:
            traceback.print_exc(file=sys.stdout)
            print e.message
            card = ''
        return card

    @classmethod
    def get_editable_card(cls, model_name, model, context={}):
        from app.views import env
        from app.views import force_setup_context
        template_path = 'site/models/' + model_name + '/edit.html'
        template = env.get_template(template_path)
        context = force_setup_context(context)
        context['model'] = model
        context['profile_types'] = [u for u in ProfileType.objects.all() if u.name != 'Enthusiast']
        data = template.render(**context)
        return data


    @classmethod
    def get_detail_card(cls, model_name, model, context={}):
        from app.views import env
        from app.views import force_setup_context
        template_path = 'site/models/' + model_name + '/detail.html'
        template = env.get_template(template_path)
        context = force_setup_context(context)
        if isinstance(model, Content) and not isinstance(model, Contest):
            if not hasattr(model, 'views'):
                model.views = 0
            if model.views < 1000000000:
                model.views += 1
            model = model.save()
        context['model'] = model
        return template.render(**context)


class PageManager(object):

    @classmethod
    def get_meta_content(cls, title, description, url, image, type=''):
        from app.views import env
        from flask import request
        template_path = 'site/includes/meta.html'
        template = env.get_template(template_path)
        if type == ADVENTURE:
            type = 'article'
        elif type == TRIP:
            type = 'article'
        elif type == ARTICLE:
            pass
        elif type == EVENT:
            type = 'article'
        elif type == DISCUSSION:
            type = 'article'
        elif type == 'profile':
            pass
        elif type == 'contest':
            type = 'article'
        else:
            type = 'website'
        context = dict(title=title, description=description, url=url, image=image, type=type)
        return template.render(**context)

    @classmethod
    def get_detail_title_and_page(cls, model_name, **kwargs):
        from app.views import force_setup_context
        query = kwargs.get('query', None)
        user = kwargs.get('user', None)
        assert  query is not None
        model = NodeExtractor.factory(model_name).get_single(query)
        if model_name in ['blog', 'discussion', 'article'] and not model.admin_published:
            if not user or str(model.author.id) != user:
                return cls.get_search_title_and_page(model_name, query='', title="%s @ Fitrangi" % model_name.capitalize())

        image_path = WALL_IMAGE_NAMES[model_name].get('detail', '')(model)
        image_css = WALL_IMAGE_STYLE % image_path
        context = dict(parent=model, user=user, query=query, filters=convert_query_to_filter(query), background_cover=image_css)
        context = force_setup_context(context)
        context.update(Page.factory(model_name, 'detail').get_context(context))
        title = model.name if hasattr(model, 'name') and model.name is not None else (model.title if hasattr(model, 'title') and model.title is not None else 'Fitrangi: India\'s Complete Adventure Portal')
        description = model.description if model.description else ''
        if description:
            description = get_descriptions(description)
        if model_name == PROFILE:
            if model.cover_image_path is not None and len(model.cover_image_path) > 0:
                image_path = model.cover_image_path
        meta_content = PageManager.get_meta_content(model.title if hasattr(model, 'title') else model.name, description, request.url, image_path, model_name)
        context['title'] = title
        context['card'] = NodeView.get_detail_card(model_name, model, context)
        context['meta_content'] = meta_content
        context['cdn_url'] = CDN_URL if USE_CDN else ''
        return context

    @classmethod
    def get_edit_title_and_page(cls, model_name, **kwargs):
        from app.views import force_setup_context
        query = kwargs.get('query', None)
        user = kwargs.get('user', None) or str(g.user.id) if g.user and hasattr(g.user, 'id') else None
        is_business = kwargs.get('business', None)
        print query
        if query:
            try:
                model = NodeExtractor.factory(model_name).get_single(query)
            except Exception, e:
                print e
                model = None
        else:
            model = None

        if model and isinstance(model, Profile):
            context = dict(parent=model, user=user, query=query, filters=convert_query_to_filter(query), is_business=any([model.is_business_profile, len(model.managed_by) > 0]))
        else:
            if model and hasattr(model, 'managed_by') and hasattr(model, 'is_business_profile'):
                is_business_p = any([model.is_business_profile, len(model.managed_by) > 0])
            else:
                is_business_p = is_business
            context = dict(model=model, parent=model, user=user, query=query, filters=convert_query_to_filter(query), is_business=is_business_p)
        print model
        context.update(Page.factory(model_name, 'edit').get_context(context))
        context = force_setup_context(context)
        title = model.name if hasattr(model, 'name') and model.name is not None else (model.title if hasattr(model, 'title') and model.title is not None else GENERIC_TITLE)
        context['title'] = title
        context['card'] = NodeView.get_editable_card(model_name, model, context)
        context['cdn_url'] = CDN_URL if USE_CDN else ''
        return context

    @classmethod
    def get_search_title_and_page(cls, model_name, **kwargs):
        query = kwargs.get('query', None)
        user = kwargs.get('user', None)
        from app.views import env
        from app.views import force_setup_context
        template_path = COLLECTION_PATHS.get(model_name) + '.html'
        template = env.get_template(template_path)
        image_path = WALL_IMAGE_NAMES[model_name].get('search', '')
        image_css = WALL_IMAGE_STYLE % image_path
        context = dict(user=user, query=query, filters=convert_query_to_filter(query), background_cover=image_css)
        context = force_setup_context(context)
        context.update(Page.factory(model_name, 'search').get_context(context))
        html = template.render(**context)
        title = kwargs.get('title', '')
        if not title or len(title) is 0:
            title = "%s - %s" % (GENERIC_TITLE, CAPITALIZED_NAMES.get(model_name, 'Home'))
        meta_content = PageManager.get_meta_content(title, 'Know everything about Adventure Tourism in India, explore breathtaking activities, connect with the like minded and share unique experiences.', request.url, image_path, model_name)
        context['title'] = title
        context['card'] = html
        context['cdn_url'] = CDN_URL if USE_CDN else ''
        context['meta_content'] = meta_content
        return context

    @classmethod
    def get_landing_title_and_page(cls, model_name, **kwargs):
        from app.views import env
        from app.views import force_setup_context
        title = kwargs.get('title', '')
        if not title or len(title) is 0:
            title = "%s - %s" % (GENERIC_TITLE, CAPITALIZED_NAMES.get(model_name, 'Home'))
        query = kwargs.get('query', None)
        user = kwargs.get('user', None)
        template_path = COLLECTION_PATHS.get(model_name) + '.html'
        template = env.get_template(template_path)
        image_path = WALL_IMAGE_NAMES[model_name].get('landing', '')
        image_css = WALL_IMAGE_STYLE % image_path
        context = dict(user=user, query=query, filters=convert_query_to_filter(query), background_cover=image_css)
        context = force_setup_context(context)
        context.update(Page.factory(model_name, 'landing').get_context(context))
        html = template.render(**context)
        meta_content = PageManager.get_meta_content(title, 'Know everything about Adventure Tourism in India, explore breathtaking activities, connect with the like minded and share unique experiences.', request.url, image_path, model_name)
        context['title'] = title
        context['card'] = html
        context['cdn_url'] = CDN_URL if USE_CDN else ''
        context['meta_content'] = meta_content
        return context

    @classmethod
    def get_common_title_and_page(cls, page, **kwargs):
        from app.views import force_setup_context
        from app.views import env
        if page == 'login':
            text = 'Login to'
        elif page == 'register':
            text = 'Register with'
        else:
            raise Exception("Invalid page type")
        template_path = COLLECTION_PATHS.get(page) + '.html'
        template = env.get_template(template_path)
        context = kwargs if kwargs and len(kwargs) > 0 else {}
        context = force_setup_context(context)
        html = template.render(**context)
        return '%s fitrangi.com' % text, html, context


class Page(object):

    def __init__(self, model_name):
        self.model_name = model_name

    def get_context(self, context):
        raise Exception('Unimplemented')

    @classmethod
    def factory(self, model_name, type):
        if type == 'edit':
            if model_name == PROFILE:
                return profile_edit_page
            elif model_name == TRIP:
                return trip_edit_page
            else:
                raise Exception('Not implemented')
        elif type == 'detail':
            if model_name == ACTIVITY:
                return activity_detail_page
            elif model_name == ADVENTURE:
                return adventure_detail_page
            elif model_name == PROFILE:
                return profile_detail_page
            elif model_name == ARTICLE:
                return article_detail_page
            elif model_name == DISCUSSION:
                return discussion_detail_page
            elif model_name == TRIP:
                return trip_detail_page
            elif model_name == CONTEST:
                return contest_detail_page
            else:
                raise Exception("Not implemented")
        elif type == 'search':
            print 'TS', model_name == CONTEST
            if model_name == ADVENTURE:
                return adventure_search_page
            elif model_name == PROFILE:
                return profile_search_page
            elif model_name == ARTICLE:
                return article_search_page
            elif model_name == DISCUSSION:
                return discussion_search_page
            elif model_name == EVENT:
                return event_search_page
            elif model_name == TRIP:
                return trip_search_page
            elif model_name == CONTEST:
                return contest_search_page
            else:
                raise Exception("Not implemented")
        elif type == 'landing':
            if model_name == 'explore':
                return explore_landing_page
            elif model_name == 'community':
                return community_landing_page
            elif model_name == 'aboutus':
                return aboutus_landing_page
            elif model_name == 'privacy':
                return privacy_landing_page
            elif model_name == 'faq':
                return faq_landing_page
            elif model_name == 'terms':
                return terms_landing_page
            elif model_name == 'advertise':
                return advertise_landing_page
            elif model_name == 'contribute':
                return contribute_landing_page
            else:
                raise Exception("Not implemented")
        else:
            raise Exception("Invalid argument")

class LandingPage(Page):

    def __init__(self, model_name):
        super(LandingPage, self).__init__(model_name)

    def get_context(self, context):
        if self.model_name == 'explore':
            counters = dict(adventure=Adventure.objects.count(),
                            profile=Profile.objects(type__ne=ProfileType.objects(name__iexact='subscription only').first()).count(),
                            discussion=Discussion.objects.count(),
                            article=Article.objects.count(),
                            trips=Trip.objects.count(),
                            posts=Post.objects.count())
            journal = NodeCollectionFactory.resolve(ARTICLE, GRID_VIEW, fixed_size=6).get_card(context)
            adventure = NodeCollectionFactory.resolve(ADVENTURE, GRID_VIEW, fixed_size=6).get_card(context)
            event = NodeCollectionFactory.resolve(EVENT, GRID_VIEW, fixed_size=6).get_card(context)
            profile = NodeCollectionFactory.resolve(PROFILE, ICON_VIEW, fixed_size=24).get_card(context)
            discussion = NodeCollectionFactory.resolve(DISCUSSION, ROW_VIEW, fixed_size=4).get_card(context)
            testimonials = []
            testimonials.append(dict(name=u"Akshay Kumar", image="/images/testimonials/AKSHAY KUMAR.jpg", title=u"President, ATOAI (Adventure Tour Operators Association of India). CEO,  Mercury Himalayan Explorations", context=u"About Adventure Tourism Conclave 2015", content=u"I think Fitrangi did an awesome job. This was an event that saw a lot of adventure travel personalities who gave immense value in terms of knowledge capture. Coming from north India I think this was a big learning experience for me."))
            testimonials.append(dict(name=u"Kishori Gadre", image="/images/testimonials/Kishori-Gadre.jpg", title=u"General Manager, MTDC (Maharashtra Tourism Development Corporation)", context=u"About Adventure Tourism Conclave 2015", content=u"I really like to congratulate the organizers of this conclave, one of its kind because this is a new industry for Maharashtra. We all together can make Maharashtra a very good adventure tourism destination because we have potential in air, land and water."))
            testimonials.append(dict(name=u"Rajesh Gadgil", image="/images/testimonials/Rajesh Gadgil.jpg", title=u"Hon. Editor, The Himalayan Journal Magazine. Member,  Himalayan Club",  context=u"About Adventure Tourism Conclave 2015", content=u"It was fortunate that I attended today's Fitrangi event. I wish that many such events will follow and community in general and adventure lovers in particular will benefit from it."))
            testimonials.append(dict(name=u"Divyesh Muni", image="/images/testimonials/DIVYESH MUNI.jpg", title=u"Hon. Treasurer and Hon. Secretary - The Himalayan Club. IMF Climbing Award - Excellence in Mountaineering", context=u"About Adventure Tourism Conclave 2015", content=u"Today's conclave is a good start and it's something that one needs to continue because it brings the community together and take things forward."))
            testimonials.append(dict(name=u"Shantanu Pandit", image="/images/testimonials/Shantanu Pandit.jpg", title=u"Adventure Consultant. Founder , EKO (Experience - Knowledge - Outdoors)", context=u"About Adventure Tourism Conclave 2015", content=u"I think this was a great initiative. It brought a lot of people together perhaps after a long time and at a scale which was speaking at Maharashtra level. This is desperately required for the field of Adventure.  I really liked the fact that safety was emphasized and the speakers brought concrete inputs.  Hey Fitrangi - Great Stuff."))
            testimonials.append(dict(name=u"Shalik Jogwe", image="/images/testimonials/Shalik Jogwe.jpg", title=u"Wildlife Photographer, Naturalist and Owner at Vidarbha Wildlife", context=u"About Adventure Tourism Conclave 2015", content=u"I am thankful to ATOM and Fitrangi for providing this opportunity to present wildlife and accepting wild life as an adventure activity at Adventure Tourism Conclave 2015."))
            return dict(counters=counters, adventure=adventure, journal=journal, profile=profile, event=event, discussion=discussion, testimonials=testimonials)

        elif self.model_name == 'community':
            profile = NodeCollectionFactory.resolve(PROFILE, ICON_VIEW, fixed_size=24).get_card(context)
            event = NodeCollectionFactory.resolve(EVENT, GRID_VIEW, fixed_size=6).get_card(context)
            discussion = NodeCollectionFactory.resolve(DISCUSSION, ROW_VIEW, fixed_size=4).get_card(context)
            return dict(profile=profile, event=event, discussion=discussion)
        elif self.model_name == 'aboutus':
            title, content = ExtraPage.get_about_us()
            return dict(page_title=title, page_content=content)
        elif self.model_name == 'terms':
            title, content = ExtraPage.get_terms()
            return dict(page_title=title, page_content=content)
        elif self.model_name == 'privacy':
            title, content = ExtraPage.get_privacy()
            return dict(page_title=title, page_content=content)
        elif self.model_name == 'faq':
            title, content = ExtraPage.get_faq()
            return dict(page_title=title, page_content=content)
        elif self.model_name == 'advertise':
            title, content = ExtraPage.get_advertise()
            return dict(page_title=title, page_content=content)
        elif self.model_name == 'contribute':
            title, content = ExtraPage.get_contribute()
            return dict(page_title=title, page_content=content)
        else:
            raise Exception('Not implemented')

class SearchPage(Page):

    def __init__(self, model_name):
        super(SearchPage, self).__init__(model_name)

    def get_context(self, context):
        if self.model_name == ADVENTURE:
            return dict(count=Adventure.objects.count(), adventure_list=NodeCollectionFactory.resolve(ADVENTURE, GRID_VIEW).get_card(context))
        elif self.model_name == PROFILE:
            profile_type_names = [u.name.strip() for u in ProfileType.objects.all() if u.name != 'Subscription Only' and u.name is not None]
            return dict(profiles_list=NodeCollectionFactory.resolve(PROFILE, ROW_VIEW).get_card(context), types=profile_type_names)
        elif self.model_name == ARTICLE:
            all = NodeCollectionFactory.resolve(ARTICLE, GRID_VIEW).get_card(context)
            top = NodeCollectionFactory.resolve(ARTICLE, ROW_VIEW, category='top').get_card(context)
            my = NodeCollectionFactory.resolve(ARTICLE, ROW_VIEW, category='my').get_card(context)
            advertisement_list = NodeCollectionFactory.resolve(ADVERTISEMENT, GRID_ROW_VIEW, fixed_size=3).get_card(context)
            return dict(all=all, top=top, my=my, advertisement_list=advertisement_list)
        elif self.model_name == DISCUSSION:
            featured = NodeCollectionFactory.resolve(DISCUSSION, ROW_VIEW, category='featured').get_card(context)
            latest = NodeCollectionFactory.resolve(DISCUSSION, ROW_VIEW, category='latest').get_card(context)
            my = NodeCollectionFactory.resolve(DISCUSSION, ROW_VIEW, category='my').get_card(context)
            advertisement_list = NodeCollectionFactory.resolve(ADVERTISEMENT, GRID_ROW_VIEW, fixed_size=3).get_card(context)
            return dict(featured=featured, latest=latest, advertisement_list=advertisement_list, my=my)
        elif self.model_name == EVENT:
            return dict(events_list=NodeCollectionFactory.resolve(EVENT, ROW_VIEW).get_card(context))
        elif self.model_name == TRIP:
            interesting = NodeCollectionFactory.resolve(TRIP, GRID_VIEW, category='interesting').get_card(context)
            on_request = NodeCollectionFactory.resolve(TRIP, GRID_VIEW, category='on-request').get_card(context)
            upcoming = NodeCollectionFactory.resolve(TRIP, GRID_VIEW, category='upcoming').get_card(context)
            my_trips = NodeCollectionFactory.resolve(TRIP, ROW_VIEW, category='my-trips').get_card(context)
            return dict(upcoming=upcoming, now=str(datetime.datetime.now()).split(' ')[0], interesting=interesting, my_trips=my_trips, on_request=on_request)
        elif self.model_name == CONTEST:
            return dict(live=NodeCollectionFactory.resolve(CONTEST, ROW_VIEW, category='live').get_card(context), upcoming=NodeCollectionFactory.resolve(CONTEST, ROW_VIEW, category='upcoming').get_card(context), past=NodeCollectionFactory.resolve(CONTEST, ROW_VIEW, category='past').get_card(context), now=str(datetime.datetime.now()).split(' ')[0])
        else:
            raise Exception("not implemented")

class DetailPage(Page):

    def __init__(self, model_name):
        super(DetailPage, self).__init__(model_name)

    def get_context(self, context):
        if self.model_name == ACTIVITY:
            adventure_list = NodeCollectionFactory.resolve(ADVENTURE, GRID_VIEW).get_card(context)
            follower_list = NodeCollectionFactory.resolve(PROFILE, ROW_VIEW).get_card(context)
            discussion_list = NodeCollectionFactory.resolve(DISCUSSION, ROW_VIEW).get_card(context)
            article_list = NodeCollectionFactory.resolve(ARTICLE, GRID_VIEW).get_card(context)
            return dict(adventure_list=adventure_list, follower_list=follower_list, discussion_list=discussion_list, article_list=article_list)
        elif self.model_name == ADVENTURE:
            other_adventure_list = NodeCollectionFactory.resolve(ADVENTURE, GRID_ROW_VIEW, fixed_size=4).get_card(context)
            advertisement_list = NodeCollectionFactory.resolve(ADVERTISEMENT, GRID_ROW_VIEW, fixed_size=3).get_card(context)
            reviews = NodeCollectionFactory.resolve(POST, ROW_VIEW).get_card(context)
            return dict(other_adventure_list=other_adventure_list, advertisement_list=advertisement_list, reviews=reviews)
        elif self.model_name == PROFILE:
            wish_listed_adventure_list = NodeCollectionFactory.resolve(ADVENTURE, GRID_VIEW, category="wishlisted").get_card(context)
            accomplished_adventure_list = NodeCollectionFactory.resolve(ADVENTURE, GRID_VIEW, category="accomplished").get_card(context)
            following_list = NodeCollectionFactory.resolve(PROFILE, ROW_VIEW, category="following").get_card(context)
            follower_list = NodeCollectionFactory.resolve(PROFILE, ROW_VIEW, category="follower").get_card(context)
            discussion_list = NodeCollectionFactory.resolve(DISCUSSION, ROW_VIEW).get_card(context)
            article_list = NodeCollectionFactory.resolve(ARTICLE, GRID_VIEW).get_card(context)
            my_stream_list = NodeCollectionFactory.resolve(STREAM, ROW_VIEW, category='my').get_card(context)
            fitrangi_posts = NodeCollectionFactory.resolve(POST, GRID_ROW_VIEW, category="fitrangi").get_card(context)
            featured_profiles = ','.join(str(u.id) for u in profile_extractor.get_list("featured:bool|True;", False, 1, 10))
            claims = ClaimProfile.objects(claimed=context['parent']).count() #len([u for u in ClaimProfile.objects().all() if u.claimed.id == context['parent'].id])
            return dict(wish_listed_adventure_list=wish_listed_adventure_list, accomplished_adventure_list=accomplished_adventure_list,
                            follower_list=follower_list, following_list=following_list, discussion_list=discussion_list,
                            article_list=article_list, my_stream_list=my_stream_list, fitrangi_posts=fitrangi_posts,
                            featured_profiles=featured_profiles, claims=claims)
        elif self.model_name == ARTICLE:
            comments = NodeCollectionFactory.resolve(POST, ROW_VIEW).get_card(context)
            related = NodeCollectionFactory.resolve(ARTICLE, GRID_ROW_VIEW, fixed_size=3).get_card(context)
            advertisement_list = NodeCollectionFactory.resolve(ADVERTISEMENT, GRID_ROW_VIEW, fixed_size=3).get_card(context)
            return dict(comments=comments, related=related, advertisement_list=advertisement_list)
        elif self.model_name == DISCUSSION:
            comments = NodeCollectionFactory.resolve(POST, ROW_VIEW).get_card(context)
            featured = NodeCollectionFactory.resolve(DISCUSSION, GRID_ROW_VIEW, fixed_size=3).get_card(context)
            advertisement_list = NodeCollectionFactory.resolve(ADVERTISEMENT, GRID_ROW_VIEW, fixed_size=3).get_card(context)
            return dict(comments=comments, featured=featured, advertisement_list=advertisement_list)
        elif self.model_name == TRIP:
            discussions = NodeCollectionFactory.resolve(POST, ROW_VIEW).get_card(context)
            other_trips = NodeCollectionFactory.resolve(TRIP, GRID_ROW_VIEW, category="other", fixed_size=4).get_card(context)
            return dict(discussions=discussions, other_trips=other_trips)
        elif self.model_name == CONTEST:
            parent = context['parent']
            ads = parent.associated_advertisements if parent.associated_advertisements and len(parent.associated_advertisements) > 0 else None
            ad_views = []
            if ads:
                for ad in ads:
                    ad_view = NodeView.get_collection_card(ADVERTISEMENT, GRID_ROW_VIEW,  ad)
                    ad_views.append(ad_view)
            else:
                ad_view = ''
            return dict(ad_views=ad_views)
        else:
            return {}

class EditPage(Page):

    def __init__(self, model_name):
        super(EditPage, self).__init__(model_name)

    def get_context(self, context):
        if self.model_name == TRIP:
            categories_activities = defaultdict(list)
            if context.get('model'):
                assert str(context.get('model').organizer.id) == context.get('user') or str(context.get('user')) in [str(u.id) for u in Profile.objects(roles__in=['Admin']).all()]
            activities = Activity.objects.all()
            for activity in activities:
                categories_activities[activity.category].append(activity)
            return dict(activities=categories_activities)
        elif self.model_name == PROFILE:
            if context.get('parent'):
                assert str(context.get('parent').id) == context.get('user') or str(context.get('user')) in [str(u.id) for u in Profile.objects(roles__in=['Admin']).all()]
        elif self.model_name in [DISCUSSION, ARTICLE, POST]:
            if context.get('model'):
                assert str(context.get('model').author.id) == context.get('user') or str(context.get('user')) in [str(u.id) for u in Profile.objects(roles__in=['Admin']).all()]

        return {} #dict(profiles_types=ProfileType.objects.all())


explore_landing_page    = LandingPage('explore')
community_landing_page  = LandingPage('community')
aboutus_landing_page    = LandingPage('aboutus')
terms_landing_page      = LandingPage('terms')
privacy_landing_page    = LandingPage('privacy')
faq_landing_page        = LandingPage('faq')
advertise_landing_page  = LandingPage('advertise')
contribute_landing_page = LandingPage('contribute')

article_search_page     = SearchPage(ARTICLE)
adventure_search_page   = SearchPage(ADVENTURE)
profile_search_page     = SearchPage(PROFILE)
discussion_search_page  = SearchPage(DISCUSSION)
event_search_page       = SearchPage(EVENT)
trip_search_page        = SearchPage(TRIP)
contest_search_page     = SearchPage(CONTEST)

activity_detail_page    = DetailPage(ACTIVITY)
adventure_detail_page   = DetailPage(ADVENTURE)
profile_detail_page     = DetailPage(PROFILE)
article_detail_page     = DetailPage(ARTICLE)
discussion_detail_page  = DetailPage(DISCUSSION)
trip_detail_page        = DetailPage(TRIP)
contest_detail_page     = DetailPage(CONTEST)

profile_edit_page       = EditPage(PROFILE)
trip_edit_page          = EditPage(TRIP)
