__author__ = 'arshad'

from flask import g
from app.handlers.views import env

class FacetView(object):

    def __init__(self, facets, channel, subchannel, template=None):
        if template is None:
            self.template = 'generic/main/facets.html'
        else:
            self.template = template
        self.facets = facets
        self.channel = channel
        self.subchannel = subchannel

    def render(self):
        template = env.get_template(self.template)
        return template.render(facet=self.facets, channel=self.channel, subchannel=self.subchannel, user=g.user)

