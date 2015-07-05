import re

from BeautifulSoup import BeautifulSoup
from functools import wraps
from flask import g, redirect, request, url_for, abort
from app.settings import MEDIA_FOLDER
from rake import extract_keywords
from PIL import Image
import os, datetime, random, requests
from app import cache
from bson.son import SON
from StringIO import StringIO
from app import cache

TAG_RE = re.compile(r'<[^>]+>')

_link = re.compile(r'(?:(http://)|(www\.))(\S+\b/?)([!"#$%&\'()*+,\-./:;<=>?@[\\\]^_`{|}~]*)(\s|$)', re.I)
PAGE_LIMIT = 50

@cache.cached(24*3600, key_prefix='description/%s')
def get_descriptions(description):
    soup = BeautifulSoup(description)
    return soup.text

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

def specific_channels_article():
    return specific_channels('article')

def specific_channels_discussion():
    return specific_channels('discussion')


def specific_channels(type):
    from app.models.content import Content
    channels = []
    col = Content._get_collection()
    pipeline = [{"$unwind": "$channels"}, {"$group": {"_id": {'channel': "$channels", 'class': "$_cls"}, "count": {"$sum": 1}}}, {"$sort": SON([("count", -1), ("_id", -1)])}]
    channels.extend([(u['_id']['channel'], u['count']) for u in col.aggregate(pipeline)['result'] if type in u['_id']['class'].lower()])
    channels = sorted(channels, reverse=True, key=lambda u: u[1])
    return channels

def specific_tags_article():
    return specific_tags('article')

def specific_tags_discussion():
    return specific_tags('discussion')

def specific_tags(type):
    from app.models.content import Content
    tags = []
    col = Content._get_collection()
    pipeline = [{"$unwind": "$tags"}, {"$group": {"_id": {'tag': "$tags", 'class': "$_cls"}, "count": {"$sum": 1}}}, {"$sort": SON([("count", -1), ("_id", -1)])}]
    tags.extend([(u['_id']['tag'], u['count']) for u in col.aggregate(pipeline)['result'] if type in u['_id']['class'].lower()])
    tags = sorted(tags, reverse=True, key=lambda u: u[1])
    return tags


def all_tags():
    from app.models.content import Content
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

def save_profile_image(profile, image):
    from app.models.profile import Profile
    try:
        print '[*] Running image downloader in seperate thread for %s and %s' % (profile, image)
        profile = Profile.objects(pk=profile).first()
        response = requests.get(image)
        data = response.content
        content_type = response.headers['content-type']
        if not content_type.startswith('image'):
            return
        format = content_type.split('/')[1]
        p = '/tmp/' + str(random.randint(888888, 9999999)) + '.' + format
        with open(p, 'wb') as _f:
            _f.write(data)
        img = Image.open(p)
        buffer = StringIO()
        img.save(buffer, img.format)
        buffer.seek(0)
        profile.cover_image.replace(buffer)
        profile.save()
        path = os.getcwd() + '/app/assets/' + profile.path_cover_image if profile.path_cover_image and len(profile.path_cover_image) > 0 else 'some-non-existent-path'
        if os.path.exists(path):
            os.remove(path)
    except:
        print 'Failed to save profile image'
        raise
