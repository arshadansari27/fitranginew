import os, random
from jinja2 import Template
import simplejson as json
from PIL import Image
from app import app
from flask import render_template, request, g, redirect, jsonify, url_for
from app.handlers.editors import NodeEditor
from app.handlers import NodeCollectionFactory, NodeExtractor
from app.models import Node, NodeFactory, ACTIVITY, ADVENTURE, ARTICLE, DISCUSSION, PROFILE, EVENT, TRIP
from app.utils.search_helper import listing_helper, node_helper
from app.utils import login_required, all_tags, convert_query_to_filter
from app.handlers import  EditorView, NodeView, Page, CollectionView, PageManager
from app.handlers import (activity_extractor, adventure_extractor, article_extractor, discussion_extractor,
                            profile_extractor, event_extractor, trip_extractor)
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
    title, card, context = PageManager.get_landing_title_and_page('explore', user=g.user if hasattr(g, 'user') else None)
    context['title'] = title
    context['card'] = card
    return render_template('site/pages/commons/view.html', **context)

@app.route('/about')
def about():
    title, card, context = PageManager.get_landing_title_and_page('about', user=g.user if hasattr(g, 'user') else None)
    context['title'] = title
    context['card'] = card
    return render_template('site/pages/commons/view.html', **context)

@app.route("/community")
def community_mail():
    title, card, context = PageManager.get_landing_title_and_page('community', user=g.user if hasattr(g, 'user') else None)
    context['title'] = title
    context['card'] = card
    return render_template('site/pages/commons/view.html', **context)

@app.route("/explore/activity")
def activity_view():
    name = request.args.get('name')
    if name:
        title, card, context = PageManager.get_detail_title_and_page(ACTIVITY, query="name__iexact:%s;" % name)
        context['title'] = title
        context['card'] = card
        return render_template('site/pages/commons/view.html', **context)
    else:
        return 'Not found', 404

@app.route("/explore/adventure")
def list_adventure():
    query = request.args.get('query', '')
    if not query or len(query) is 0:
        query = None
    title, card, context = PageManager.get_search_title_and_page(ADVENTURE, query=query)
    context['title'] = title
    context['card'] = card
    return render_template('site/pages/commons/view.html', **context)

@app.route('/explore/journal')
def list_journal():
    query = request.args.get('query', '')
    if not query or len(query) is 0:
        query = None
    title, card, context = PageManager.get_search_title_and_page(ARTICLE, query=query)
    context['title'] = 'Articles and Blogs @ Fitrangi'
    context['card'] = card
    return render_template('site/pages/commons/view.html', **context)

@app.route('/community/discussion')
def list_discussion():
    from app.views import force_setup_context
    query = request.args.get('query', '')
    if not query or len(query) is 0:
        query = None
    title, card, context = PageManager.get_search_title_and_page(DISCUSSION, query=query)
    context['card'] = card
    context['title'] = 'Discussion @ Fitrangi'
    return render_template('site/pages/commons/view.html', **context)

@app.route("/community/profile")
def list_profile():
    query = request.args.get('query', '')
    if not query or len(query) is 0:
        query = None
    title, card, context = PageManager.get_search_title_and_page(PROFILE, query=query)
    context['card'] = card
    context['title'] = 'Profile Finder'
    return render_template('site/pages/commons/view.html', **context)

@app.route("/community/my")
def my_profile():
    if not hasattr(g, 'user') or g.user is None:
        return redirect(url_for('community_mail'))
    title, card, context = PageManager.get_detail_title_and_page(PROFILE, query='pk:%s;' % g.user.id)
    context['card'] = card
    context['title'] = title if title and len(title) > 0 else "Fitrangi: India's complete adventure portal"
    return render_template('site/pages/commons/view.html', **context)

@app.route("/community/event")
def list_event():
    query = request.args.get('query', '')
    if not query or len(query) is 0:
        query = None
    title, card, context = PageManager.get_search_title_and_page(EVENT, query=query)
    context['title'] = title
    context['card'] = card
    return render_template('site/pages/commons/view.html', **context)

@app.route("/trip")
def list_trip():
    query = request.args.get('query', '')
    if not query or len(query) is 0:
        query = None
    title, card, context = PageManager.get_search_title_and_page(TRIP, query=query)
    context['title'] = title
    context['card'] = card
    return render_template('site/pages/commons/view.html', **context)

@app.route("/listings")
def paged_list():
    query       = request.args.get('query', None)
    size        = request.args.get('size', 12)
    page        = request.args.get('page', 1)
    model       = request.args.get('model_view', None)
    card_type   = request.args.get('card_type', None)
    category    = request.args.get('category', 'all')
    context = {}
    extractor = NodeExtractor.factory(model)
    models = extractor.get_list(query, True, page, size)
    html = NodeCollectionFactory.resolve(model, card_type, category, fixed_size=size).only_list(models)
    context['user'] = g.user if hasattr(g, 'user') and g.user is not None else None
    last_page=extractor.last_page(query, size)
    err_html = '<div class="jumbotron"><h6>No data available for this category</h6></div>'
    if page is 1 and page is last_page and len(html) is 0:
        html = err_html
    return jsonify(status='success', html=html, last_page=last_page)

@app.route('/notifications-count')
def get_notifications_count():
    if hasattr(g, 'user') and g.user:
        return jsonify(dict(public_activity_count=g.user.public_activity_count, private_activity_count=g.user.private_activity_count))

@app.route('/options')
def ajax_options():
    model_name = request.args.get('model_name', '')
    attr = request.args.get('attr', None)
    select = request.args.get('select', 0)
    if model_name == 'tag':
        options = [(u[0], u[0]) for u in all_tags()]
    elif model_name == 'location' and attr == 'name':
        options = ((str(getattr(u, 'id')), u.name) for u in NodeFactory.get_class_by_name(model_name).objects.all())
    else:
        options = ((str(getattr(u, 'id')), getattr(u, attr)) for u in NodeFactory.get_class_by_name(model_name).objects.all())
    if not select:
        str_to_use = '<option id="%s" value="%s">'
    else:
        str_to_use = '<option value="%s">%s</option>'
    results = (str_to_use % u for u in options)
    return ''.join(results)


@app.route('/names')
def ajax_names():
    model_name = request.args.get('model_name', '')
    attr = request.args.get('attr', None)
    size = request.args.get('size', None)
    if model_name == 'tag':
        options = [u[0] for u in all_tags()]
        options.extend([u.name for u in NodeExtractor.factory(ACTIVITY).get_list("", False, 0, 0)])
        if size:
            options = options[0: int(size)]
    else:
        options = (getattr(u, attr) for u in NodeFactory.get_class_by_name(model_name).objects.all())
    results = (u for u in options)
    return ','.join(results)



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
    from app.views import force_setup_context
    model_type = [u for u in request.path.split('/') if u and len(u) > 0][0]
    value = '/%s/%s' % (model_type, slug)
    title, card, context = PageManager.get_detail_title_and_page(model_type, query="slug__iexact:%s;" % value)
    context['card']     = card
    context['title']    = title if title and len(title) > 0 else "Fitrangi: India's complete adventure portal"
    return render_template('site/pages/commons/view.html', **context)


@app.route('/editors/invoke', methods=['POST'])
def edit_invoke():
    try:
        message = request.get_json(force=True)
        editor = NodeEditor.factory(message)
        return editor.invoke()
    except Exception, e:
        return jsonify(dict(status='error', message='Something went wrong', exception=str(e)))