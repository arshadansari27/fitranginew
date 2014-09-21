__author__ = 'arshad'


from app.models import *
from flask import render_template, request, g, flash, redirect, url_for, session, send_file, jsonify
from app.handlers.views import env
from app.handlers.views.facet_view import FacetView
from app.handlers.views.menu_view import MenuView
from app.handlers.views.model_view import ModelView
from app.handlers.extractors import get_all_facets, get_all_models, get_all_models_all_channels, search_models

class ChannelView(object):

    def __init__(self, channel_name, sub_channel=None, selected_facets=[], query=None, page=1, paginated=True):
        self.query = query
        self.channel, self.facets = get_all_facets(channel_name)


        _facets = []
        if len(selected_facets) > 0:
            _facets = [_v for _v in selected_facets if Facet.find(_v) is not None]
            print self.channel.name, sub_channel, _facets

        self.models, total = get_all_models(self.channel, sub_channel,  _facets, query, page, paginated)
        self.paginated = paginated

        _template = self.channel.template
        if not _template:
            raise Exception('The hell, where is the template')
        self.template = "%s/list_card.html" % _template
        self.facet_view = FacetView(self.facets, self.channel, sub_channel)
        self.menu_view = MenuView(self.channel.name, sub_channel if sub_channel else None)
        self.model_views = [ModelView(model, 'list', default='row') for model in self.models]
        print '******', len(self.model_views)
        link = "/" + channel_name
        if sub_channel:
            link+= '/' + sub_channel
        args = request.args
        if self.paginated:
            self.pageinfo = PaginationInfo(args, link, total, page)

    def render(self):
        models_arranged = {}
        _len = len(self.model_views) / 3
        for idx, model_view in enumerate(self.model_views):
            models_arranged.setdefault(idx % 3, [])
            models_arranged[idx % 3].append(model_view)

        if not self.paginated:
            return render_template(self.template, menu=self.menu_view, models=models_arranged, facets=self.facet_view, pageinfo=None, user=g.user, channel_name=self.channel.name)
        return render_template(self.template, menu=self.menu_view, models=models_arranged, facets=self.facet_view, pageinfo=self.pageinfo, user=g.user, channel_name=self.channel.name)


class PaginationInfo(object):

    def __init__(self, args, link, total, page):
        self.args = args
        self.link = link
        self.total = total
        self.page = page

    def render(self):
        return ''
