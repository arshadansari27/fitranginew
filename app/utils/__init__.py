import re

from functools import wraps
from flask import g, redirect, request, url_for, abort
from app.settings import MEDIA_FOLDER
from rake import extract_keywords
from app.utils.general import get_facets
from PIL import Image
import os, datetime, random


TAG_RE = re.compile(r'<[^>]+>')

FACETS = get_facets()
MEMOIZED_FACETS = {}

_link = re.compile(r'(?:(http://)|(www\.))(\S+\b/?)([!"#$%&\'()*+,\-./:;<=>?@[\\\]^_`{|}~]*)(\s|$)', re.I)

def get_current_user():
    if hasattr(g, 'user')  and g.user is not None:
        return g.user
    else:
        return None

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

