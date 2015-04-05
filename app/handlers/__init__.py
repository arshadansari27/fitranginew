from app.utils import convert_query_to_filter

__author__ = 'arshad'

from app.handlers.extractors import NodeExtractor
from app.models import ACTIVITY, ADVENTURE, EVENT, TRIP, PROFILE, DISCUSSION, ARTICLE, POST, STREAM


class View(object):

    def get_card(self):
        raise Exception('Not Implemented')

class NodeCollectionView(View):

    def __init__(self, model_name, card_type, query=None, page=1, size=50, is_partial=False, only_list=False, paged=True):
        self.model_name = model_name
        self.filters = convert_query_to_filter(query)
        self.paged = paged
        self.page = page
        self.size = size
        self.card_type = card_type
        self.is_partial = is_partial
        self.only_list = only_list
        self.extractor = NodeExtractor.factory(self.model_name, self.filters)

    def get_card(self, context=None):
        from app.views import env
        template_path = self.get_template()
        template = env.get_template(template_path)
        c = dict(model_name=self.model_name, card_type=self.card_type, filters=self.filters)
        if not context:
            context = c
        else:
            for k, v in c.iteritems():
                context[k] = v

        last_page = self.extractor.last_page(self.size)
        current_page = self.page
        context['last_page'] = last_page
        context['current_page'] = current_page
        return template.render(**context)

    def next_page(self, page):
        models = self.extractor.get_list(self.paged, page, self.size)
        return ''.join([NodeView.factory(self.model_name, self.card_type, m.id).get_card() for m in models])

    def get_page_path(self):
        raise Exception("Not implemented")

    def get_template(self):
        if self.only_list:
            return "site/pages/commons/list_page.html"
        elif self.is_partial:
            return "%s/%s" % (self.get_page_path(), "partial.html")
        else:
            return "%s/%s" % (self.get_page_path(), "full_page.html")

    @classmethod
    def factory(cls, model_view, card_type, query=None, page=1, size=10, is_partial=False, only_list=False):
        if model_view == ADVENTURE:
            return AdventureCollectionView(
                card_type, query, page, size, is_partial, only_list)
        elif model_view == EVENT:
            return EventCollectionView(
                card_type, query, page, size, is_partial, only_list)
        elif model_view == TRIP:
            return TripCollectionView(
                card_type, query, page, size, is_partial, only_list)
        elif model_view == PROFILE:
            return ProfileCollectionView(
                card_type, query, page, size, is_partial, only_list)
        elif model_view == ARTICLE:
            return ArticleCollectionView(
                card_type, query, page, size, is_partial, only_list)
        elif model_view == DISCUSSION:
            return DiscussionCollectionView(
                card_type, query, page, size, is_partial, only_list)
        elif model_view == POST:
            return PostCollectionView(
                card_type, query, page, size, is_partial, only_list)
        elif model_view == STREAM:
            return StreamCollectionView(
                card_type, query, page, size, is_partial, only_list)
        else:
            raise Exception("Invalid Model View")

class StreamCollectionView(NodeCollectionView):

    def __init__(self, card_type, query, page=1, size=10, is_partial=False, only_list=False):
        super(StreamCollectionView, self).__init__(STREAM, card_type, query, page, size, is_partial, only_list)
        self.model_name = STREAM

    def get_page_path(self):
        return 'site/pages/searches/streams'


class AdventureCollectionView(NodeCollectionView):

    def __init__(self, card_type, query, page=1, size=10, is_partial=False, only_list=False):
        super(self.__class__, self).__init__(ADVENTURE, card_type, query,  page, size, is_partial, only_list)
        self.model_name = ADVENTURE

    def get_page_path(self):
        return 'site/pages/searches/adventures'

class ProfileCollectionView(NodeCollectionView):

    def __init__(self, card_type, query, page=1, size=10, is_partial=False, only_list=False):
        super(ProfileCollectionView, self).__init__(PROFILE, card_type, query,  page, size, is_partial, only_list)
        self.model_name = PROFILE

    def get_page_path(self):
        return 'site/pages/searches/profiles'

class PostCollectionView(NodeCollectionView):

    def __init__(self, card_type, query, page=1, size=10, is_partial=False, only_list=False):
        super(PostCollectionView, self).__init__(POST, card_type, query, page, size, is_partial, only_list)
        self.model_name = POST

    def get_page_path(self):
        return 'site/pages/searches/posts'

class DiscussionCollectionView(NodeCollectionView):

    def __init__(self, card_type, query, page=1, size=10, is_partial=False, only_list=False):
        super(DiscussionCollectionView, self).__init__(DISCUSSION, card_type, query, page, size, is_partial, only_list)
        self.model_name = DISCUSSION

    def get_page_path(self):
        return 'site/pages/searches/discussions'

class EventCollectionView(NodeCollectionView):

    def __init__(self, card_type, query, page=1, size=10, is_partial=False, only_list=False):
        super(EventCollectionView, self).__init__(EVENT, card_type, query, page, size, is_partial, only_list)
        self.model_name = EVENT

    def get_page_path(self):
        return 'site/pages/searches/events'

class ArticleCollectionView(NodeCollectionView):

    def __init__(self, card_type, query, page=1, size=10, is_partial=False, only_list=False):
        super(ArticleCollectionView, self).__init__(ARTICLE, card_type, query, page, size, is_partial, only_list)
        self.model_name = ARTICLE

    def get_page_path(self):
        return 'site/pages/searches/journals'

class TripCollectionView(NodeCollectionView):

    def __init__(self, card_type, query, page=1, size=10, is_partial=False, only_list=False):
        super(TripCollectionView, self).__init__(TRIP, card_type, query, page, size, is_partial, only_list)
        self.model_name = TRIP

    def get_page_path(self):
        return 'site/pages/searches/trips'


class NodeView(View):

    def __init__(self, model_name, card_type, id, key='pk'):
        self.model_name = model_name
        self.card_type = card_type
        filters = {}
        filters[key] = id
        self.extractor = NodeExtractor.factory(self.model_name, filters)

    def get_card(self):
        from app.views import env
        from app.views import force_setup_context
        template_path = self.get_template_folder() + '/' + self.card_type + ".html"
        template = env.get_template(template_path)
        context = self.get_context()

        context = force_setup_context(context)
        context['model'] = self.extractor.get_single()
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
        return {
            'adventure_list': AdventureCollectionView("grid", "", is_partial=True).get_card(),
            'discussion_list': DiscussionCollectionView("row", "", is_partial=True).get_card(),
            'article_list': ArticleCollectionView("grid", "", is_partial=True).get_card()
        }

    def get_card_context(self):
        return {}


class AdventureView(NodeView):

    def __init__(self, card_type, id, key='pk'):
        super(AdventureView, self).__init__(ADVENTURE, card_type, id, key)

    def get_detail_context(self):
        return {}

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
        return {}

    def get_card_context(self):
        return {}

class PostView(NodeView):

    def __init__(self, card_type, id, key='pk'):
        super(PostView, self).__init__(POST, card_type, id, key)

    def get_detail_context(self):
        return {}

    def get_card_context(self):
        return {}

