__author__ = 'arshad'

import re
from bson import ObjectId
from app.models import *
from mongoengine import Q


PAGE_SIZE = 25


def search_models(search_query):
    regx = re.compile(search_query, re.IGNORECASE)
    query = {'$or': [{'name': {'$regex': regx}}, {'title': {'$regex': regx}}]}
    return Content.objects(__raw__=query).all()


def get_all_models_all_channels(search_query=None):
    for_channels = ['Destination', 'Activity', 'Article', 'Profile', 'Adventure Trip']
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
        _models = model_class.objects(__raw__=_query).all()[0:8]
        _total = model_class.objects(__raw__=_query).count()
        models[channel.name] = _models, (_total / 8) + 1
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

    total = model_class.objects(__raw__=query).count()
    if paginated:
        start =  (page - 1) * PAGE_SIZE
        end = start + PAGE_SIZE
        models = model_class.objects(__raw__=query).all()[start:end]
    else:
        models = model_class.objects(__raw__=query).all()

    return models, (total / PAGE_SIZE) + 1


def get_by(cls, **kwargs):
    query = []

    if kwargs.get('single', False) and kwargs['single']:
        is_single = True
    else:
        is_single = False
    for k, v in kwargs.iteritems():
        if k != '_and': continue
        query.append({k: v})

    if kwargs.get('_and', False) and kwargs['_and']:
        query = {'$and': query}
    else:
        query = {'$or': query}
    q = cls.__class__.objects(__raw__=query)
    if is_single:
        return q.first()
    else:
        return q.all()

def get_related(model):
    query = {'$and': [{'facets':{'$in': model.facets}}, {'_id': {'$ne': ObjectId(model.id)}}]}
    return model.__class__.objects(__raw__= query ).all()[0:3]
