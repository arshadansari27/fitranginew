__author__ = 'arshad'

import re

from app.models import *


PAGE_SIZE = 25


def search_models(search_query):
    collection = Content._get_collection()
    regx = re.compile(search_query, re.IGNORECASE)
    query = {'$or': [{'name': {'$regex': regx}}, {'title': {'$regex': regx}}]}
    criteria = {'_id': 1}
    models = list(collection.find(query, criteria))
    models = [Content.objects(pk=str(m['_id'])).first() for m in models]
    return models


def get_all_models_all_channels(search_query=None):
    for_channels = ['Destination', 'Activity', 'Article', 'Profile']
    print [c.name for c in Channel.all_data]
    channels = filter(lambda c: c.name in for_channels, Channel.all_data)
    models = {}
    for channel in channels:
        print channel
        query = {}
        model_class = Node.model_factory(channel.name)
        if search_query:
            query = {'head': None, 'value': None}
            if channel.name in ['Profile']:
                query['head'] = 'name'
            else:
                query['head'] = 'title'
            regx = re.compile("%s" % search_query, re.IGNORECASE)
            query['value'] = regx

        queries = []
        if len(query) > 0:
            queries.append({query['head']: query['value']})
        if len(queries) > 1:
            search = {'$or': queries}
        else:
            search = {}
        channel_search = {'channels': channel.name}
        _query = {'$and': [channel_search, search]}
        coll = model_class._get_collection()
        total = coll.find(_query).count()
        cursor = coll.find(_query).limit(8)
        model_ids = []
        for c in cursor:
            model_ids.append(c['_id'])
        models[channel.name] = [model_class.objects(pk=str(v)).first() for v in model_ids], (total / 8) + 1
    return models


def get_all_models(channel, facets=[], search_query=None, page=1, paginated=True):
    model_class = Node.model_factory(channel.name)

    if search_query:
        if model_class == Profile:
            query = {'name': search_query}
        else:
            query = {'title': search_query}
    else:
        if channel and len(facets) > 0:
            query = {'$and': [{'channels': channel.name}, {'facets': {'$in': facets}}]}
        else:
            query = {'channels': channel.name}
        print '*' * 100
        print query
        print '*' * 100

    coll = model_class._get_collection()
    total = coll.find(query).count()
    if paginated:
        cursor = coll.find(query).skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE)
    else:
        cursor = coll.find(query)

    model_ids = []
    for c in cursor:
        model_ids.append(c['_id'])
    return [model_class.objects(pk=str(v)).first() for v in model_ids], (total / PAGE_SIZE) + 1


def get_by(cls, **kwargs): #, _and=True, single=False):
    query = []
    for k, v in kwargs.iteritems():
        query.append({k: v})

    if kwargs.get('_and', False) and kwargs['_and']:
        query = {'$and': query}
    else:
        query = {'$or': query}
    coll = cls._get_collection()
    cursor = coll.find(query)
    objs = []
    for c in cursor:
        o = cls()
        for _k, _v in c.iteritems():
            setattr(o, _k, _v)
        if kwargs.get('single', False) and kwargs['single']:
            return o
        else:
            objs.append(o)

    return objs