from bson import ObjectId
from mongoengine import Q
from app.models import ACTIVITY, ADVENTURE, TRIP, EVENT, PROFILE, ARTICLE, POST, DISCUSSION, STREAM, RELATIONSHIPS, \
    PROFILE_TYPE, ADVERTISEMENT, CHANNEL, NodeFactory, CONTEST, CAMPSITE, GEAR
from app.models.streams import ActivityStream
from app.models.activity import Activity
from app.models.adventure import Adventure
from app.models.content import Article, Post, Discussion, Advertisement, Channel, Content
from app.models.event import Event
from app.models.profile import Profile, ProfileType
from app.models.relationships import RelationShips
from app.models.trip import Trip
from app.utils import convert_query_to_filter

__author__ = 'arshad'

import json, datetime

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)


class NodeExtractor(object):


    def __init__(self, model_name, init_filters={}, sorter_default={}):
        self.model_class = NodeFactory.get_class_by_name(model_name)
        self.init_filters = init_filters
        self.sorter_default = sorter_default

    def get_list(self, query, paged, page, size, sort=None):
        query_set = self.get_query(query, sort=sort)
        if paged:
            page = int(page)
            size = int(size)
            start = (page - 1) * size
            end = start + size
            models = query_set.all()[start: end]
        else:
            models = query_set.all()
        if models and len(models) > 0:
            models = [u for u in list(models)]
            for u in models:
                if hasattr(u, 'on_get') and callable(u.on_get):
                    u.on_get()
        return models

    def get_single(self, query):
        return self.get_query(query).first()

    def last_page(self, query, size, sort=None):
        query_set = self.get_query(query, sort=sort)
        count = query_set.count()
        page = (count / int(size)) + 1
        return page

    def default_sorter(self):
        return self.sorter_default if hasattr(self, 'sorter_default') and self.sorter_default else None

    def get_query(self, query, sort=None):
        use_filters = convert_query_to_filter(query)
        default_sorters = self.default_sorter()
        if sort or (default_sorters and len(default_sorters) > 0):
            sorters = convert_query_to_filter(sort)
            if not sorters:
                sorters = {}
            if default_sorters and len(default_sorters) > 0:
                for k, v in default_sorters.iteritems():
                    if sorters.has_key(k):
                        continue
                    sorters[k] = v
        else:
            sorters = {}
        filters = dict((u, v) for u, v in self.init_filters.iteritems())
        # print 'Pre', self.model_class.__name__, use_filters, sorters, filters
        merge = []
        if len(use_filters) > 0:
            filters = {}
            for k, v in use_filters.iteritems():
                if not isinstance(v, str) and not isinstance(v, unicode):
                    filters[k] = v
                    continue
                elif '|' in v:
                    u = v.split('|')
                    if u[0] == 'bool':
                        v = True if u[1].strip() in ('True', '1', 1) else False
                    elif u[0] == 'int':
                        v = int(u[1])
                    elif u[0] == 'float':
                        v = float(u[1])
                    else:
                        v = str(u[1])

                if k.startswith('relationship'):
                    fields = k.split('__')
                    assert len(fields) >= 3
                    relationship = fields[1]
                    from_node_type = fields[2]
                    if len(fields) is 4:
                        qry = fields[3]
                    elif len(fields) is 5:
                        qry = fields[3] + '__' + fields[4]
                    else:
                        qry = 'pk'
                    from_node = NodeExtractor.factory(from_node_type).get_single('%s:%s' % (qry, v))
                    nodes = RelationShips.get_by_query(from_node, relationship)
                    filters['id__in'] = [u.id for u in nodes if u is not None and hasattr(u, 'id')]
                elif '__' in k:
                    fields = k.split('__')
                    if len(fields) >= 3:
                        __node = NodeExtractor.factory(fields[1]).get_single('%s:%s' % (fields[2], str(v)))
                        if len(fields) == 4:
                            f = "%s__%s" % (fields[0], fields[3])
                        else:
                            f = fields[0]
                        filters[f] =  __node
                    elif len(fields) == 2 and fields[1] == 'in':
                        _values = [u.strip() for u in v.split(',') if u and u.strip() and len(u.strip()) > 0]
                        filters[k] = _values
                        merge.append(fields[0])
                    else:
                        if 'date' in k:
                            yy, mm, dd = v.split('-')
                            filters[k] = datetime.datetime(int(yy), int(mm), int(dd))
                        else:
                            filters[k] = v
                else:
                    filters[k] = v

            if len(merge) > 0:
                to_add = []
                for m in merge:
                    if not filters.has_key(m):
                        continue
                    for k in filters.keys():
                        if k.startswith(m) and k.endswith('in'):
                            to_add.append((m, k, filters[m]))
                if len(to_add) > 0:
                    for m, k, v in to_add:
                        del filters[m]
                        filters[k].append(v)
        _order_by = []
        if sorters and len(sorters) > 0:
            if sorters.has_key('location_lat') and sorters.has_key('location_lng'):
                # print 'Sorting by location', str([(u, v) for u, v in sorters.iteritems() if u.startswith('location')])
                if sorters.has_key('location_locality') and len(sorters['location_locality']) > 0:
                    filters['city__iexact'] = sorters['location_locality']
                elif sorters.has_key('location_region2') and len(sorters['location_region2']) > 0:
                    filters['region__iexact'] = sorters['location_region2']
                elif sorters.has_key('location_region1') and len(sorters['location_region1']) > 0:
                    filters['state__iexact'] = sorters['location_region1']
                elif sorters.has_key('location_country') and len(sorters['location_country']) > 0:
                    filters['country__iexact'] = sorters['location_country']
                else:
                    filters['geo_location__near'] = {"type": "Point", "coordinates": [float(sorters['location_lat']), float(sorters['location_lng'])]}
                    max_distance = 50000
                    filters['geo_location__max_distance'] = max_distance

            for sorter_key, sorter_value in sorters.iteritems():
                if sorter_key.startswith('location'):
                    continue
                _order_by.append("%s%s" % (("-" if sorter_value == "high" else ""), sorter_key))

        if Content in self.model_class.__bases__ or Adventure == self.model_class:
            order_by = '-modified_timestamp'
        else:
            order_by = '-created_timestamp'
        order_by =  ','.join(_order_by) + ',' + order_by
        criteria = None
        for k, v in filters.iteritems():
            d = {k: v}
            if criteria is None:
                criteria = Q(**d)
            else:
                criteria &= Q(**d)
        # print '[*] Filters and Sort: ', filters, order_by
        return self.model_class.objects(criteria).order_by(*order_by.split(',') if ',' in order_by else order_by)


    @classmethod
    def factory(cls, model_name):
        if type(model_name) == type:
            model_name = model_name.__name__
        model_name = model_name.lower().strip()
        if model_name == ACTIVITY:
            return activity_extractor
        elif model_name == ADVENTURE:
            return adventure_extractor
        elif model_name == TRIP:
            return trip_extractor
        elif model_name == EVENT:
            return event_extractor
        elif model_name == PROFILE:
            return profile_extractor
        elif model_name == ARTICLE:
            return article_extractor
        elif model_name == POST:
            return post_extractor
        elif model_name == DISCUSSION:
            return discussion_extractor
        elif model_name == STREAM:
            return stream_extractor
        elif model_name == RELATIONSHIPS:
            return relationship_extractor
        elif model_name == PROFILE_TYPE:
            return profile_type_extractor
        elif model_name == ADVERTISEMENT:
            return advertisement_extractor
        elif model_name == CHANNEL:
            return channel_extractor
        elif model_name == CONTEST:
            return contest_extractor
        elif model_name == CAMPSITE:
            return campsite_extractor
        elif model_name == GEAR:
            return gear_extractor
        else:
            raise Exception("Invalid model name for extractor")

stream_extractor = NodeExtractor(STREAM)
activity_extractor = NodeExtractor(ACTIVITY)
advertisement_extractor = NodeExtractor(ADVERTISEMENT, init_filters=dict(is_specific__in=[None, False]))
channel_extractor = NodeExtractor(CHANNEL)
profile_type_extractor = NodeExtractor(PROFILE_TYPE)
article_extractor = NodeExtractor(ARTICLE)
discussion_extractor = NodeExtractor(DISCUSSION)
post_extractor = NodeExtractor(POST)
adventure_extractor = NodeExtractor(ADVENTURE)
event_extractor = NodeExtractor(EVENT)
trip_extractor = NodeExtractor(TRIP, sorter_default=dict(start_date='low'))
profile_extractor = NodeExtractor(PROFILE, init_filters=dict(type__ne=ProfileType.objects(name__iexact='Subscription Only').first()))
all_profile_extractor = NodeExtractor(PROFILE)
relationship_extractor = NodeExtractor(RELATIONSHIPS)
contest_extractor = NodeExtractor(CONTEST)
campsite_extractor = NodeExtractor(CAMPSITE)
gear_extractor = NodeExtractor(GEAR)
