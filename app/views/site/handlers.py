from app.models import ACTIVITY, ADVENTURE, EVENT, TRIP, PROFILE, DISCUSSION, ARTICLE, BLOG, POST

__author__ = 'arshad'
from app.views.site.extractors import NodeExtractor

class View(object):

    def get_card(self):
        raise Exception('Not Implemented')

class NodeCollectionView(View):

    def __init__(self, model_name, card_type, filters={}, paged=True, page=1, size=50, is_partial=False, **kwargs):
        self.model_name =  model_name
        self.filters = filters
        self.paged = paged
        self.page = page
        self.size = size
        self.card_type = card_type
        self.is_partial = is_partial
        extractor_type = NodeExtractor.factory(self.model_name)
        self.extractor = extractor_type(self.filters)

    def get_card(self):
        from app.views import env
        models = self.extractor.get_list(self.paged, self.page, self.size)
        node_view = NodeView.factory(self.model_name)
        model_cards = [node_view(self.card_type, m.id).get_card() for m in models]
        template_path = self.get_template() #'site/pages/commons/list_page.html'
        template = env.get_template(template_path)
        context = dict(model_name=self.model_name, card_type=self.card_type, filters=self.filters, paged=self.paged, page=self.page, size=self.size)
        context['model_cards'] = model_cards
        return template.render(**context)

    def next_page(self, page):
        models = self.extractor.get_list(self.paged, page, self.size)
        node_view = NodeView.factory(self.model_name)
        return ''.join([node_view(self.card_type, m.id).get_card() for m in models])

    def get_page_path(self):
        raise Exception("Not implemented")

    def get_template(self):
        if self.is_partial:
            return "%s/%s" % (self.get_page_path(), "partial.html")
        else:
            return "%s/%s" % (self.get_page_path(), "full_path.html")

class AdventureNodeCollectionView(NodeCollectionView):

    def __init__(self, query, page=1, size=10, is_partial=False, is_empty_layout=True, **kwargs):
        super(AdventureCollectionView, self).__init__(query, page, size, is_partial, is_empty_layout)

    def collection_view(self):
        from app.views.site import MODEL_LIST_GRID_VIEW, MODEL_LIST_ROW_VIEW
        return NodeCollectionView(ADVENTURE, MODEL_LIST_GRID_VIEW, self.filters, paged=True, page=self.page, size=self.size, empty_layout=self.is_empty_layout)

    def get_page_path(self):
        return 'site/pages/searches/adventures'

class DiscussionNodeCollectionView(NodeCollectionView):

    def __init__(self, query, page=1, size=10, is_partial=False, is_empty_layout=True, **kwargs):
        super(DiscussionCollectionView, self).__init__(query, page, size, is_partial, is_empty_layout)

    def collection_view(self):
        from app.views.site import MODEL_LIST_GRID_VIEW, MODEL_LIST_ROW_VIEW
        return NodeCollectionView(DISCUSSION, MODEL_LIST_GRID_VIEW, self.filters, paged=True, page=self.page, size=self.size, empty_layout=self.is_empty_layout)

    def get_page_path(self):
        return 'site/pages/searches/discussions'

class EventNodeCollectionView(NodeCollectionView):

    def __init__(self, query, page=1, size=10, is_partial=False, is_empty_layout=True, **kwargs):
        super(EventCollectionView, self).__init__(query, page, size, is_partial, is_empty_layout)

    def collection_view(self):
        from app.views.site import MODEL_LIST_GRID_VIEW, MODEL_LIST_ROW_VIEW
        return NodeCollectionView(EVENT, MODEL_LIST_GRID_VIEW, self.filters, paged=True, page=self.page, size=self.size, empty_layout=self.is_empty_layout)

    def get_page_path(self):
        return 'site/pages/searches/events'

class ArticleNodeCollectionView(NodeCollectionView):

    def __init__(self, query, page=1, size=10, is_partial=False, is_empty_layout=True, **kwargs):
        super(ArticleCollectionView, self).__init__(query, page, size, is_partial, is_empty_layout)

    def collection_view(self):
        from app.views.site import MODEL_LIST_GRID_VIEW, MODEL_LIST_ROW_VIEW
        return NodeCollectionView(ARTICLE, MODEL_LIST_GRID_VIEW, self.filters, paged=True, page=self.page, size=self.size, empty_layout=self.is_empty_layout)

    def get_page_path(self):
        return 'site/pages/searches/journals'

class BlogNodeCollectionView(NodeCollectionView):

    def __init__(self, query, page=1, size=10, is_partial=False, is_empty_layout=True, **kwargs):
        super(BlogCollectionView, self).__init__(query, page, size, is_partial, is_empty_layout)

    def collection_view(self):
        from app.views.site import MODEL_LIST_GRID_VIEW, MODEL_LIST_ROW_VIEW
        return NodeCollectionView(BLOG, MODEL_LIST_ROW_VIEW, self.filters, paged=True, page=self.page, size=self.size, empty_layout=self.is_empty_layout)

    def get_page_path(self):
        return 'site/pages/searches/journals'

class TripNodeCollectionView(NodeCollectionView):

    def __init__(self, query, page=1, size=10, is_partial=False, is_empty_layout=True, **kwargs):
        super(TripCollectionView, self).__init__(query, page, size, is_partial, is_empty_layout)

    def collection_view(self):
        from app.views.site import MODEL_LIST_GRID_VIEW, MODEL_LIST_ROW_VIEW
        return NodeCollectionView(TRIP, MODEL_LIST_GRID_VIEW, self.filters, paged=True, page=self.page, size=self.size, empty_layout=self.is_empty_layout)

    def get_page_path(self):
        return 'site/pages/searches/trips'


class NodeView(View):

    def __init__(self, model_name, card_type, id, key, **kwargs):
        self.model_name = model_name
        self.card_type = card_type
        extractor_type = NodeExtractor.factory(self.model_name)
        filter = {}
        filter[key] = id
        self.extractor = extractor_type(filter)

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
    def factory(cls, model_view):
        if model_view == 'activity':
            return ActivityView
        elif model_view == 'adventure':
            return AdventureView
        elif model_view == 'event':
            return EventView
        elif model_view == 'trip':
            return TripView
        elif model_view == 'profile':
            return ProfileView
        elif model_view == 'article':
            return ArticleView
        elif model_view == 'blog':
            return BlogView
        elif model_view == 'discussion':
            return DiscussionView
        elif model_view == 'post':
            return PostView
        else:
            raise Exception("Invalid Model View")

class ActivityView(NodeView):

    def __init__(self, card_type, id, key='pk', **kwargs):
        super(ActivityView, self).__init__(ACTIVITY, card_type, id, key, **kwargs)

    def get_detail_context(self):
        return {}

    def get_card_context(self):
        return {}


class AdventureView(NodeView):

    def __init__(self, card_type, id, key='pk', **kwargs):
        super(AdventureView, self).__init__(ADVENTURE, card_type, id, key, **kwargs)

    def get_detail_context(self):
        return {}

    def get_card_context(self):
        return {}


class EventView(NodeView):

    def __init__(self, card_type, id, key='pk', **kwargs):
        super(EventView, self).__init__(EVENT, card_type, id, key, **kwargs)

    def get_detail_context(self):
        return {}

    def get_card_context(self):
        return {}

class TripView(NodeView):

    def __init__(self, card_type, id, key='pk', **kwargs):
        super(TripView, self).__init__(TRIP, card_type, id, key, **kwargs)

    def get_detail_context(self):
        return {}

    def get_card_context(self):
        return {}

class ProfileView(NodeView):

    def __init__(self, card_type, id, key='pk', **kwargs):
        super(ProfileView, self).__init__(PROFILE, card_type, id, key, **kwargs)

    def get_detail_context(self):
        return {}

    def get_card_context(self):
        return {}

class DiscussionView(NodeView):

    def __init__(self, card_type, id, key='pk', **kwargs):
        super(DiscussionView, self).__init__(DISCUSSION, card_type, id, key, **kwargs)

    def get_detail_context(self):
        return {}

    def get_card_context(self):
        return {}

class ArticleView(NodeView):

    def __init__(self, card_type, id, key='pk', **kwargs):
        super(ArticleView, self).__init__(ARTICLE, card_type, id, key, **kwargs)

    def get_detail_context(self):
        return {}

    def get_card_context(self):
        return {}

class BlogView(NodeView):

    def __init__(self, card_type, id, key='pk', **kwargs):
        super(BlogView, self).__init__(BLOG, card_type, id, key, **kwargs)

    def get_detail_context(self):
        return {}

    def get_card_context(self):
        return {}

class PostView(NodeView):

    def __init__(self, card_type, id, key='pk', **kwargs):
        super(PostView, self).__init__(POST, card_type, id, key, **kwargs)

    def get_detail_context(self):
        return {}

    def get_card_context(self):
        return {}
