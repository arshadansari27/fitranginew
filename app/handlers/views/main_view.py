__author__ = 'arshad'

from flask import render_template, g

from app.handlers.extractors import get_all_models_all_channels, search_models
from app.handlers.views.menu_view import MenuView
from app.handlers.views.model_view import ModelView
import requests, simplejson as json


class HomeView(object):

    def __init__(self, query):
        self.query = query
        self.models = get_all_models_all_channels(search_query=query)
        self.template =  'feature/home.html'
        self.menu = MenuView(None)
        self.model_dict_view = {}
        for k, models in self.models.iteritems():
            self.model_dict_view[k] = [ModelView(m, 'list') for m in models[0]]

        j_video = json.loads(requests.get("http://gdata.youtube.com/feeds/api/videos?max-results=4&alt=json&orderby=published&author=FitRangi").content)
        self.youtube_links = []
        for e in j_video['feed']['entry']:
            link = e['id']['$t'].split('/')[-1]
            if link and len(link) > 0:
                self.youtube_links.append(link)

    def render(self):
        return render_template(self.template, menu=self.menu, model_dict=self.model_dict_view, user=g.user, yt_links=self.youtube_links)

class SearchView(object):

    def __init__(self, query):
        self.query = query
        self.models = search_models(search_query=query)
        self.template =  'feature/search.html'
        self.menu = MenuView(None)
        self.models = [ModelView(model, 'list') for model in self.models]

    def render(self):
        return render_template(self.template, menu=self.menu, models=self.models, user=g.user)


