__author__ = 'arshad'

from flask import g

from app.handlers.views import env
from app.models import Facet
from app.utils import arrange_facets


class FacetView(object):

    def __init__(self, facets, channel, models, template=None):
        if template is None:
            self.template = 'generic/main/facets.html'
        else:
            self.template = template
        facets = []
        for m in models:
            facets.extend([Facet.get_facet_by_name(v) for v in m.facets if Facet.get_facet_by_name(v)])
        self.facets = {} if len(facets) is 0 else arrange_facets(facets)
        self.channel = channel

    def render(self):
        template = env.get_template(self.template)
        return template.render(facet=self.facets, channel=self.channel, user=g.user)

