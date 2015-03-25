__author__ = 'arshad'
from app.views.site.extractors import NodeExtractor

class View(object):

    def get_card(self):
        raise Exception('Not Implemented')

class NodeCollectionView(View):

    def __init__(self, model_name, card_type, filters={}, paged=True, page=1, size=50, without_layout=False):
        self.model_name =  model_name
        self.filters = filters
        self.paged = paged
        self.page = page
        self.size = size
        self.card_type = card_type
        self.without_layout = without_layout
        extractor_type = NodeExtractor.factory(self.model_name)
        self.extractor = extractor_type(self.filters)

    def get_card(self):
        from app.views import env
        models = self.extractor.get_list(self.paged, self.page, self.size)
        node_view = NodeView.factory(self.model_name)
        model_cards = [node_view(self.card_type, m.id).get_card() for m in models]
        template_path = 'site/layouts/' + self.card_type + "_page.html"
        template = env.get_template(template_path)
        return template.render(dict(model_cards=model_cards))


class NodeView(View):

    def __init__(self, model_name, card_type, id, key):
        self.model_name = model_name
        self.card_type = card_type
        extractor_type = NodeExtractor.factory(self.model_name)
        filter = {}
        filter[key] = id
        self.extractor = extractor_type(filter)

    def get_card(self):
        from app.views import env
        template_path = self.get_template_folder() + '/' + self.card_type + ".html"
        template = env.get_template(template_path)
        context = self.get_context()
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

    def __init__(self, card_type, id, key='pk'):
        super(ActivityView, self).__init__("activity", card_type, id, key)

    def get_detail_context(self):
        return {}

    def get_card_context(self):
        return {}


class AdventureView(NodeView):

    def __init__(self, card_type, id, key='pk'):
        super(AdventureView, self).__init__("adventure", card_type, id, key)

    def get_detail_context(self):
        return {}

    def get_card_context(self):
        return {}


class EventView(NodeView):

    def __init__(self, card_type, id, key='pk'):
        super(EventView, self).__init__("event", card_type, id, key)

    def get_detail_context(self):
        return {}

    def get_card_context(self):
        return {}

class TripView(NodeView):

    def __init__(self, card_type, id, key='pk'):
        super(TripView, self).__init__("trip", card_type, id, key)

    def get_detail_context(self):
        return {}

    def get_card_context(self):
        return {}

class ProfileView(NodeView):

    def __init__(self, card_type, id, key='pk'):
        super(ProfileView, self).__init__("profile", card_type, id, key)

    def get_detail_context(self):
        return {}

    def get_card_context(self):
        return {}

class DiscussionView(NodeView):

    def __init__(self, card_type, id, key='pk'):
        super(DiscussionView, self).__init__("discussion", card_type, id, key)

    def get_detail_context(self):
        return {}

    def get_card_context(self):
        return {}

class ArticleView(NodeView):

    def __init__(self, card_type, id, key='pk'):
        super(ArticleView, self).__init__("article", card_type, id, key)

    def get_detail_context(self):
        return {}

    def get_card_context(self):
        return {}

class BlogView(NodeView):

    def __init__(self, card_type, id, key='pk'):
        super(BlogView, self).__init__("blog", card_type, id, key)

    def get_detail_context(self):
        return {}

    def get_card_context(self):
        return {}

class PostView(NodeView):

    def __init__(self, card_type, id, key='pk'):
        super(PostView, self).__init__("post", card_type, id, key)

    def get_detail_context(self):
        return {}

    def get_card_context(self):
        return {}
