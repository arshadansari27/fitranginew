__author__ = 'arshad'

from flask import render_template, request, g

from app.models import *
from app.handlers.views.facet_view import FacetView
from app.handlers.views.menu_view import MenuView
from app.handlers.views.model_view import ModelView
from app.handlers.extractors import get_all_models, get_channel, get_models_by_only_single

class StreamView(object):

    def __init__(self, page=1):
        self.page = page
        self.channel = get_channel('Stream')

        _template = self.channel.template
        if not _template:
            raise Exception('The hell, where is the template')
        self.template = "%s/list_card.html" % _template
        self.menu_view = MenuView(self.channel.name)


    def render(self):
        models = [ModelView(u, 'list', channel_name='Stream') for u in Post.objects.all().order_by('-modified_timestamp')]
        models_arranged = {}
        for idx, m in enumerate(models):
                models_arranged.setdefault(idx % 3, [])
                models_arranged[idx % 3].append(m)

        return render_template(self.template, menu=self.menu_view, user=g.user, channel_name=self.channel.name, models=models_arranged)


class ChannelView(object):

    def __init__(self, channel_name, selected_facets=[], query=None, only_facet=False, page=1, paginated=True):
        self.channel_name = channel_name
        self.query = query
        self.channel = get_channel(channel_name)

        _facets = []
        if len(selected_facets) > 0:
            _facets = [_v for _v in selected_facets if Facet.find(_v) is not None]
            self.facets = [f for f in Facet.all_facets if f.name in _facets]
        else:
            self.facets = []

        if only_facet:
            self.models, total = get_models_by_only_single(self.channel.name, self.facets[0].name)
        else:
            self.models, total = get_all_models(self.channel, _facets, query, page, paginated)
        self.paginated = paginated

        _template = self.channel.template
        if not _template:
            raise Exception('The hell, where is the template')
        self.template = "%s/list_card.html" % _template
        self.facet_view = FacetView(self.facets, self.channel, self.models)
        self.menu_view = MenuView(self.channel.name)
        self.model_views = [ModelView(model, 'list', default='row') for model in self.models]
        link = "/" + channel_name
        args = request.args
        if self.paginated:
            self.pageinfo = PaginationInfo(args, link, total, page)
        self.tags = [t.name for t in Tag.objects.all()]

    def render(self):
        if self.channel_name == 'Forum':
            models_arranged = []
            for idx, model_view in enumerate(self.model_views):
                models_arranged.append(model_view)
        else:
            _len = len(self.model_views) / 3
            models_arranged = {}
            for idx, model_view in enumerate(self.model_views):
                models_arranged.setdefault(idx % 3, [])
                models_arranged[idx % 3].append(model_view)

        if not self.paginated:
            return render_template(self.template, menu=self.menu_view, models=models_arranged, facets=self.facet_view, pageinfo=None, user=g.user, channel_name=self.channel.name, tags=self.tags)
        return render_template(self.template, menu=self.menu_view, models=models_arranged, facets=self.facet_view, pageinfo=self.pageinfo, user=g.user, channel_name=self.channel.name, tags=self.tags)


class PaginationInfo(object):

    def __init__(self, args, link, total, page):
        self.args = args
        self.link = link
        self.total = total
        self.page = page

    def render(self):
        return ''
