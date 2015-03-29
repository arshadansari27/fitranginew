from app import app
from flask import render_template, request
from app.models.activity import Activity
from app.views.site.handlers import ActivityView, NodeView, NodeCollectionView
from app.views.site.menus import view_menu

(MODEL_DETAIL_VIEW, MODEL_LIST_ROW_VIEW,
 MODEL_LIST_GRID_VIEW, MODEL_LIST_POD_VIEW) = ('detail',
                                               'row',
                                               'grid',
                                               'pod')


@app.route("/")
def home():
    return render_template("/site/features/home.html")

@app.route("/explore/activity")
def activity_view():
    name = request.args.get('name')
    if name:
        return render_template('site/features/generic_view.html', view=ActivityView(MODEL_DETAIL_VIEW, name, key='name__iexact').get_card())
    else:
        return 'Not found', 404

@app.route("/explore/adventure")
def list_adventure():
    page = int(request.args.get('page', 1))
    if page is 1:
        view = NodeCollectionView("adventure", "grid", {}).get_card()
        return render_template('site/features/explore/adventures.html', view=view)
    else:
        return NodeCollectionView("adventure", "grid", {}, page=page).next_page()

@app.route("/community")
def journal():
    return render_template("/site/features/community/index.html")

@app.route("/listing/page")
def paged_list():
    card_type = request.args.get('card_type', 'detail')
    model_view = request.args.get('model_view', None)
    key = request.args.get('key', None)
    value = request.args.get('value', None)
    page = int(request.args.get('page', 1))
    size = 10
    filters = {}
    if key and value:
        filters[key] = value
    return NodeCollectionView(model_name=model_view, card_type=card_type, filters=filters, paged=True, page=page, size=size).next_page(page)

@app.route("/views/static")
def static_model_views():
    card_type = request.args.get('card_type', 'detail')
    model_view = request.args.get('model_view', None)
    if not model_view:
        return 'Not Found', 404
    from app.views import env
    template_path = 'site/models/' + model_view + '/' + card_type + ".html"
    template = env.get_template(template_path)
    context = {}
    view = template.render(**context)
    return render_template("site/empty_layout.html", view=view)

@app.route("/views/template")
def template_views():
    card_type = request.args.get('card_type', 'detail')
    model_view = request.args.get('model_view', None)
    if not model_view:
        return 'Not Found', 404
    as_list = request.args.get('as_list', False)
    if not as_list:
        key = request.args.get('key', 'pk')
        value = request.args.get('value', '')
        node_view = NodeView.factory(model_view)
        context=dict(card_type=card_type, id=value, key=key)
        view = node_view(**context).get_card()
    else:
        key = request.args.get('key', None)
        value = request.args.get('value', None)
        page = int(request.args.get('page', 1))
        size = 10
        filters = {}
        if key and value:
            filters[key] = value
        if page:
            paged = True
        else:
            paged = False

        context = dict(model_name=model_view, card_type=card_type, filters=filters, paged=paged, page=page, size=size)
        view = NodeCollectionView(**context).get_card()

    return render_template("site/empty_layout.html", view=view, **context)
