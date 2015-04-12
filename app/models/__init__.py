#from models import *
import datetime
from PIL import Image

from ago import human
import cStringIO
from mongoengine import signals
from flask.ext.mongoengine.wtf import model_form

from app import db
from app.models.extra.fields import ListField
from app.utils import convertLinks


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
    if hasattr(document, 'tag_refs'):
        if len(document.tag_refs) != len(document.tags) and not all(v.name in set(document.tags) for v in document.tag_refs):
            document.update_tags_list()
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


def update_slug(sender, document, type, title):
    if document.slug is not None and len(document.slug) > 0:
        return
    original_slug = "/%s/%s" % (type, title.lower().replace(',', '-').replace('.', '-').replace(' ', '-'))
    _slug = original_slug
    count = 1
    while document.__class__.objects(slug=_slug).first() is not None:
        _slug = original_slug + str(count)
        count += 1
    document.slug = _slug

class EmbeddedImageField(db.EmbeddedDocument):
    image = db.ImageField(thumbnail_size=(128, 128))
    alt = db.StringField()
    copyright = db.StringField()


class Node(object):

    description = db.StringField()
    cover_image = db.ImageField(thumbnail_size=(128, 128))
    created_timestamp = db.DateTimeField(default=datetime.datetime.now)
    modified_timestamp = db.DateTimeField(default=datetime.datetime.now)
    slug = db.StringField()

    @property
    def cover_image_path(self):
        return '/media/' + self.__class__.__name__.lower() + '/' + str(self.id) + '/cover'

    @property
    def gallery_image_path(self):
        return '/media/' + self.__class__.__name__.lower() + '/' + str(self.id) + '/gallery/'

    def get_cover_image(self):
        if not hasattr(self, 'cover_image') or not self.cover_image:
            return None, None
        img_io = cStringIO.StringIO()
        if not hasattr(self, 'cover_image') and self.cover_image is None:
            return None, None
        img = Image.open(self.cover_image)
        format = img.format
        img.save(img_io, format, quality=70)
        img_io.seek(0)
        return img_io, format

    def get_gallery_image(self, index):
        e_i = self.image_gallery[index]
        i = e_i.image
        img_io = cStringIO.StringIO()
        img = Image.open(i)
        format = img.format
        img.save(img_io, "JPEG", quality=70)
        img_io.seek(0)
        return img_io, format

    @property
    def gallery_size(self):
        return len([u for u in self.image_gallery if u.image is not None])

    def on_create(self):
        pass

    def add_cover_image(self, file):
        self.cover_image.put(file)
        self.save()

    def add_to_image_gallery(self, file):
        self.image_gallery.append(file)
        self.save()

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
        from app.models.streams import ActivityStream, Message, UserMessage
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
        elif name == MESSAGE: return  Message
        elif name == RELATIONSHIPS: return RelationShips
        elif name == PROFILE_TYPE: return ProfileType
        elif name == ADVERTISEMENT: return Advertisement
        else: return None

if __name__ == '__main__':
    print 'running models_init'
