from app.models import *
#from flask import render_template
from flask import render_template, make_response, abort, request, g, flash, redirect, url_for, session, send_file, jsonify
from jinja2 import Environment, FileSystemLoader
from app.settings import TEMPLATE_FOLDER
from Queue import Queue
from mongoengine import Q
from app.handlers.extractors import get_all_facets, get_all_models, get_all_models_all_channels, search_models
from app.models import Profile
from app import app
import simplejson as json
from app.config import configuration

env = Environment(loader=FileSystemLoader(TEMPLATE_FOLDER))

class PaginationInfo(object):

    def __init__(self, args, link, total_pages, current=1):
        self.link = link
        self.args = args
        self.total_pages = total_pages
        self.current = current
        self.template = 'generic/main/pagination.html'

    def render(self):
        template = env.get_template(self.template)
        return template.render(link=self.link, args=self.args, total_pages=self.total_pages, current=self.current, user=g.user)

class ModelView(object):

    def __init__(self, model, action, default='card', channel_name=None, subchannel_name=None):
        self.action = action
        self.model = model
        _template = "%s%s"
        if action == 'list':
            if default == 'card':
                self.template = _template % (model.__class__.__template__, 'card.html')
            elif default == 'row':
                self.template = _template % (model.__class__.__template__, 'row.html')
            else:
                raise Exception("Unsupported")
        elif action == 'detail':
            if channel_name:
                channel = Channel.getByName(channel_name)
                model_name = channel.model 
                model_class = Node.model_factory(model_name.lower())
            else:
                model_class = Content
            self.model = model_class.objects(pk=model).first()
            if not self.model.main_image or not self.model.main_image.image:
                self.model.has_no_image = True
            else:
                self.model.has_no_image = False
            self.template = _template % (self.model.__class__.__template__, 'detail.html')
            self.menu_view = MenuView(channel_name, subchannel_name if subchannel_name else None)
   
    def render(self):
        if self.action == 'list':
            template = env.get_template(self.template)
            return template.render(model=self.model)
        else:
            return render_template(self.template, model=self.model, menu=self.menu_view, user=g.user)

class InfoBarView(object):

    def __init__(self, related=[]):
        self.related = related

    def render(self):
        pass

class FacetView(object):

    def __init__(self, facets, template=None):
        if template is None:
            self.template = 'generic/main/facets.html'
        else:
            self.template = template
        self.facets = facets

    def render(self):
        template = env.get_template(self.template)
        return template.render(facet=self.facets, user=g.user)


class HomeView(object):

    def __init__(self, query):
        self.query = query
        self.models = get_all_models_all_channels(search_query=query)
        self.template =  'feature/home.html'
        self.menu = MenuView(None, None)
        self.model_dict_view = {}
        for k, models in self.models.iteritems():
            self.model_dict_view[k] = [ModelView(m, 'list') for m in models[0]]

    def render(self):
        return render_template(self.template, menu=self.menu, model_dict=self.model_dict_view, user=g.user)

class SearchView(object):

    def __init__(self, query):
        self.query = query
        self.models = search_models(search_query=query)
        self.template =  'feature/search.html'
        self.menu = MenuView(None, None)
        self.models = [ModelView(model, 'list') for model in self.models]

    def render(self):
        return render_template(self.template, menu=self.menu, models=self.models, user=g.user)

       
class ChannelView(object):

    def __init__(self, channel_name, sub_channel=None, selected_facets=[], query=None, page=1, paginated=True):
        self.query = query
        self.channel, self.facets = get_all_facets(channel_name)
        print "*****", channel_name, self.channel
        
        if sub_channel:
            new_dict = {}
            for k in self.facets:
                if k == sub_channel:
                    new_dict[k] = self.facets[k]
            self.facets = new_dict
        _facets = [] 
        if len(selected_facets) > 0 and len(self.facets) > 0:
            for k, v in self.facets.iteritems():
                _facets = [_v for _v in v if _v in selected_facets]

        self.models, total = get_all_models(self.channel, sub_channel,  _facets, query, page, paginated)
        self.paginated = paginated

        _template = self.channel.template 
        if not _template:
            raise Exception('The hell, where is the template')
        self.template = "%s/list_card.html" % _template
        self.facet_view = FacetView(self.facets)
        self.menu_view = MenuView(self.channel.name, sub_channel if sub_channel else None)
        self.model_views = [ModelView(model, 'list', default='row') for model in self.models]
        link = "/" + channel_name
        if sub_channel:
            link+= '/' + sub_channel
        args = request.args
        if self.paginated:
            self.pageinfo = PaginationInfo(args, link, total, page)
        
    def render(self):
        models_arranged = {}
        _len = len(self.model_views) / 3
        models_arranged[0] = self.model_views[0: _len + 1]
        models_arranged[1] = self.model_views[_len + 1: _len + _len + 1]
        models_arranged[2] = self.model_views[_len + _len:]
        #print len(models_arranged[0]), len(models_arranged[1]), len(models_arranged[2])

        if not self.paginated:
            return render_template(self.template, menu=self.menu_view, models=models_arranged, facets=self.facet_view, pageinfo=None, user=g.user)
        return render_template(self.template, menu=self.menu_view, models=models_arranged, facets=self.facet_view, pageinfo=self.pageinfo, user=g.user)


class MenuView(object):
    __template__ = 'generic/main/menu.html'

    def __init__(self, menu, submenu=None):
        self.menu = menu
        self.submenu = submenu

    def render(self):
        menus = configuration['MENUS']
        template = env.get_template(MenuView.__template__)
        return template.render(ordered_menu=[('Activities', True), ('Articles', True), ('Destinations', False), ('Finder (Profiles)', True), ('Adventure Trips', False), ('Forum', False)], menus=menus, menu=self.menu, submenu=self.submenu, user=g.user) 


@app.route('/')
def home():
    return HomeView(query=None).render()

@app.route('/search')
def search():
    query = request.args.get('search-query', '')
    return SearchView(query=query).render()


@app.route('/img/<model_name>/<key>')
def get_img(model_name, key):
    from app.models import Node
    model_class = Node.model_factory(model_name.lower())
    img = model_class.objects(pk=key).first().get_image()
    return send_file(img, mimetype='image/' + img.format)

@app.route('/channel/<channel>')
def channel(channel):
    page = request.args.get('page', 1)
    query = request.args.get('query', '')
    subchannel = request.args.get('subchannel', '')
    facets = []
    for k in request.args.keys():
        if k.startswith('facet'):
            facets.append(request.args.get(k))
    return ChannelView(channel, subchannel, paginated=False, selected_facets=facets, query=query,page=page).render()


def under_construction(e):
    return render_template('generic/main/under_construction.html'), 500

def page_not_found(e):
    return render_template('generic/main/under_construction.html'), 404

@app.route('/model/<channel>/<key>')
def model(channel, key):
    return ModelView(model, 'detail', channel_name=channel, subchannel_name=subchannel).render()

@app.route('/register', methods=['GET', 'POST'])
def registeration():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        password = request.form['password']
        confirm = request.form['confirm']
        if password != confirm:
            flash('Passwords do not match', category='error')
            return redirect(url_for('registeration'))
        profile = Profile.create_new(name, email, password)
        if profile:
            flash('Successfully created your account. Please login.', category='success')
            return redirect(url_for('login'))
    return render_template('/generic/main/registration.html', menu=MenuView(None))


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('username', None)
        password = request.form.get('password', None)
        profile = Profile.authenticate(email, password)
        if profile:
            session['user'] = str(profile._id)
            flash('Successfully logged in.', category='success')
            return redirect(url_for('home'))
    return render_template('/generic/main/login.html', menu=MenuView(None))

@app.route('/logout', methods=['GET', 'POST'])
def logout():
    if hasattr(g, 'user'):
        g.user = None
    session.clear()
    return redirect(url_for('home'))

@app.before_request
def before_request():
    userid = session.get('user', None)
    if userid is None or len(userid) == 0:
        g.user = None
    else:
        user = Profile.objects(pk=userid).first()
        if user:
            g.user = user
        else:
            g.user = None

@app.route('/flash', methods=['GET'])
def flash_message():
    flash_message = session.get('flash_message', None)
    session['flash_message'] = ''
    return jsonify(json.loads(flash_message)) if flash_message and len(flash_message) > 0 else ''

