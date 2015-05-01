import re

from functools import wraps
from flask import g, redirect, request, url_for, abort
from app.settings import MEDIA_FOLDER
from rake import extract_keywords
from app.utils.general import get_facets
from PIL import Image
import os, datetime, random
from app import cache
from bson.son import SON

TAG_RE = re.compile(r'<[^>]+>')

FACETS = get_facets()
MEMOIZED_FACETS = {}

_link = re.compile(r'(?:(http://)|(www\.))(\S+\b/?)([!"#$%&\'()*+,\-./:;<=>?@[\\\]^_`{|}~]*)(\s|$)', re.I)
PAGE_LIMIT = 50

def get_start_end(page, size=PAGE_LIMIT):
    if page < 1: page = 1
    start = (page - 1) * size
    end = start + size
    return start, end

def get_current_user():
    if hasattr(g, 'user')  and g.user is not None:
        return g.user
    else:
        return None

def mkdirp(directory):
    print 'Checking directory'
    if not os.path.isdir(directory):
        print 'Creating directory: ',directory
        os.makedirs(directory)

def convert_query_to_filter(query):
    filters = []
    if query is None or len(query) is 0:
        return {}
    if ';' not in query:
        filters.append(query)
    else:
        for u in query.split(';'):
            if not u or len(u) is 0:
                continue
            filters.append(u)
    return dict([tuple(f.split(':')) for f in filters])


def login_required(func):

    @wraps(func)
    def decoration(*args, **kwargs):
        if hasattr(g, 'user') and g.user is not None and g.user.id is not None:
            return func(*args, **kwargs)
        else:
            return redirect('login')

    return decoration


def redirect_url(default='login'):
    return request.args.get('next') or request.referrer or url_for(default)

def save_media(file):
        folder = "%s%s" % (MEDIA_FOLDER, str(datetime.datetime.now()).split(' ')[0].replace('-', ''))
        if not os.path.exists(folder):
            os.mkdir(folder)
        name = str(random.randrange(9999999999999, 999999999999999999))
        path = "%s/%s.jpg" % (folder, name)
        path_thumbnail = "%s/%s.thumbnail.jpg" % (folder, name)
        image = Image.open(file)
        image.save(path, "JPEG")
        image2 = Image.open(file)
        image2.size((128, 128,))
        image2.save(path_thumbnail, "JPEG")
        image.save()
        return (path, path_thumbnail)


def convertLinks(text):
    def replace(match):
        groups = match.groups()
        protocol = groups[0] or ''  # may be None
        www_lead = groups[1] or ''  # may be None
        return '<a href="http://{1}{2}" rel="nofollow">{0}{1}{2}</a>{3}{4}'.format(
            protocol, www_lead, *groups[2:])
    if not text or len(text) is 0:
        return ''
    return _link.sub(replace, text)

def tag_remove(text):
    return TAG_RE.sub('', text)

#@cache.cached(60)
def all_tags(type=None):
    from app.models.content import Content, Article, Discussion
    from app.models.activity import Activity
    tags = [(u.name, 100) for u in Activity.objects.all()]
    col = Content._get_collection()
    pipeline = [{"$unwind": "$tags"}, {"$group": {"_id": "$tags", "count": {"$sum": 1}}}, {"$sort": SON([("count", -1), ("_id", -1)])}]
    tags.extend([(u['_id'], u['count']) for u in col.aggregate(pipeline)['result']])
    _tags = {}
    for tu, tv in tags:
        _tags.setdefault(tu, 0)
        _tags[tu] += tv
    return _tags.items()


def get_month(month):
    return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][month - 1]
