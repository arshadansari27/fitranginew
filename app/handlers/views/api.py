__author__ = 'arshad'

from app.models import Channel, Node, Content, Profile, Tag, Facet

class ModelApi(object):

    def __init__(self, channel_name=None, facets=None, query=None, paged=False):
        if channel_name:
           channel = Channel.getByName(channel_name)
           model_class = Node.model_factory(channel.name)
        else:
            model_class = Content
        criteria = {'channels': channel_name}
        if facets:
            criteria['facets'] = facets

        if query is not None:
            if model_class == Profile:
                criteria['name'] = {'$regex': query}
            else:
                criteria['title'] = {'$regex': query}
        if model_class == Profile:
            self.option_display = 'name'
        else:
            self.option_display = 'title'
        if paged:
            self.models = model_class.objects(__raw__=criteria).all()[0:5]
        else:
            self.models = model_class.objects(__raw__=criteria).all()


    def dictify(self):
        models = [dict(option_value=str(u['id']), option_display=u[self.option_display], score=1) for u in self.models]
        return models


class TagApi(object):

    def __init__(self, query=None):
        self.query = query

    def dictify(self):
        if self.query:
            tags = Tag.objects(name__iexact=self.query).all()[0:7]
        else:
            tags = Tag.objects().all()[0:7]
        _tags = [d.name for d in tags]
        return _tags

class ChannelApi(object):

    def dictify(self):
        channels = Channel.all_data
        return [c.name for c in channels]

class FacetApi(object):

    def dictify(self):
        return [u.name for u in Facet.all_facets]
