__author__ = 'arshad'

from flask import render_template, g
from app.handlers.extractors import get_all_facets, get_all_models, get_all_models_all_channels, search_models
from app.handlers.views.menu_view import MenuView
from app.handlers.views.model_view import ModelView

class HomeView(object):

    def __init__(self, query):
        self.query = query
        self.models = get_all_models_all_channels(search_query=query)
        self.template =  'feature/home.html'
        self.menu = MenuView(None, None)
        self.model_dict_view = {}
        for k, models in self.models.iteritems():
            self.model_dict_view[k] = [ModelView(m, 'list') for m in models[0]]

    def render(self):
        return render_template(self.template, menu=self.menu, model_dict=self.model_dict_view, user=g.user)

class SearchView(object):

    def __init__(self, query):
        self.query = query
        self.models = search_models(search_query=query)
        self.template =  'feature/search.html'
        self.menu = MenuView(None, None)
        self.models = [ModelView(model, 'list') for model in self.models]

    def render(self):
        return render_template(self.template, menu=self.menu, models=self.models, user=g.user)


