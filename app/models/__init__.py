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


base_path = os.getcwd() + '/app/assets'
db.ListField = ListField


(ACTIVITY, ADVENTURE, EVENT, TRIP, PROFILE, PRODUCT, ARTICLE,
 LOCATION, POST, DISCUSSION, CHANNEL, STREAM, MESSAGE,
 RELATIONSHIPS, PROFILE_TYPE, ADVERTISEMENT) =  (
    "activity", "adventure", "event", "trip", "profile", "product",
    "article", "location", "post", "discussion", "channel",
    "stream", "message", "relationships", "profile_type", "advertisement"
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
    if use is not None:
        update_slug(sender, document, document.__class__.__name__.lower(), use)

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
    original_slug = "/%s/%s" % (type, title.lower().replace(',', '-').replace('.', '-').replace(' ', '-').replace('?', '-').replace('/', '-').replace('\\', '-'))
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

class EmbeddedImageField(db.EmbeddedDocument):
    id_field = db.IntField(default=get_random)
    image = db.ImageField(thumbnail_size=(128, 128))
    path = db.StringField()
    alt = db.StringField()
    copyright = db.StringField()

    def image_path(self, parent, i):
        path = str(self.path) if hasattr(self, 'path') and self.path else ''
        if path and len(path) > 0 and os.path.exists(path):
            return path
        path = save_media_to_file(self, 'image', 'gallery_%d' % i, parent)
        if path:
            self.path = path
            parent.save()
            return path
        else:
            return ''

def save_media_to_file(obj, attr, name, path_obj=None):
    is_embedded = path_obj is not None
    if not is_embedded:
        path_obj = obj
        obj = obj.__class__.objects(id=obj.id).first()
        image = getattr(obj, attr)
    else:
        path_obj = path_obj.__class__.objects(id=path_obj.id).first()
        obj = [u for u in path_obj.image_gallery if u.id_field == obj.id_field][0]
        image = getattr(obj, attr)

    if image and image.size:
        img = Image.open(image)
        _format = img.format
        _format = _format.lower()
        if _format == 'ico':
            _format = 'jpeg'

        dir_list = ['media', path_obj.__class__.__name__.lower(), str(path_obj.id)]
        for i in xrange(len(dir_list)):
            if i is 0:
                dir_path = base_path + '/' + dir_list[0]
            else:
                dir_path = base_path +'/' + '/'.join(dir_list[:i + 1])
            mkdirp(dir_path)

        path = '/' + '/'.join(dir_list) + '/' + name + '.' + _format
        file_path = base_path + path
        with open(file_path, 'wb') as file_io:
            img.save(file_io, _format, quality=70)
            return path

        if is_embedded:
            obj = obj.__class__.objects(id=obj.id).first()
        else:
            path_obj = path_obj.__class__.objects(id=path_obj.id).first()
            obj = [u for u in path_obj.image_gallery if u == obj][0]

        with open(file_path, 'r') as _file_io:
            if hashlib.md5(_file_io.read()).hexdigest() != hashlib.md5(getattr(obj, attr).read()).hexdigest():
                return save_media_to_file(str(obj.id), attr, name)
    else:
        return None


class Node(object):

    description = db.StringField()
    cover_image = db.ImageField(thumbnail_size=(128, 128))
    image_gallery = db.ListField(db.EmbeddedDocumentField(EmbeddedImageField))
    path_cover_image = db.StringField()
    created_timestamp = db.DateTimeField(default=datetime.datetime.now)
    modified_timestamp = db.DateTimeField(default=datetime.datetime.now)
    slug = db.StringField()

    @property
    def cover_image_path(self):
        path = str(self.path_cover_image) if hasattr(self, 'path_cover_image') and self.path_cover_image else '-'
        if path and len(path) > 0 and os.path.exists(base_path + path):
            return path
        path = save_media_to_file(self, 'cover_image', 'cover')
        if path:
            self.path_cover_image = path
            self.save()
            return path
        else:
            from app.models.profile import Profile
            return '/img/Profile-Picture.jpg' if isinstance(self, Profile) else None

    @property
    def cover_image_path_small(self):
        path = self.cover_image_path if self.cover_image_path else None
        if path is None:
            from app.models.profile import Profile
            if isinstance(self, Profile):
                return '/img/Profile-Picture-thumbnail.jpg' if isinstance(self, Profile) else None
            return ''
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
            s = 128 * num / den
            im.thumbnail((s, 128), Image.ANTIALIAS)
            im.save(base_path + small_path, format)
        return small_path

    @property
    def icon_image_path_small(self):
        return self.cover_image_path_small

    @property
    def icon_image_path(self):
        path = str(self.path_cover_image) if hasattr(self, 'path_cover_image') and self.path_cover_image else '-'
        if path and len(path) > 0 and os.path.exists(base_path + path):
            return path
        path = save_media_to_file(self, 'cover_image', 'cover')
        if path:
            self.path_cover_image = path
            self.save()
            return path
        else:
            from app.models.profile import Profile
            return '/img/Profile-Picture2.jpg' if isinstance(self, Profile) else None


    @property
    def gallery_image_list(self):
        gallery_images = [u.image_path(self, i) for i, u in enumerate(self.image_gallery)]
        print '****', gallery_images
        return gallery_images

    @property
    def gallery_size(self):
        return len([u for u in self.image_gallery if u.image is not None])

    def on_create(self):
        pass

    @property
    def since(self):
        return human(self.created_timestamp, precision=1)

    """
    @property
    def description(self):
        return convertLinks(self._description)

    @description.setter
    def description(self, new_value):
        self._description = new_value
    """

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
        return convertLinks(self.about)

    def __unicode__(self): return self.name

    def __repr__(self): return self.name

class ExternalNetwork(object):
    external_name = db.StringField()
    external_link = db.StringField()
    external_domain = db.StringField()


class BookingEnquiry(db.EmbeddedDocument):
    message = db.StringField()
    author = db.ReferenceField('Profile')

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
        from app.models.adventure import Adventure, Location
        from app.models.content import Content, Discussion, Channel, Post, Article, Advertisement
        from app.models.event import Event
        from app.models.store import Product
        from app.models.profile import Profile, ProfileType
        from app.models.trip import Trip
        from app.models.streams import ActivityStream, ChatMessage
        from app.models.relationships import RelationShips
        name = name.lower()

        if name == ACTIVITY: return Activity
        elif name == ADVENTURE: return Adventure
        elif name == EVENT: return Event
        elif name == TRIP: return Trip
        elif name == PROFILE: return Profile
        elif name == PRODUCT: return Product
        elif name == ARTICLE: return Article
        elif name == LOCATION: return Location
        elif name == POST: return Post
        elif name == DISCUSSION: return Discussion
        elif name == CHANNEL: return Channel
        elif name == STREAM: return ActivityStream
        elif name == MESSAGE: return  ChatMessage
        elif name == RELATIONSHIPS: return RelationShips
        elif name == PROFILE_TYPE: return ProfileType
        elif name == ADVERTISEMENT: return Advertisement
        else: return None

if __name__ == '__main__':
    print 'running models_init'
