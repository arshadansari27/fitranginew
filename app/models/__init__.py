#from models import *
import datetime
from PIL import Image
from fractions import Fraction
from ago import human
import cStringIO
from mongoengine import signals
#from flask.ext.mongoengine.wtf import model_form
import os, hashlib, random

from app import db
from app.models.extra.fields import ListField
from app.utils import convertLinks, mkdirp
from app.settings import CDN_URL

base_path = os.getcwd() + '/app/assets'
db.ListField = ListField


(ACTIVITY, ADVENTURE, EVENT, TRIP, PROFILE, PRODUCT, ARTICLE,
 LOCATION, POST, DISCUSSION, CHANNEL, STREAM, MESSAGE,
 RELATIONSHIPS, PROFILE_TYPE, ADVERTISEMENT, CONTEST) =  (
    "activity", "adventure", "event", "trip", "profile", "product",
    "article", "location", "post", "discussion", "channel",
    "stream", "message", "relationships", "profile_type", "advertisement", "contest"
)

def handler(event):

    def decorator(fn):
        def apply(cls):
            event.connect(fn, sender=cls)
            return cls

        fn.apply = apply
        return fn

    return decorator

@handler(signals.pre_save)
def update_content(sender, document):
    document.modified_timestamp = datetime.datetime.now()
    if hasattr(document, 'published'):
        if document.published and document.published_timestamp is None:
            document.published_timestamp = datetime.datetime.now()
    from app.models.content import Content
    if isinstance(document, Entity):
        use = document.name
    elif isinstance(document, Content):
        use = document.title
    else:
        use = None

    if (not hasattr(document, 'slug') or document.slug is None or len(document.slug) is 0) and use is not None:
        update_slug(sender, document, document.__class__.__name__.lower(), use)
    if document.path_cover_image and len(document.path_cover_image) > 0:
        path = base_path + document.path_cover_image
        if os.path.exists(path):
            pass

@handler(signals.post_save)
def new_object(sender, document, created):
    if created:
        document.on_create()

    from app.models.content import Content
    if hasattr(document, 'on_save')  and callable(document.on_save):
        document.on_save()


def update_slug(sender, document, type, title):
    if hasattr(document, 'id') and document.id:
        _doc = document.__class__.objects(pk=str(document.id)).first()
    else:
        _doc = None
    to_replace = [',', '.', '?', '/', '\\', ':', ';', '(', ')', '[', ']', '|', '*', '&', '^', '%', '$', '#', '@', '!', '~', '`', '<', '>']
    for t in to_replace:
        title = title.replace(t, '-')
    original_slug = "/%s/%s" % (type, title.lower())
    if not _doc:
        _slug = original_slug
        count = 1
        while document.__class__.objects(slug=_slug).first() is not None:
            _slug = original_slug + str(count)
            count += 1
    else:
        _slug = original_slug
    document.slug = _slug

def get_random():
    return random.randint(0, 99999999999)


def save_media_to_file(obj, attr, name):
    obj = obj.__class__.objects(id=obj.id).first()
    image = getattr(obj, attr)

    if image and image.size:
        img = Image.open(image)
        _format = img.format
        _format = _format.lower()
        if _format == 'ico':
            _format = 'jpeg'

        dir_list = ['media', obj.__class__.__name__.lower(), str(obj.id)]
        for i in xrange(len(dir_list)):
            if i is 0:
                dir_path = base_path + '/' + dir_list[0]
            else:
                dir_path = base_path +'/' + '/'.join(dir_list[:i + 1])
            mkdirp(dir_path)

        path = '/' + '/'.join(dir_list) + '/' + name + '.' + _format
        file_path = base_path + path
        i = 0
        while os.path.exists(file_path):
            i += 1
            path = '/' + '/'.join(dir_list) + '/' + name + '_' + str(i) + '.' + _format
            file_path = base_path + path

        with open(file_path, 'wb') as file_io:
            img.save(file_io, _format, quality=70)
            return path

    else:
        return None


class Node(object):

    description = db.StringField()
    cover_image = db.ImageField(thumbnail_size=(128, 128))
    path_cover_image = db.StringField()
    created_timestamp = db.DateTimeField(default=datetime.datetime.now)
    modified_timestamp = db.DateTimeField(default=datetime.datetime.now)
    slug = db.StringField()
    not_ok_count = db.IntField(default=0)
    image_gallery = db.ListField(db.StringField()) # Deprecated

    @property
    def cover_image_path(self):
        from app import USE_CDN
        path = str(self.path_cover_image) if hasattr(self, 'path_cover_image') and self.path_cover_image else '-'
        if path and len(path) > 0 and os.path.exists(base_path + path):
            img = path
        else:
            path = save_media_to_file(self, 'cover_image', 'cover')
            if path:
                self.path_cover_image = path
                self.save()
                img = path
            else:
                from app.models.profile import Profile
                if isinstance(self, Profile):
                    if self.is_business_profile:
                        img = '/img/Profile-Picture1.jpg'
                    else:
                        img = '/img/Profile-Picture2.jpg'
                else:
                    img = None
        return img #if not USE_CDN else "%s%s" % (CDN_URL, img)

    @property
    def cover_image_path_small(self):
        from app.models.profile import Profile
        from app import USE_CDN
        path = self.cover_image_path if self.cover_image_path else None
        if CDN_URL in path:
            path = path.replace(CDN_URL, '')
        if path is None:
            if isinstance(self, Profile):
                return ('%s/img/Profile-Picture-thumbnail.jpg' % CDN_URL) if isinstance(self, Profile) else None
            return ''
        else:
            steps = path.split('/')
            full_name = steps[-1]
            ux = full_name.split('.')
            if len(ux) < 2:
                print 'Something went wrong with thumbnail image path here....'
                return ''
            name, ext = ux[0], ux[1]
            steps[-1] = name + '-thumbnail.' + ext
            small_path = '/'.join(steps)
            if not os.path.exists(small_path):
                file_path = base_path + path
                im  = Image.open(file_path)
                format = im.format
                x, y = im.size
                f = Fraction(x, y)
                num = f.numerator
                den = f.denominator
                s = 360 * num / den
                im.thumbnail((s, 360), Image.ANTIALIAS)
                if not isinstance(self, Profile):
                    p = '/tmp/' + str(random.randint(88888888, 999999999)) + '.' + format
                    im.save(p, format)
                    im = Image.open(p)
                    x, y = im.size
                    u = x / 2
                    v = y / 2
                    x1, x2 = u - 240, u + 240
                    y1, y2 = v - 180, v + 180

                    im = im.crop((x1, y1, x2, y2))
                im.save(base_path + small_path, format)

            img = small_path
        return img #if not USE_CDN else "%s%s" % (CDN_URL, img)

    @property
    def icon_image_path_small(self):
        return self.cover_image_path_small

    @property
    def icon_image_path(self):
        from app import USE_CDN
        path = str(self.path_cover_image) if hasattr(self, 'path_cover_image') and self.path_cover_image else '-'
        if path and len(path) > 0 and os.path.exists(base_path + path):
            img = path
        else:
            path = save_media_to_file(self, 'cover_image', 'cover')
            if path:
                self.path_cover_image = path
                self.save()
                img = path
            else:
                from app.models.profile import Profile
                img = '/img/Profile-Picture2.jpg' if isinstance(self, Profile) else None
        return img #if not USE_CDN else "%s%s" % (CDN_URL, img)


    def on_create(self):
        pass

    @property
    def since(self):
        value = human(self.created_timestamp, precision=1)
        if 'microseconds' in value:
            return 'just now'
        else:
            return value

    @property
    def name_short(self):
        if hasattr(self, 'name') and len(self.name) > 40:
            return self.name[:40] + '...'
        return self.name

    @property
    def title_short(self):
        if hasattr(self, 'title') and len(self.title) > 35:
            return self.title[:35] + '...'
        return self.title

    @classmethod
    def get_by_id(cls, id):
        return cls.objects(pk=id).first()

    @classmethod
    def get_by_slug(cls, slug):
        return cls.objects(slug__iexact=slug).first()

    def __lt__(self, other):
        return (isinstance(other, self.__class__) and str(self.id) < str(other.id))

    def __eq__(self, other):
        return (isinstance(other, self.__class__) and str(self.id) == str(other.id))

    def __ne__(self, other):
        return not self.__eq__(other)


class Entity(Node):
    name = db.StringField()
    about = db.StringField()

    @property
    def process_about(self):
        return self.about

    def __unicode__(self): return self.name

    def __repr__(self): return self.name

class Location(object):
    location = db.StringField()
    geo_location = db.PointField()
    city = db.StringField()
    region = db.StringField()
    state = db.StringField()
    country = db.StringField()
    zipcode = db.StringField()

class ExternalNetwork(object):
    external_name = db.StringField()
    external_link = db.StringField()
    external_domain = db.StringField()


class Charge(object):
    price = db.DecimalField()
    currency = db.StringField(choices=['INR', 'USD'])
    discount_percentage = db.IntField()

    @property
    def actual_price(self):
        return self.amount - (self.amount * (self.discount_percentage / 100.0))

class NodeFactory(object):

    @classmethod
    def get_by_id(cls, model_class, id):
        """
        from app.models.activity import Activity
        from app.models.adventure import Adventure, Location
        from app.models.content import Content, Discussion, Channel, Post, Article
        from app.models.event import Event
        from app.models.store import Product
        from app.models.profile import Profile, ProfileType
        from app.models.trip import Trip
        from app.models.relationships import RelationShips
        """
        model_class = NodeFactory.get_class_by_name(model_class.lower())
        return model_class.get_by_id(id)

    @classmethod
    def get_class_by_name(cls, name):
        from app.models.activity import Activity
        from app.models.adventure import Adventure
        from app.models.content import Content, Discussion, Channel, Post, Article, Advertisement
        from app.models.event import Event
        from app.models.store import Product
        from app.models.profile import Profile, ProfileType
        from app.models.trip import Trip
        from app.models.streams import ActivityStream, ChatMessage
        from app.models.relationships import RelationShips
        from app.models.contest import Contest
        name = name.lower()

        if name == ACTIVITY: return Activity
        elif name == ADVENTURE: return Adventure
        elif name == EVENT: return Event
        elif name == TRIP: return Trip
        elif name == PROFILE: return Profile
        elif name == PRODUCT: return Product
        elif name == ARTICLE: return Article
        elif name == POST: return Post
        elif name == DISCUSSION: return Discussion
        elif name == CHANNEL: return Channel
        elif name == STREAM: return ActivityStream
        elif name == MESSAGE: return  ChatMessage
        elif name == RELATIONSHIPS: return RelationShips
        elif name == PROFILE_TYPE: return ProfileType
        elif name == ADVERTISEMENT: return Advertisement
        elif name == CONTEST: return Contest
        else: return None

class BusinessException(Exception):
    pass

if __name__ == '__main__':
    print 'running models_init'
