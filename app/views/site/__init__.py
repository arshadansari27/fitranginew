from jinja2 import Template
from app import app
from flask import render_template, request, g
from app.models.activity import Activity
from app.models.content import Content, Post, Comment
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
    from app.views import force_setup_context
    context = force_setup_context({})
    view = template.render(**context)
    return render_template("site/layouts/empty_layout.html", view=view)

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
    context['user'] = g.user if hasattr(g, 'user') and g.user is not None else None
    return collection_view.next_page(context.get('page'))

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
    node_view = NodeView.factory(model_type)
    view = node_view(MODEL_DETAIL_VIEW, '/%s/%s' % (model_type, slug), key='slug__iexact')
    return render_template('site/features/generic_view.html', view=view.get_card())


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
