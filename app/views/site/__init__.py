import os
from jinja2 import Template
from PIL import Image
from app import app
from flask import render_template, request, g, redirect, jsonify
from app.models import Node, NodeFactory
from app.models.content import Content, Post, Comment
from app.utils.search_helper import listing_helper, node_helper
from app.utils import login_required
from app.handlers import ActivityView, NodeView, NodeCollectionView, AdventureCollectionView, NodeExtractor
from app.views.site.menus import view_menu

(MODEL_DETAIL_VIEW, MODEL_LIST_ROW_VIEW, MODEL_LIST_GRID_VIEW, MODEL_LIST_POD_VIEW) = ('detail', 'row', 'grid', 'pod')


@app.route('/test/post')
def post_box():
    from app.models.adventure import Adventure
    model = Adventure.objects.first()
    return render_template('site/pages/commons/empty_view.html', model=model, user=g.user, post_type='review')

@app.route('/post/add', methods=['POST'])
@login_required
def add_post():
    content = request.form['content']
    author = g.user
    post_type = request.form.get('post_type', None)
    assert post_type is not None
    parent = request.form.get('parent', None)
    if parent:
        parent_type = request.form.get('parent_type', None)
        extractor = NodeExtractor.factory(parent_type.lower(), {'pk': parent})
        parent = extractor.get_single()
    else:
        parent = None
    image = request.form.get('image')
    if image and len(image) > 0:
        image = image.split('/')[-1]
        path = os.getcwd() + '/tmp/' + image
    else:
        path = None
    print '[*]', path
    post = Post(content=content, author=author, type=post_type, parent=parent)
    if image:
        post.cover_image.put(open(path, 'rb'))
    post.save()
    return jsonify(dict(status='success', post=str(post.id)))


@app.route("/")
def act_home():
    return redirect('/explore')

@app.route("/explore")
def home():
    return render_template("/site/pages/landings/home.html")

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

@app.route("/community")
def journal():
    return render_template("/site/pages/landings/community.html")

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
    return collection_view.next_page(page)

@app.route('/options')
def ajax_options():
    model_name = request.args.get('model_name', '')
    attr = request.args.get('attr', None)
    options = (getattr(u, attr) for u in NodeFactory.get_class_by_name(model_name).objects.all())
    results = ('<option value="%s">' % u for u in options)
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
    return render_template('site/pages/commons/view.html', card=view.get_card())


@app.route('/sub_comment/<post_id>', methods=['POST'])
def post_sub_comment(post_id):
    post = Post.objects(pk=post_id).first()
    content = request.form.get('content', '')
    comment = Comment(author=g.user.id, content=content)
    post.comments.append(comment)
    post.save()
    comment_template = """
    <article class="well well-sm otherpost-profile">
        <img src="{{comment.author.cover_image_path}}" class="img-circle img-responsive pull-left p-5" width="60" height="100">
        <h4>{{comment.author.name}}</h4><br/>
        <div class="container">
            <span>{{comment.process_content|safe}}</span>
        </div>
    </article>
    """
    context = {}
    context['comment'] = comment
    template = Template(comment_template)
    return template.render(**context)
