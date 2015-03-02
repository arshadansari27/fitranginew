__author__ = 'arshad'

from flask import render_template, request, g

from app.models import *
from app.handlers.views import env
from app.handlers.views.facet_view import FacetView
from app.handlers.views.menu_view import MenuView
from app.handlers.views.model_view import ModelView
from app.handlers.extractors import get_all_models, get_channel, get_models_by_only_single, PAGE_SIZE, get_content_list

class StreamView(object):

    def __init__(self, page=1):
        self.page = page
        self.channel = get_channel('Stream')

        _template = self.channel.template
        if not _template:
            raise Exception('The hell, where is the template')
        self.template = "%s/list_card.html" % _template
        self.menu_view = MenuView(self.channel.name)


    def render(self):
        user_of_interest = Profile.objects(pk=g.user.id).first().following
        user_of_interest.append(g.user)
        models = [ModelView(u, 'list', channel_name='Stream') for u in Post.objects(created_by__in=user_of_interest).all().order_by('-modified_timestamp')]
        models_arranged = {}
        for idx, m in enumerate(models):
                models_arranged.setdefault(idx % 3, [])
                models_arranged[idx % 3].append(m)

        return render_template(self.template, menu=self.menu_view, user=g.user, channel_name=self.channel.name, models=models_arranged, total=len(models))

class AdminChannelView(object):

    def __init__(self, channel_name, query=None, only_facet=False, page=1, paginated=True):
        page = int(page)
        self.channel_name = channel_name
        self.query = query
        self.channel = get_channel(channel_name)
        self.models, total = get_all_models(self.channel, [], search_query=query, page=page, paginated=paginated, user=g.user)

        _template = self.channel.template
        if not _template:
            raise Exception('The hell, where is the template')
        self.template = "%s/admin_list.html" % _template
        self.detail = '/manage/model-edit/%s/' % channel_name
        self.model_views = [ModelView(model, 'admin_list', detail_link=self.detail) for model in self.models]
        link = "/manage/" + channel_name
        args = request.args
        self.paginated = paginated
        if self.paginated:
            self.pageinfo = PaginationInfo(args, link, total, page)
        self.tags = [t.name for t in Tag.objects.all()]

    def render(self):
        if not self.paginated:
            return render_template(self.template, models=self.model_views, pageinfo=None, user=g.user, channel=self.channel.name, tags=self.tags)
        return render_template(self.template, models=self.model_views, pageinfo=self.pageinfo, user=g.user, channel=self.channel.name, tags=self.tags, content_type=self.channel.name)

class AdminAdvertisementView(object):

    def __init__(self, query=None, page=1, paginated=True):
        page = int(page)
        self.query = query
        class AdView(object):

            def __init__(self, model):
                self.model = model
                self.detail = '/manage/advertisement-edit/'
                self.template = '/model/advertisement/table.html'

            def render(self):
                template = env.get_template(self.template)
                return template.render(model=self.model, detail=self.detail)

        start =  (page - 1) * PAGE_SIZE
        end = start + PAGE_SIZE
        if query:
            query_set = Advertisement.objects(title__icontains=query)
        else:
            query_set = Advertisement.objects()

        total = query_set.count()
        self.models = [AdView(m) for m in query_set.all()[start: end]]
        args = request.args
        self.paginated = paginated
        link = "/manage/channel/Advertisement"
        if self.paginated:
            self.pageinfo = PaginationInfo(args, link, total, page)

    def render(self):
        return render_template("/generic/admin/advertisement_list.html", models=self.models, pageinfo=self.pageinfo, user=g.user, channel='Advertisement')

class ChannelView(object):

    def __init__(self, channel_name, selected_facets=[], query=None, only_facet=False, page=1, paginated=True):
        page = int(page)
        self.channel_name = channel_name
        self.query = query
        self.channel = get_channel(channel_name)

        _facets = []
        if len(selected_facets) > 0:
            _facets = []
            for u in selected_facets:
                f = Facet.find(u)
                if f is not None:
                    if isinstance(f, str):
                        _facets.append(f)
                        continue
                    elif isinstance(f, Facet):
                        _facets.append(f.name)
                        continue

                t = Tag.objects(name__iexact=u).first()
                if not t:
                    continue
                _facets.append(t.name)


            print '[*] Looking in ', _facets
            self.facets = _facets
        else:
            self.facets = []

        if only_facet:
            self.models, total = get_models_by_only_single(self.channel.name, self.facets[0])
        else:
            self.models, total = get_all_models(self.channel, _facets, query, page, paginated)
        self.paginated = paginated

        _template = self.channel.template
        if not _template:
            raise Exception('The hell, where is the template')
        self.template = "%s/list_card.html" % _template
        self.facet_view = FacetView(self.facets, self.channel, self.models)
        self.menu_view = MenuView(self.channel.name)
        self.model_views = [ModelView(model, 'list', default='row') for model in self.models]
        link = "/" + channel_name
        args = request.args
        if self.paginated:
            self.pageinfo = PaginationInfo(args, link, total, page)
        self.tags = [t.name for t in Tag.objects.all()]

    def render(self):
        if self.channel_name == 'Forum':
            models_arranged = []
            for idx, model_view in enumerate(self.model_views):
                models_arranged.append(model_view)
        else:
            _len = len(self.model_views) / 3
            models_arranged = {}
            for idx, model_view in enumerate(self.model_views):
                models_arranged.setdefault(idx % 3, [])
                models_arranged[idx % 3].append(model_view)

        if not self.paginated:
            return render_template(self.template, menu=self.menu_view, models=models_arranged, facets=self.facet_view, pageinfo=None, user=g.user, channel_name=self.channel.name, tags=self.tags)
        return render_template(self.template, menu=self.menu_view, models=models_arranged, facets=self.facet_view, pageinfo=self.pageinfo, user=g.user, channel_name=self.channel.name, tags=self.tags)


class PaginationInfo(object):

    def __init__(self, args, link, total, page):
        self.args = args
        self.link = link
        self.total = total
        self.page = page

    def render(self):
        pages = range(self.page - 3, self.page + 3)
        first = 1
        last = self.total
        pages = filter(lambda p: True if 0 < p <= last else False, pages)
        args = "&".join(["%s=%s" % (k, v) for k, v in self.args.iteritems() if k != 'page'])

        return render_template("/generic/main/pagination.html", pages=pages, first=first, last=last, current=self.page, args=args)
