__author__ = 'arshad'

from flask import render_template, g

from app.models.models import Advertisement, Channel
from app.handlers.extractors import get_all_models
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
        self.destinations = [ModelView(m, 'list') for m in get_all_models(Channel.getByName('Destination'), [], limit=6)[0]]
        self.organizers = [ModelView(m, 'list') for m in get_all_models(Channel.getByName('Profile'), ['Organizer'], limit=6)[0]]
        self.articles = [ModelView(m, 'list', default='list') for m in get_all_models(Channel.getByName('Article'), [], limit=4)[0]]
        self.banner_articles = []
        self.banner_articles.extend([ModelView(m, 'list', default='banner') for m in get_all_models(Channel.getByName('Article'), facets=['Top 5 Series'], limit=1)[0]])
        self.banner_articles.extend([ModelView(m, 'list', default='banner') for m in get_all_models(Channel.getByName('Article'), facets=['Explore'], limit=1)[0]])
        self.banner_articles.extend([ModelView(m, 'list', default='banner') for m in get_all_models(Channel.getByName('Article'), facets=['Informative'], limit=1)[0]])
        self.adventure_trips = [ModelView(m, 'list') for m in get_all_models(Channel.getByName('Event'), [], limit=8)[0]]

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
        channels = [c for c in Channel.get_all_names() if c != 'Stream']
        self.models = []
        for c in channels:
            models = get_all_models(c, [], search_query=query, limit=8)
            if models and len(models) > 0:
                self.models.extend(models)

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
