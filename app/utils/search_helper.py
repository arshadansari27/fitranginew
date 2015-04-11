
__author__ = 'arshad'

from flask import request


def listing_helper():
    from app.views.site import NodeCollectionView
    from app.views import force_setup_context
    from app.views.site import MODEL_DETAIL_VIEW
    card_type = request.args.get('card_type', MODEL_DETAIL_VIEW)
    model_view = request.args.get('model_view', None)
    page = int(request.args.get('page', 1))
    size = int(request.args.get('size', 10))
    search_query = request.args.get('query', None)
    context = dict(model_name=model_view, card_type=card_type, page=page, size=size, search_query=search_query)
    context = force_setup_context(context)
    collection_view = NodeCollectionView.factory(model_view, card_type, query=search_query, page=page, size=size, is_partial=True, only_list=False, category='all')
    return collection_view, context


def node_helper():
    from app.views import force_setup_context
    from app.views.site import MODEL_DETAIL_VIEW
    from app.views.site import NodeView
    card_type = request.args.get('card_type', MODEL_DETAIL_VIEW)
    model_view = request.args.get('model_view', None)
    key = request.args.get('key', 'pk')
    value = request.args.get('value', '')
    node_view = NodeView.factory(model_view, card_type, id=value, key=key)
    context=dict(card_type=card_type, id=value, key=key)
    context = force_setup_context(context)
    return node_view, context

