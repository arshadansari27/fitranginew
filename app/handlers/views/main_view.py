__author__ = 'arshad'

from flask import render_template, g

from app.models.models import Advertisement
from app.handlers.extractors import search_models, get_models_by
from app.handlers.views.menu_view import MenuView
from app.handlers.views.model_view import ModelView
from app.handlers.views.ad_view import AdView
from app import cache
import requests, simplejson as json, random


class HomeView(object):
    def __init__(self, query):
        self.query = query
        self.template =  'feature/home.html'
        self.menu = MenuView(None)
        self.destinations = [ModelView(m, 'list') for m in get_models_by('Destination', limit=6)]
        self.organizers = [ModelView(m, 'list') for m in get_models_by('Profile', ['Organizer'], limit=6)]
        self.articles = [ModelView(m, 'list', default='list') for m in get_models_by('Article', limit=4)]
        self.banner_articles = []
        self.banner_articles.extend([ModelView(m, 'list', default='banner') for m in get_models_by('Article', facets=['Top 5 Series'], limit=1)])
        self.banner_articles.extend([ModelView(m, 'list', default='banner') for m in get_models_by('Article', facets=['Explore'], limit=1)])
        self.banner_articles.extend([ModelView(m, 'list', default='banner') for m in get_models_by('Article', facets=['Informative'], limit=1)])
        self.adventure_trips = [ModelView(m, 'list') for m in get_models_by('Event', limit=8)]

    def render(self):
        _adverts = Advertisement.get_home_advertisements()
        adverts = [AdView('list', a) for a in _adverts]

        footer = Advertisement.get_home_footer_advertisement()
        if footer:
            footer_add = AdView('list', footer)
        else:
            footer_add = None
        return render_template(self.template, menu=self.menu, banner_articles=self.banner_articles, articles=self.articles, destinations=self.destinations, organizers=self.organizers,  adventure_trips=self.adventure_trips, user=g.user, yt_links=get_youtube_links(), adverts=adverts, footer_advert=footer_add)

class SearchView(object):

    def __init__(self, query):
        self.query = query
        self.models = search_models(search_query=query)
        self.template =  'feature/search.html'
        self.menu = MenuView(None)
        self.model_group = {}
        for m in self.models:
            if len(m.channels) > 0:
                self.model_group.setdefault(m.channels[0], [])
                self.model_group[m.channels[0]].append(ModelView(m, 'list'))

    def render(self):
        return render_template(self.template, menu=self.menu, model_groups=self.model_group, user=g.user)


@cache.cached(timeout=3600)
def get_youtube_links():
    try:
        j_video = json.loads(requests.get("http://gdata.youtube.com/feeds/api/videos?max-results=4&alt=json&orderby=published&author=FitRangi").content)
        youtube_links = []
        for e in j_video['feed']['entry']:
            link = e['id']['$t'].split('/')[-1]
            if link and len(link) > 0:
                youtube_links.append(link)
        return youtube_links
    except:
        return ''
