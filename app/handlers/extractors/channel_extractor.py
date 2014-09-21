__author__ = 'arshad'

from app.models import *


def get_all_facets(channel_name):
    channel = Channel.getByName(channel_name)
    if channel:
        facets = {}
        for f in channel.facets:
            _facets = Facet.get_facet_by_type(f)
            facets[f] = _facets
        return channel, facets
    else:
        return channel, []

