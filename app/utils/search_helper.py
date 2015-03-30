
__author__ = 'arshad'

from flask import request


def listing_helper():
    from app.views.site import NodeCollectionView
    card_type = request.args.get('card_type', 'detail')
    model_view = request.args.get('model_view', None)
    page = int(request.args.get('page', 1))
    size = int(request.args.get('size', 10))
    search_query = request.args.get('query', None)
    filters = {}
    if search_query is not None and len(search_query) > 0:
        query_list = search_query.split(';') if ';' in search_query else [search_query]
        for q in query_list:
            key, value = q.split(":")
            filters[key] = value
    context = dict(model_name=model_view, card_type=card_type, filters=filters, page=page, size=size, search_query=search_query)
    collection_view = NodeCollectionView(model_view, card_type, filters=filters, paged=True, page=page, size=size)
    return collection_view, context


def node_helper():
    from app.views.site import NodeView
    card_type = request.args.get('card_type', 'detail')
    model_view = request.args.get('model_view', None)
    key = request.args.get('key', 'pk')
    value = request.args.get('value', '')
    node_view = NodeView.factory(model_view)
    context=dict(card_type=card_type, id=value, key=key)
    return node_view(**context), context

