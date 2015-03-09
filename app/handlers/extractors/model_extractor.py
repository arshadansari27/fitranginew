__author__ = 'arshad'

import re
from bson import ObjectId
from app.models import *
from mongoengine import Q


PAGE_SIZE = 25


def get_facets_by_query(channel, search_query=None) :
    collection = Content._get_collection()
    if search_query:
        regx = re.compile(search_query, re.IGNORECASE)
        match = {"$match": {"channels": {"$in": [channel.name]}, "$or": [{"title": {'$regex': regx}}, {"name": {'$regex': regx}}]}}
    else:
        match = {"$match": {"channels": {"$in": [channel.name]}}}
    results = collection.aggregate([match, {"$unwind": "$facets"},{"$group": {"_id": "$facets", "count": {"$sum": 1}}}])
    data = [r['_id'] for r in results['result'] if r['_id'] != channel.name and r['count'] > 0]
    return [Facet.get_facet_by_name(d) for d in data]


def get_all_models(channel, facets=[], search_query=None, page=1, paginated=True, limit=None, user=None, owned=False, admin_published=True, published=True):
    if channel and isinstance(channel, Channel):
        channel_name = channel.name
    else:
        channel_name = channel
    if channel is not None:
            model_class = Node.model_factory(channel_name)
    else:
        model_class = Content

    if channel and len(facets) > 0:
        query = {'$and': [{'channels': channel_name}, {'facets': {'$in': facets}}]}
    elif channel:
        query = {'channels': channel_name}
    else:
        query = {}

    if search_query:
        regx = re.compile(search_query, re.IGNORECASE)
        if model_class == Profile:
            query['name']= {'$regex': regx}
        else:
            query['title']= {'$regex': regx}

    if admin_published is not None:
        if admin_published:
            query['admin_published'] = True
        else:
            query['admin_published'] = False

    if published is not None:
        if published:
            query['published'] = True
        else:
            query['published'] = False

    if owned and user and 'Admin' not in user.roles:
        query['created_by']  = user.id
    total = model_class.objects(__raw__=query).count()
    if limit:
        models = model_class.objects(__raw__=query).order_by('-created_timestamp').all()[:limit]
    elif paginated:
        start =  (page - 1) * PAGE_SIZE
        end = start + PAGE_SIZE
        models = model_class.objects(__raw__=query).order_by('-created_timestamp').all()[start:end]
    else:
        models = model_class.objects(__raw__=query).order_by('-created_timestamp').all()

    return models, total

def get_related(model):
    query = {'$and': [{'facets':{'$in': model.facets}}, {'_id': {'$ne': ObjectId(model.id)}}]}
    return model.__class__.objects(__raw__= query ).order_by('-created_timestamp').all()[0:3]
