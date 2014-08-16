from app.models import *
from Queue import Queue

PAGE_SIZE = 25

def get_all_facets(channel_name):
    print 'Get all facets', channel_name
    channel = Channel.getByName(channel_name)
    if channel:
        print 'Got all facets', channel.name
        return channel, channel.subtypes, channel.facets
    else:
        return channel, [], []


def get_all_models_all_channels(search_query=None):
    for_channels = ['Destination', 'Activity', 'General Articles', 'Profile']
    channels = filter(lambda c: c.name in for_channels, Channel.all_data())
    print '*' * 100, '\n', 'Channels for home page', [c.name for c in channels]
    print search_query
    print '*' * 100
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
            import re
            regx = re.compile("%s" % search_query, re.IGNORECASE)
            query['value'] = regx

        print search_query 
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
        print _query
        coll = model_class._get_collection()
        total = coll.find(_query).count()
        cursor = coll.find(_query).limit(8)
        model_ids = []
        for c in cursor:
            model_ids.append(c['_id'])
        models[channel.name] = [model_class.objects(pk=str(v)).first() for v in model_ids], (total / 8) + 1
        print '*' * 80, '\n', channel.name, model_class
        print '\n'.join([str(m) for m in models[channel.name][0]])
    return models


def get_all_models(channel, sub_channel=None, facets=[], search_query=None, page=1, paginated=True):
    model_name = channel.model
    model_class = Node.model_factory(model_name.lower().strip())
    if len(facets) > 0:
        query = {'channels': {'$in': [c for c in facets]}}
    else:
        facets_check = {}
        if channel:
            facets_check = {'channels': channel.name}
        if sub_channel:
            facets_check = {'channels': sub_channel}
        if search_query:
            if model_class == Profile:
                _query = {'name': search_query} 
            else:
                _query = {'title': search_query} 
                if model_class == Content:
                    keywords = search_query.split(' ')
                    _query['keywords'] = {'$in': keywords}
        else:
            _query = {}
        if len(facets_check) > 0 and len(_query) > 0:
            query = {'$and': [facets_check, _query]}
        elif len(facets_check) > 0:
            query = facets_check
        else:
            query = _query

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
    print query
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
