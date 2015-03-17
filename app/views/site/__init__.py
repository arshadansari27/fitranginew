from app.models import Post, Article, Blog, Topic, Activity, Destination, Location, Event, Trip, Product, Profile, \
    TopicGroup, Content, Entity, NodeFactory
from app.views import login_required
from flask import g

__author__ = 'arshad'


from flask import Blueprint, request, redirect, render_template, url_for
from flask.views import MethodView

from flask.ext.mongoengine.wtf import model_form

admin_module = Blueprint('admin', __name__, template_folder='templates')

# Map post types to models
class_map = {
        'post': Post,
        'article': Article,
        'blog': Blog,
        'topic': Topic,
        'activity': Activity,
        'destination': Destination,
        'location': Location,
        'event': Event,
        'trip': Trip,
        'product': Product,
        'profile': Profile,
        'topicgroup': TopicGroup,
        'content': Content
}


class List(MethodView):
    decorators = [login_required]
    cls = None

    def get_context(self, query=None, page=None):
        if page is None:
            page = 1
        else:
            page = int(page)
        self.start = (page - 1) * 50
        self.end = self.start + 50
        if query:
            if Entity in self.cls.__bases__:
                models = self.cls.objects(name__icontains=query).all()[self.start: self.end]
            else:
                models = self.cls.objects(title__icontains=query).all()[self.start: self.end]
        else:
            models = self.cls.objects.all()[self.start: self.end]
        self.content_type = str(self.__class__.cls.__name__).lower()
        return {'models': models, 'user': g.user, 'content_type': self.content_type}

    def get(self):
        page = request.args.get('page', None)
        query = request.args.get('query', None)
        context = self.get_context(query, page)
        return render_template('admin/%s/list.html' % self.content_type, **context)


class Detail(MethodView):

    decorators = [login_required]

    def get_context(self, slug=None):

        if slug:
            cls = NodeFactory.get_class_by_name(request.args.get('type', None))
            object = cls.objects.get(pk=slug)
            # Handle old posts types as well
            cls = object.__class__
            form_cls = cls.get_form() #model_form(cls,  exclude=('created_at', 'comments'))
            if request.method == 'POST':
                form = form_cls(request.form, inital=object._data)
            else:
                form = form_cls(obj=object)
        else:
            # Determine which post type we need
            cls = NodeFactory.get_class_by_name(request.args.get('type', None))
            object = cls()
            form_cls = cls.get_form() # model_form(cls,  exclude=('created_at', 'comments'))
            form = form_cls(request.form)
        context = {
            "model": object,
            "form": form,
            "create": slug is None,
            "user": g.user,
            "back": request.referrer,
            "content_type": request.args.get("type", None)
        }
        return context

    def get(self, slug):
        prefix = request.args.get('type', None)
        context = self.get_context(slug)
        return render_template('admin/%s/detail.html' % prefix, **context)

    def post(self, slug):
        prefix = request.args.get('type', None)
        context = self.get_context(slug)
        form = context.get('form')

        if form.validate():
            object = context.get('model')
            form.populate_obj(object)
            object.save()

            return redirect('/admin/%s/%s?type=%s' % (prefix, object.id, prefix))
        return render_template('/admin/%s/detail.html' % prefix, **context)

class PostList(List):
    cls = Post

class ArticleList(List):
    cls = Article

class BlogList(List):
    cls = Blog

class TopicList(List):
    cls = Topic

class ActivityList(List):
    cls = Activity

class DestinationList(List):
    cls = Destination

class LocationList(List):
    cls = Location

class EventList(List):
    cls = Event

class TripList(List):
    cls = Trip

class ProductList(List):
    cls = Product

class ProfileList(List):
    cls = Profile

class TopicGroupList(List):
    cls = TopicGroup

view_class_map = {
        'post': PostList,
        'article': ArticleList,
        'blog': BlogList,
        'topic': TopicList,
        'activity': ActivityList,
        'destination': DestinationList,
        'location': LocationList,
        'event': EventList,
        'trip': TripList,
        'product': ProductList,
        'profile': ProfileList,
        'topicgroup': TopicGroupList,
        #'content': ContentList
}

@admin_module.route('/admin/')
@login_required
def dashboard():
    return render_template('admin/base_admin.html', user=g.user)

for k, v in class_map.iteritems():
    if not view_class_map.has_key(k): continue
    ListClass = view_class_map.get(k)
    admin_module.add_url_rule('/admin/%s/' % k, view_func=ListClass.as_view('%s_index' % k))
    admin_module.add_url_rule('/admin/%s/create/' % k, defaults={'slug': None}, view_func=Detail.as_view('%s_create' % k))
    admin_module.add_url_rule('/admin/%s/<slug>/' % k, view_func=Detail.as_view('%s_edit' % k))

