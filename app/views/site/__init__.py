import os
from jinja2 import Template
import simplejson as json
from PIL import Image
from app import app
from flask import render_template, request, g, redirect, jsonify
from app.handlers.editors import NodeEditor
from app.models import Node, NodeFactory
from app.models.content import Content, Post, Comment
from app.models.streams import ActivityStream
from app.utils.search_helper import listing_helper, node_helper
from app.utils import login_required, all_tags
from app.handlers import ActivityView, NodeView, NodeCollectionView, AdventureCollectionView, NodeExtractor, \
    ArticleCollectionView, CompositeNodeCollectionView, EventCollectionView, ProfileCollectionView, ExploreLandingView, \
    CommunityLandingView, EditorView, ProfileView
from app.views.site.menus import view_menu

(MODEL_DETAIL_VIEW, MODEL_LIST_ROW_VIEW, MODEL_LIST_GRID_VIEW, MODEL_LIST_POD_VIEW) = ('detail', 'row', 'grid', 'pod')


@app.route('/write/<model_name>')
@app.route('/write/<model_name>/<model_id>')
@login_required
def editor(model_name, model_id=None):

    from app.views import force_setup_context
    context = force_setup_context({})
    try:
        card = EditorView(model_name, model_id).get_card()
        context['card'] = card
    except Exception, e:
        if e.message == 'Invalid User':
            return 'Not Authorise', 403
        else:
            raise e
    return render_template('site/pages/commons/view.html', **context)

@app.route("/")
def act_home():
    return redirect('/explore')

@app.route("/explore")
def home():
    from app.views import force_setup_context
    context = force_setup_context({})
    card = ExploreLandingView().get_card()
    context['card'] = card
    return render_template('site/pages/commons/view.html', **context)

@app.route("/explore/activity")
def activity_view():
    name = request.args.get('name')
    if name:
        return render_template('site/pages/commons/view.html', card=ActivityView(MODEL_DETAIL_VIEW, name, key='name__iexact').get_card())
    else:
        return 'Not found', 404


@app.route("/explore/adventure")
def list_adventure():
    from app.views import force_setup_context
    query = request.args.get('query', '')
    page = int(request.args.get('page', 1))
    if not query or len(query) is 0:
        query = None
    context = force_setup_context({})
    card = AdventureCollectionView(card_type="grid", query=query, size=20, page=page).get_card(context)
    context['card'] = card
    return render_template('site/pages/commons/view.html', **context)

@app.route('/explore/journal')
def list_journal():
    from app.views import force_setup_context
    query = request.args.get('query', '')
    page = int(request.args.get('page', 1))
    if not query or len(query) is 0:
        query = None
    context = force_setup_context({})
    view = CompositeNodeCollectionView('article', parent_model=None, configs=dict(all=dict(query=query, page=page, card_type='grid', is_partial=True), top=dict(query=query, page=page, card_type='row', is_partial=True), my=dict(query=query, page=page, card_type='row', is_partial=True))).get_card(context)
    context['card'] = view
    return render_template('site/pages/commons/view.html', **context)

@app.route('/community/discussion')
def list_discussion():
    from app.views import force_setup_context
    query = request.args.get('query', '')
    page = int(request.args.get('page', 1))
    if not query or len(query) is 0:
        query = None
    context = force_setup_context({})
    view = CompositeNodeCollectionView('discussion', parent_model=None, configs=dict(featured=dict(card_type='row', query=query, page=page, is_partial=True), latest=dict(card_type='row', query=query, page=page, is_partial=True))).get_card(context)
    context['card'] = view
    return render_template('site/pages/commons/view.html', **context)

@app.route("/community/profile")
def list_profile():
    from app.views import force_setup_context
    query = request.args.get('query', '')
    page = int(request.args.get('page', 1))
    if not query or len(query) is 0:
        query = None
    context = force_setup_context({})
    card = ProfileCollectionView(card_type="row", query=query, size=20, page=page, is_partial=False).get_card(context)
    context['card'] = card
    return render_template('site/pages/commons/view.html', **context)

@app.route("/community/my")
def my_profile():
    from app.views import force_setup_context
    context = force_setup_context({})
    card = ProfileView(MODEL_DETAIL_VIEW, str(g.user.id)).get_card()
    context['card'] = card
    return render_template('site/pages/commons/view.html', **context)


@app.route("/community/event")
def list_event():
    from app.views import force_setup_context
    query = request.args.get('query', '')
    page = int(request.args.get('page', 1))
    if not query or len(query) is 0:
        query = None
    context = force_setup_context({})
    card = EventCollectionView(card_type="row", query=query, size=20, page=page, is_partial=False).get_card(context)
    context['card'] = card
    return render_template('site/pages/commons/view.html', **context)

@app.route("/community")
def community_mail():
    from app.views import force_setup_context
    context = force_setup_context({})
    card = CommunityLandingView().get_card(context)

    context['card'] = card
    return render_template('site/pages/commons/view.html', **context)

@app.route("/views/static")
def static_model_views():
    card_type = request.args.get('card_type', 'detail')
    model_view = request.args.get('model_view', None)
    if not model_view:
        return 'Not Found', 404
    from app.views import env
    template_path = 'site/models/' + model_view + '/' + card_type + ".html"
    template = env.get_template(template_path)
    from app.views import force_setup_context
    context = force_setup_context({})
    view = template.render(**context)
    return render_template("site/layouts/empty_layout.html", view=view)

@app.route("/views/template")
def template_views():
    model_view = request.args.get('model_view', None)
    if not model_view:
        return 'Not Found', 404
    as_list = request.args.get('as_list', False)
    if not as_list:
        node_view, context = node_helper()
        view = node_view.get_card()
    else:
        collection_view, context = listing_helper()
        view = collection_view.get_card()
    context["card"] = view
    return render_template("site/pages/commons/empty_view.html", **context)

@app.route("/listings")
def paged_list():
    collection_view, context = listing_helper()
    context['user'] = g.user if hasattr(g, 'user') and g.user is not None else None
    page = int(context.get('page'))
    return jsonify(status='success', html=collection_view.next_page(page), last_page=collection_view.get_last_page())

@app.route('/options')
def ajax_options():
    model_name = request.args.get('model_name', '')
    attr = request.args.get('attr', None)
    select = request.args.get('select', 0)
    if model_name == 'tag':
        options = [(u[0], u[0]) for u in all_tags()]
    else:
        options = ((str(getattr(u, 'id')), getattr(u, attr)) for u in NodeFactory.get_class_by_name(model_name).objects.all())
    if not select:
        str_to_use = '<option id="%s" value="%s">'
    else:
        str_to_use = '<option value="%s">%s</option>'
    results = (str_to_use % u for u in options)
    return ''.join(results)

@app.route('/buttons')
def ajax_buttons():
    model_name = request.args.get('model_name', '')
    attr = request.args.get('attr', None)
    if model_name == 'tag':
        options = [u[0] for u in all_tags()][:30]
    else:
        options = (getattr(u, attr) for u in NodeFactory.get_class_by_name(model_name).objects.all())
    results = ('<a href="#"> %s </a>' % u for u in options)
    return ''.join(results)


@app.route('/activity/<slug>')
@app.route('/adventure/<slug>')
@app.route('/event/<slug>')
@app.route('/trip/<slug>')
@app.route('/profile/<slug>')
@app.route('/article/<slug>')
@app.route('/blog/<slug>')
@app.route('/discussion/<slug>')
@app.route('/post/<slug>')
def model_view(slug):
    model_type = [u for u in request.path.split('/') if u and len(u) > 0][0]
    view = NodeView.factory(model_type, MODEL_DETAIL_VIEW, '/%s/%s' % (model_type, slug), key='slug__iexact')
    from app.views import force_setup_context
    context = force_setup_context({})
    context['card'] = view.get_card()
    return render_template('site/pages/commons/view.html', **context)


@app.route('/editors/invoke', methods=['POST'])
def edit_invoke():
    try:
        message = request.get_json(force=True)
        editor = NodeEditor.factory(message)
        return editor.invoke()
    except Exception, e:
        return jsonify(dict(status='error', message='Something went wrong', exception=str(e)))