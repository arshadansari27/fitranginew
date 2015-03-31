from app import app
from flask import render_template, request
from app.models.activity import Activity
from app.utils.search_helper import listing_helper, node_helper
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
    view = NodeCollectionView("adventure", "grid", {}, paged=True, size=20, page=1).get_card()
    return render_template('site/features/explore/adventures.html', view=view)

@app.route("/community")
def journal():
    return render_template("/site/features/community/index.html")

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
    model_view = request.args.get('model_view', None)
    layout = request.args.get('layout', 'empty_layout')
    if not model_view:
        return 'Not Found', 404
    as_list = request.args.get('as_list', False)
    if not as_list:
        node_view, context = node_helper()
        view = node_view.get_card()
    else:
        collection_view, context = listing_helper()
        view = collection_view.get_card()

    return render_template("site/layouts/%s.html" % layout, view=view, **context)

@app.route("/listing/page")
def paged_list():
    collection_view, context = listing_helper()
    return collection_view.next_page(context.get('page'))

