__author__ = 'arshad'

from app.models import *
import re

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
    for_channels = ['Destination', 'Activity', 'General Articles', 'Profile']
    channels = filter(lambda c: c.name in for_channels, Channel.all_data())
    models = {}
    for channel in channels:
        model_name = channel.model
        if not model_name:
            continue

        model_class = Node.model_factory(model_name.lower().strip())
        query = {}
        if search_query:
            query = {'head': None, 'keywords': False, 'value': []}
            if model_class in [Profile, Channel]:
                query['head'] = 'name'
                if model_class == Profile:
                    query['keywords'] = True
            else:
                query['head'] = 'title'
                if model_class == Content:
                    query['keywords'] = True
            regx = re.compile("%s" % search_query, re.IGNORECASE)
            query['value'] = regx

        queries = []
        if len(query) > 0:
            queries.append({query['head']: query['value']})
            if query['keywords']:
                queries.append({'keywords': {'$in': query['value'].split(' ')}})
        if len(queries) > 0:
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


def get_all_models(channel, subchannel=None, facets=[], search_query=None, page=1, paginated=True):
    model_name = channel.model
    model_class = Node.model_factory(model_name.lower().strip())


    if search_query:
        if model_class == Profile:
            query = {'name': search_query}
        else:
            query = {'title': search_query}
            if model_class == Content:
                keywords = search_query.split(' ')
                query['keywords'] = {'$in': keywords}
    else:
        if channel and subchannel and len(facets) > 0:
            query = {'$and': [{'channels': channel.name}, {'channels': subchannel}, {'channels': {'$in': facets}}]}
        if channel and len(facets) > 0:
            query = {'$and': [{'channels': channel.name}, {'channels': {'$in': facets}}]}
        elif channel and subchannel:
            query = {'$and': [{'channels': channel.name}, {'channels': subchannel}]}
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