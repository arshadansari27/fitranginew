from app.utils import convert_query_to_filter

__author__ = 'arshad'

from app.handlers.extractors import NodeExtractor
from app.models import ACTIVITY, ADVENTURE, EVENT, TRIP, PROFILE, DISCUSSION, ARTICLE, POST, STREAM


class View(object):

    def get_card(self):
        raise Exception('Not Implemented')

class CompositeNodeCollectionView(View):

    def __init__(self, model_name, parent_model=None, configs={}):
        self.model_name = model_name
        self.collections = {}
        for k, v in configs.iteritems():
            self.collections[k] = NodeCollectionView.factory(model_name, v['card_type'], v.get('query', None), v.get('page', 1), v.get('size', 25), True, v.get('only_list', False), parent_model, category=k)

    def get_card(self, context={}):
        from app.views import env
        template_path = self.get_template()
        template = env.get_template(template_path)
        cards = dict((c, v.get_card()) for c, v in self.collections.iteritems())
        from app.views import force_setup_context
        context = force_setup_context(context)
        context['cards'] = cards
        return template.render(**context)

    def get_page_path(self):
        return self.collections[self.collections.keys()[0]].get_page_path()

    def get_template(self):
        return "%s/%s" % (self.get_page_path(), "composite_view.html")




class NodeCollectionView(View):

    def __init__(self, model_name, card_type, query=None, page=1, size=50, is_partial=False, only_list=False, paged=True, parent_model=None, fixed_size=None, category='all'):
        self.model_name = model_name
        self.category = category
        self.filters = convert_query_to_filter(query)
        self.paged = paged
        self.page = page
        self.size = size
        self.card_type = card_type
        self.is_partial = is_partial
        self.only_list = only_list
        self.parent = parent_model
        self.fixed_size = fixed_size
        self.extractor = NodeExtractor.factory(self.model_name, self.filters)

    def get_card(self, context=None):
        from app.views import env
        template_path = self.get_template()
        template = env.get_template(template_path)
        c = dict(model_name=self.model_name, card_type=self.card_type, filters=self.filters, parent=self.parent)
        if not context:
            context = c
        else:
            for k, v in c.iteritems():
                context[k] = v
        if self.fixed_size:
            last_page = 1
        else:
            last_page = self.extractor.last_page(self.size)
        current_page = self.page
        context['last_page'] = last_page
        context['current_page'] = current_page
        context['category'] = self.category
        return template.render(**context)

    def get_last_page(self):
        if self.fixed_size:
            return 1
        else:
            return self.extractor.last_page(self.size)

    def next_page(self, page):
        try:
            models = self.extractor.get_list(True, page, self.size)
        except:
            models = []
        if len(models) > 0:
            return ''.join([NodeView.factory(self.model_name, self.card_type, m.id).get_card() for m in models])
        else:
            return '<div class="jumbotron"><h6>No data available for this category</h6></div>'

    def get_page_path(self):
        raise Exception("Not implemented")

    def get_template(self):
        if self.only_list:
            return "%s/%s" % (self.get_page_path(), "list_only.html")
        elif self.is_partial:
            return "%s/%s" % (self.get_page_path(), "partial.html")
        else:
            return "%s/%s" % (self.get_page_path(), "full_page.html")

    @classmethod
    def factory(cls, model_view, card_type, query=None, page=1, size=10, is_partial=False, only_list=False, parent=None, category='all'):
        if model_view == ADVENTURE:
            return AdventureCollectionView(
                card_type, query, page, size, is_partial, only_list, parent=parent, category=category)
        elif model_view == EVENT:
            return EventCollectionView(
                card_type, query, page, size, is_partial, only_list, parent=parent, category=category)
        elif model_view == TRIP:
            return TripCollectionView(
                card_type, query, page, size, is_partial, only_list, parent=parent, category=category)
        elif model_view == PROFILE:
            return ProfileCollectionView(
                card_type, query, page, size, is_partial, only_list, parent=parent, category=category)
        elif model_view == ARTICLE or model_view == 'journal':
            return ArticleCollectionView(
                card_type, query, page, size, is_partial, only_list, parent=parent, category=category)
        elif model_view == DISCUSSION:
            return DiscussionCollectionView(
                card_type, query, page, size, is_partial, only_list, parent=parent, category=category)
        elif model_view == POST:
            return PostCollectionView(
                card_type, query, page, size, is_partial, only_list, parent=parent, category=category)
        elif model_view == STREAM:
            return StreamCollectionView(
                card_type, query, page, size, is_partial, only_list, parent=parent, category=category)
        else:
            raise Exception("Invalid Model View")

class StreamCollectionView(NodeCollectionView):

    def __init__(self, card_type, query, page=1, size=10, is_partial=False, only_list=False, parent=None, fixed_size=None, category='all'):
        super(StreamCollectionView, self).__init__(STREAM, card_type, query, page, size, is_partial, only_list, parent_model=parent, fixed_size=fixed_size, category=category)
        self.model_name = STREAM

    def get_page_path(self):
        return 'site/pages/searches/streams'


class AdventureCollectionView(NodeCollectionView):

    def __init__(self, card_type, query, page=1, size=10, is_partial=False, only_list=False, parent=None, fixed_size=None, category='all'):
        super(self.__class__, self).__init__(ADVENTURE, card_type, query,  page, size, is_partial, only_list, parent_model=parent, fixed_size=fixed_size, category=category)
        self.model_name = ADVENTURE

    def get_page_path(self):
        return 'site/pages/searches/adventures'

class ProfileCollectionView(NodeCollectionView):

    def __init__(self, card_type, query, page=1, size=10, is_partial=False, only_list=False, parent=None, fixed_size=None, category='all'):
        super(ProfileCollectionView, self).__init__(PROFILE, card_type, query,  page, size, is_partial, only_list, parent_model=parent, fixed_size=fixed_size, category=category)
        self.model_name = PROFILE

    def get_page_path(self):
        return 'site/pages/searches/profiles'

class PostCollectionView(NodeCollectionView):

    def __init__(self, card_type, query, page=1, size=10, is_partial=False, only_list=False, parent=None, fixed_size=None, category='all'):
        super(PostCollectionView, self).__init__(POST, card_type, query, page, size, is_partial, only_list, parent_model=parent, fixed_size=fixed_size, category=category)
        self.model_name = POST

    def get_page_path(self):
        return 'site/pages/searches/posts'

class DiscussionCollectionView(NodeCollectionView):

    def __init__(self, card_type, query, page=1, size=10, is_partial=False, only_list=False, parent=None, fixed_size=None, category='all'):
        super(DiscussionCollectionView, self).__init__(DISCUSSION, card_type, query, page, size, is_partial, only_list, parent_model=parent, fixed_size=fixed_size, category=category)
        self.model_name = DISCUSSION

    def get_page_path(self):
        return 'site/pages/searches/discussions'

class EventCollectionView(NodeCollectionView):

    def __init__(self, card_type, query, page=1, size=10, is_partial=False, only_list=False, parent=None, fixed_size=None, category='all'):
        super(EventCollectionView, self).__init__(EVENT, card_type, query, page, size, is_partial, only_list, parent_model=parent, fixed_size=fixed_size, category=category)
        self.model_name = EVENT

    def get_page_path(self):
        return 'site/pages/searches/events'

class ArticleCollectionView(NodeCollectionView):

    def __init__(self, card_type, query, page=1, size=10, is_partial=False, only_list=False, parent=None, fixed_size=None, category='all'):
        super(ArticleCollectionView, self).__init__(ARTICLE, card_type, query, page, size, is_partial, only_list, parent_model=parent, fixed_size=fixed_size, category=category)
        self.model_name = ARTICLE

    def get_page_path(self):
        return 'site/pages/searches/contents'

class TripCollectionView(NodeCollectionView):

    def __init__(self, card_type, query, page=1, size=10, is_partial=False, only_list=False, parent=None, fixed_size=None, category='all'):
        super(TripCollectionView, self).__init__(TRIP, card_type, query, page, size, is_partial, only_list, parent_model=parent, fixed_size=fixed_size, category=category)
        self.model_name = TRIP

    def get_page_path(self):
        return 'site/pages/searches/trips'


class NodeView(View):

    def __init__(self, model_name, card_type, id, key='pk'):
        self.model_name = model_name
        self.card_type = card_type
        filters = {}
        filters[key] = str(id)
        self.extractor = NodeExtractor.factory(self.model_name, filters)

    def get_card(self):
        from app.views import env
        from app.views import force_setup_context
        if self.card_type == 'grid-row':
            file_name = 'grid'
        else:
            file_name = self.card_type
        template_path = self.get_template_folder() + '/' + file_name + ".html"
        template = env.get_template(template_path)
        context = self.get_context()

        context = force_setup_context(context)
        context['model'] = self.get_model()
        context['grid_size'] = 'col-lg-4 col-md-4 col-sm-6 col-xs-12' if self.card_type != 'grid-row' else 'col-sm-12 col-xs-12'
        return template.render(**context)

    def get_template_folder(self):
        if self.model_name in ['article', 'blog']:
            model_name = 'content'
        else:
            model_name = self.model_name
        return 'site/models/%s' % model_name

    def get_context(self):
        if self.card_type == 'detail':
            return self.get_detail_context()
        else:
            return self.get_card_context()

    def get_model(self):
        if not hasattr(self, 'model') or not self.model:
            self.model = self.extractor.get_single()
        return self.model

    def get_detail_context(self):
        raise Exception("Not Implemented")

    def get_card_context(self):
        raise Exception("Not Implemented")

    @classmethod
    def factory(cls, model_view, card_type, id, key='pk'):
        if model_view == ACTIVITY:
            return ActivityView(card_type, id, key)
        elif model_view == ADVENTURE:
            return AdventureView(card_type, id, key)
        elif model_view == EVENT:
            return EventView(card_type, id, key)
        elif model_view == TRIP:
            return TripView(card_type, id, key)
        elif model_view == PROFILE:
            return ProfileView(card_type, id, key)
        elif model_view == ARTICLE:
            return ArticleView(card_type, id, key)
        elif model_view == DISCUSSION:
            return DiscussionView(card_type, id, key)
        elif model_view == POST:
            return PostView(card_type, id, key)
        elif model_view == STREAM:
            return StreamView(card_type, id, key)
        else:
            raise Exception("Invalid Model View")


class StreamView(NodeView):

    def __init__(self, card_type, id, key='pk'):
        super(StreamView, self).__init__(STREAM, card_type, id, key)

    def get_detail_context(self):
        return {}

    def get_card_context(self):
        return {}

class ActivityView(NodeView):

    def __init__(self, card_type, id, key='pk'):
        super(ActivityView, self).__init__(ACTIVITY, card_type, id, key)

    def get_detail_context(self):
        parent=self.get_model()
        return {
            'adventure_list': AdventureCollectionView("grid", "", is_partial=True, parent=parent).get_card(),
            "follower_list": ProfileCollectionView("row", "", is_partial=True, parent=parent).get_card(),
            'discussion_list': DiscussionCollectionView("row", "", is_partial=True, parent=parent).get_card(),
            'article_list': ArticleCollectionView("grid", "", is_partial=True, parent=parent).get_card()
        }

    def get_card_context(self):
        return {}


class AdventureView(NodeView):

    def __init__(self, card_type, id, key='pk'):
        super(AdventureView, self).__init__(ADVENTURE, card_type, id, key)

    def get_detail_context(self):
        parent=self.get_model()
        other_adventure_list = AdventureCollectionView("grid-row", "", only_list=True, parent=parent, fixed_size=True).get_card()
        return {
            'other_adventure_list': other_adventure_list
        }

    def get_card_context(self):
        return {}


class EventView(NodeView):

    def __init__(self, card_type, id, key='pk'):
        super(EventView, self).__init__(EVENT, card_type, id, key)

    def get_detail_context(self):
        return {}

    def get_card_context(self):
        return {}

class TripView(NodeView):

    def __init__(self, card_type, id, key='pk'):
        super(TripView, self).__init__(TRIP, card_type, id, key)

    def get_detail_context(self):
        return {}

    def get_card_context(self):
        return {}

class ProfileView(NodeView):

    def __init__(self, card_type, id, key='pk'):
        super(ProfileView, self).__init__(PROFILE, card_type, id, key)

    def get_detail_context(self):
        return {}

    def get_card_context(self):
        return {}

class DiscussionView(NodeView):

    def __init__(self, card_type, id, key='pk'):
        super(DiscussionView, self).__init__(DISCUSSION, card_type, id, key)

    def get_detail_context(self):
        return {}

    def get_card_context(self):
        return {}

class ArticleView(NodeView):

    def __init__(self, card_type, id, key='pk'):
        super(ArticleView, self).__init__(ARTICLE, card_type, id, key)

    def get_detail_context(self):
        parent=self.get_model()
        posts = PostCollectionView("row", "", is_partial=True, parent=parent).get_card(dict(post_type='comment'))
        related = ArticleCollectionView("grid-row", "", only_list=True, is_partial=True, fixed_size=True).get_card()
        return {
            'comments': posts,
            'related': related
        }

    def get_card_context(self):
        return {}

class PostView(NodeView):

    def __init__(self, card_type, id, key='pk'):
        super(PostView, self).__init__(POST, card_type, id, key)

    def get_detail_context(self):
        return {}

    def get_card_context(self):
        return {}

