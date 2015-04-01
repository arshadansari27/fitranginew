from app.models import ADVENTURE, TRIP, DISCUSSION, EVENT, ARTICLE, BLOG
from app.views.site import NodeCollectionView, MODEL_LIST_GRID_VIEW, MODEL_LIST_ROW_VIEW

__author__ = 'arshad'


class SearchPage(object):

    def __init__(self, query, page=1, size=10, is_partial=False, is_empty_layout=True):
        self.is_partial = is_partial
        self.query = query
        self.page = page
        self.size = size
        self.is_empty_layout = is_empty_layout
        self.filters = {}
        if ';' in query:
            k, v = query.split(':')
            self.filters[k] = v
        else:
            for q in query.split(';'):
                k, v = q.split(':')
                self.filters[k] = v

    def collection_view(self):
        raise Exception("Not implemented")

    def get_page_path(self):
        raise Exception("Not implemented")

    def get_page(self):
        from app.views import force_setup_context
        context = force_setup_context(dict(page=self.page, size=self.size, filters=self.filters))
        view = self.collection_view().get_card()
        if self.is_partial:
            return view
        else:
            return view

    def get_next_list(self, page):
        return self.collection_view().next_page(page)


class AdventureSearchPage(SearchPage):

    def __init__(self, query, page=1, size=10, is_partial=False, is_empty_layout=True, **kwargs):
        super(AdventureSearchPage, self).__init__(query, page, size, is_partial, is_empty_layout)

    def collection_view(self):
        return NodeCollectionView(ADVENTURE, MODEL_LIST_GRID_VIEW, self.filters, paged=True, page=self.page, size=self.size, empty_layout=self.is_empty_layout)

    def get_page_path(self):
        return 'site/pages/searches/adventures'

class DiscussionSearchPage(SearchPage):

    def __init__(self, query, page=1, size=10, is_partial=False, is_empty_layout=True, **kwargs):
        super(DiscussionSearchPage, self).__init__(query, page, size, is_partial, is_empty_layout)

    def collection_view(self):
        return NodeCollectionView(DISCUSSION, MODEL_LIST_GRID_VIEW, self.filters, paged=True, page=self.page, size=self.size, empty_layout=self.is_empty_layout)

    def get_page_path(self):
        return 'site/pages/searches/discussions'

class EventSearchPage(SearchPage):

    def __init__(self, query, page=1, size=10, is_partial=False, is_empty_layout=True, **kwargs):
        super(EventSearchPage, self).__init__(query, page, size, is_partial, is_empty_layout)

    def collection_view(self):
        return NodeCollectionView(EVENT, MODEL_LIST_GRID_VIEW, self.filters, paged=True, page=self.page, size=self.size, empty_layout=self.is_empty_layout)

    def get_page_path(self):
        return 'site/pages/searches/events'

class ArticleSearchPage(SearchPage):

    def __init__(self, query, page=1, size=10, is_partial=False, is_empty_layout=True, **kwargs):
        super(ArticleSearchPage, self).__init__(query, page, size, is_partial, is_empty_layout)

    def collection_view(self):
        return NodeCollectionView(ARTICLE, MODEL_LIST_GRID_VIEW, self.filters, paged=True, page=self.page, size=self.size, empty_layout=self.is_empty_layout)

    def get_page_path(self):
        return 'site/pages/searches/journals'

class BlogSearchPage(SearchPage):

    def __init__(self, query, page=1, size=10, is_partial=False, is_empty_layout=True, **kwargs):
        super(BlogSearchPage, self).__init__(query, page, size, is_partial, is_empty_layout)

    def collection_view(self):
        return NodeCollectionView(BLOG, MODEL_LIST_ROW_VIEW, self.filters, paged=True, page=self.page, size=self.size, empty_layout=self.is_empty_layout)

    def get_page_path(self):
        return 'site/pages/searches/journals'

class TripSearchPage(SearchPage):

    def __init__(self, query, page=1, size=10, is_partial=False, is_empty_layout=True, **kwargs):
        super(TripSearchPage, self).__init__(query, page, size, is_partial, is_empty_layout)

    def collection_view(self):
        return NodeCollectionView(TRIP, MODEL_LIST_GRID_VIEW, self.filters, paged=True, page=self.page, size=self.size, empty_layout=self.is_empty_layout)

    def get_page_path(self):
        return 'site/pages/searches/trips'
