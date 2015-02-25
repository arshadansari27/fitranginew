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

def get_models_by_only_single(channel_name, facet, page=1, paginated=True, limit=None):
    model_class = Node.model_factory(channel_name)

    if channel_name and facet:
        query = {'$and': [{'channels': channel_name}, {'facets': {'$all': [facet]}}]}
    else:
        raise Exception('Invalid facet')
    total = model_class.objects(__raw__=query).order_by('-created_timestamp').count()
    if limit:
        models = model_class.objects(__raw__=query).order_by('-created_timestamp').all()[:limit]
    elif paginated:
        start =  (page - 1) * PAGE_SIZE
        end = start + PAGE_SIZE
        models = model_class.objects(__raw__=query).order_by('-created_timestamp').all()[start:end]
    else:
        models = model_class.objects(__raw__=query).order_by('-created_timestamp').all()
    return models, total

def get_models_by(channel_name, facets=[], facets_to_avoid=[], page=1, paginated=True, limit=None):
    model_class = Node.model_factory(channel_name)

    if channel_name and len(facets) > 0:
        if facets_to_avoid and len(facets_to_avoid) > 0:
            query = {'$and': [{'channels': channel_name}, {'facets': {'$in': facets}}, {'facets': {'$nin': facets_to_avoid}}]}
        else:
            query = {'$and': [{'channels': channel_name}, {'facets': {'$in': facets}}]}
    else:
        if facets_to_avoid and len(facets_to_avoid) > 0:
            query = {'$and': [{'channels': channel_name}, {'facets': {'$nin': facets_to_avoid}}]}
        else:
            query = {'channels': channel_name}

    if limit:
        models = model_class.objects(__raw__=query).order_by('-created_timestamp').all()[:limit]
    elif paginated:
        start =  (page - 1) * PAGE_SIZE
        end = start + PAGE_SIZE
        models = model_class.objects(__raw__=query).order_by('-created_timestamp').all()[start:end]
    else:
        models = model_class.objects(__raw__=query).order_by('-created_timestamp').all()
    return models

def get_all_models(channel, facets=[], search_query=None, page=1, paginated=True, limit=None, user=None):
    model_class = Node.model_factory(channel.name)

    if channel and len(facets) > 0:
        query = {'$and': [{'channels': channel.name}, {'facets': {'$in': facets}}]}
    else:
        query = {'channels': channel.name}
    if search_query:
        regx = re.compile(search_query, re.IGNORECASE)
        if model_class == Profile:
            query['name']= {'$regex': regx}
        else:
            query['title']= {'$regex': regx}

    if channel.name == 'Forum':
        query['published'] = True
    if user and 'Admin' not in user.roles:
        query['created_by']  = user.id
    total = model_class.objects(__raw__=query).count()
    if limit:
        models = model_class.objects(__raw__=query).all()[:limit]
    elif paginated:
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


def get_content_list(channel, user, not_in=False, page=1, search=None, path=None):
    page = int(page)

    query = {}
    if path is None:
        path = '/manage/%s/' % channel
    p = path + "?page=%d"
    if search:
        p += '&query=' + search
    if not_in:
        if search:
            query = dict(channels__in=[channel], title__icontains=search)
        else:
            query = dict(channels__nin=[channel])
    else:
        if search:
            query = dict(channels__in=[channel], title__icontains=search)
        else:
            query = dict(channels__in=[channel])
    if 'Admin' not in user.roles:
        query['created_by'] = user
    total = query.count()

    s =  (page - 1) * PAGE_SIZE
    e = s + PAGE_SIZE
    if s == 0:
        prev = None
    else:
        prev= p % (page - 1)
    if e >= total:
        next = None
    else:
        next = p % (page + 1)
    contents = query.all()[s: e]
    return contents, total, prev, next
