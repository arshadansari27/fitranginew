from flask.ext.mongoengine import MongoEngine
from app.config import configuration
import datetime
from app import db

class Configuration(object):

    def __init__(self, **kwargs):
        for k, v in kwargs.iteritems():
            setattr(self, k,  v)

    @property
    def id(self):
        return self.name

    @classmethod
    def load_from_configuration(cls, name):
        for k, v in configuration[name].iteritems():
            _dict = v
            _dict['name'] = k
            obj = cls(**_dict)
            cls.all_data().append(obj)

    @classmethod
    def getByName(cls, _name):
        for obj in cls.all_data():
            if obj.name != _name:
                continue
            return obj
        return None

class Channel(Configuration):
    all_data_channel = []
   
    @classmethod
    def all_data(cls):
        return cls.all_data_channel

    @classmethod
    def load_channels(cls):
        cls.load_from_configuration('DEFAULT_CHANNELS')

    @classmethod
    def getByAlias(cls, alias):
        channel_name = None
        if alias == 'ACTIVITY':
            channel_name = 'Activity'
        elif alias == 'DESTINATION':
            channel_name = 'Destination'
        elif alias == 'ARTICLE':
            channel_name = 'Article'
        elif alias == 'ORGANISER':
            channel_name = 'Profile'
        elif alias == 'DEALER':
            channel_name = 'Profile'
        else:
            raise Exception("Invalid Alias")
        return cls.getByName(channel_name)

    def has_sub_type(self, subtype):
        for u in self.subtypes:
            if subtype.lower().strip() == u.lower():
                return u
        return False

    def has_facet(self, facet):
        for f in self.facets.values():
            if len(f) is 0:
                continue
            for u in f:
                if facet.lower().strip() == u.lower():
                    return u
        return False

    def getTypeByAlias(self, alias):
        channel_name = None
        if alias == 'ACTIVITY':
            channel_name = 'Activity'
        elif alias == 'DESTINATION':
            channel_name = 'Destination'
        elif alias == 'ARTICLE':
            channel_name = 'Article'
        elif alias == 'ORGANISER':
            channel_name = 'Organizer'
        elif alias == 'DEALER':
            channel_name = 'Gear Dealer'
        else:
            raise Exception("Invalid Alias")
        return channel_name

class Role(Configuration):

    all_data_role = []

    @classmethod
    def all_data(cls):
        return cls.all_data_role

    @classmethod
    def load_roles(cls):
        cls.load_from_configuration('DEFAULT_ROLES')

class Node(object):

    def get_class_name(self):
        return self.__class__.__name__

    @classmethod
    def model_factory(cls, name):
        if name == 'role':
            return Role
        elif name == 'profile':
            return Profile
        elif name == 'channel': 
            return Channel
        elif name == 'content': 
            return Content 
        elif  name == 'event': 
            return Event 
        elif name == 'product': 
            return Product
        else:
            raise Exception("Unknown type")

    def __unicode__(self):
        if getattr(self, 'name') is not None:
            return self.name
        else:
            return self.title

    @classmethod
    def channel_factory(cls, model):
        for channel in Channel.all_data():
            if channel.model == model.__class__.__name__:
                return channel.name
        raise Exception("Unset Channel for this model type %s %s" % (model.__class__.__name__, str(model)))
    
    def update_existing(self, **kwargs):
        for k, v in kwargs.iteritems():
            if hasattr(self, k):
                setattr(self, k, v)
        self.save()
        return self

    def upload_image(self, image):
        self.main_image = Image(image=image)
        self.save()
        return self
        

class Image(db.EmbeddedDocument):
    image = db.ImageField(thumbnail_size=(100, 100, True))
    copyright = db.StringField()

class File(db. EmbeddedDocument):
    data = db.FileField()
    copyright = db.StringField()

class Comment(db.EmbeddedDocument):
    created_by = db.ReferenceField('Profile', required=True)
    text = db.StringField()
    keywords = db.ListField(db.StringField())
    
    def __unicode__(self): return "%s..." % self.text[0: 30 if len(self.text) > 10 else len(self.text)] 

class Content(Node, db.Document):
    __template__ = 'model/content/'
    created_timestamp = db.DateTimeField(default=datetime.datetime.now, required=True)
    modified_timestamp = db.DateTimeField(default=datetime.datetime.now, required=True)
    created_by = db.ReferenceField('Profile')
    title = db.StringField()
    description = db.StringField()
    text = db.StringField()
    main_image = db.EmbeddedDocumentField(Image)
    additional_images = db.ListField(db.EmbeddedDocumentField(Image))
    attachements = db.ListField(db.EmbeddedDocumentField(File))
    slug = db.StringField()
    published = db.BooleanField()
    published_timestamp = db.DateTimeField(required=False)
    website = db.StringField()
    channels = db.ListField(db.StringField())
    comments = db.ListField(db.EmbeddedDocumentField(Comment))
    parent = db.ReferenceField('Content', required=False)
    keywords = db.ListField(db.StringField())
    facebook = db.StringField()
    linkedin = db.StringField()
    
    def get_image(self):
        return self.main_image.image
    
    meta = {
        'allow_inheritance': True,
        'indexes': [
            {'fields': ['title'], 'unique': True, 'sparse': True, 'types': False },
        ],
    }

    def __unicode__(self): return "%s..." % self.title

    @classmethod
    def addComment(cls, content_key, comment_text, author_key):
        author = Profile.objects(pk=author_key).first()
        content = Content.objects(pk=content_key).first()
        comment = Comment(created_by=author, text=comment_text)
        content.comments.append(comment)
        content.save()


class Profile(Content):
    __template__ = 'model/profile/'
    name = db.StringField()
    username = db.StringField()
    password = db.StringField()
    email = db.StringField()
    phone = db.StringField()
    address = db.StringField()
    following = db.ListField(db.ReferenceField('Profile'))
    follower = db.ListField(db.ReferenceField('Profile'))
    blogs = db.ListField(db.ReferenceField('Content'))
    questions = db.ListField(db.ReferenceField('Content'))
    answers = db.ListField(db.ReferenceField('Content'))
    is_verified = db.BooleanField('Verified')
    roles = db.ListField(db.StringField())
    
    def __unicode__(self): return self.name

    def change_password(self, **kwargs):
        if kwargs['confirm'] == kwargs['password']:
            self.password = kwargs['password']
            self.save()
        else:
            raise Exception('Invalid Password, do not match')

    @classmethod
    def authenticate(cls, email_or_username,  password):
        collection = Profile._get_collection()
        query = {'$and': [{'$or': [{'email': email_or_username}, {'username': email_or_username}]}, {'password': password}]}
        values = list(collection.find(query))
        if len(values) > 0:
            p = Profile()
            for k, v in values[0].iteritems():
                p.__dict__[k] = values[0][k]
            return p
        return False

    @classmethod
    def create_new(cls, name, email, password, is_verified=False, roles=['Enthusiast']):
        profile = Profile(name=name, email=email, password=password, is_verified=is_verified, roles=roles)
        profile.save()
        return profile


class Event(Content):
    __template__ = 'model/event/'
    start_timestamp = db.DateTimeField()
    end_timestamp = db.DateTimeField()
    additional_info = db.DictField()
    
class Product(Content):
    __template__ = 'model/product/'
    price = db.FloatField()
    discount = db.FloatField(required=False)
