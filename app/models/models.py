import datetime
import random



class Configuration(object):

    @property
    def id(self):
        return self.name

    @classmethod
    def load_from_configuration(cls):
        from app.utils.general import get_channels, get_facets, get_roles
        data1 = get_facets()
        for d in data1:
            f = Facet(d['name'], d['parent'])
            Facet.all_facets.append(f)

        data2 = get_channels()
        for d in data2:
            c = Channel(d['name'], d['type'], d['menu'], d['value'], d.get('template', None), d.get('menu_link', None))
            Channel.all_data.append(c)

        data3 = get_roles()
        for d in data3:
            r = Role(d['name'], d['value'])
            Role.all_data_role.append(r)



class Facet(object):
    all_facets = []

    def __init__(self, name, parent):
        self.name = name
        self.parent = parent

    def __repr__(self):
        return "%s [%s] " % (self.name, self.parent)

    @classmethod
    def get_facet_by_name(cls, _name):
        for f in Facet.all_facets:
            if f.name.lower() == _name.lower():
                return f
        return None

    @classmethod
    def find(cls, name):
        return cls.get_facet_by_name(name)

    @classmethod
    def get_facet_by_type(cls, _type):
        facets = []
        for f in Facet.all_facets:
            if f.type.lower() == _type.lower():
                facets.append(f)
        return facets

class Channel(object):
    all_data= []

    def __init__(self, name, parent, menu, display, template, menu_link):
        self.name = name
        self.parent = parent
        self.menu = menu
        self.display = display
        self.template = template
        self.menu_link = menu_link

    def __repr__(self):
        return self.name

    @classmethod
    def getByName(cls, _name):
        for obj in cls.all_data:
            if obj.name != _name:
                continue
            return obj
        return None

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
        for u in Channel.all_data:
            if self.name.lower().strip() == u.type.lower().strip():
                return True
        return False

    def getTypeByAlias(self, alias):
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

    def __init__(self, name, value):
        self.name = name
        self.value = value

    def __repr__(self): return self.value

class Node(object):

    def get_class_name(self):
        return self.__class__.__name__

    @classmethod
    def model_factory(cls, name):
        if name == 'Role':
            return Role
        elif name == 'Profile':
            return Profile
        elif name == 'Channel':
            return Channel
        elif name in ['Activity', 'Destination', 'Article', 'Content']:
            return Content 
        elif  name in ['Event', 'Adventure Trip']:
            return Event 
        elif name == 'Product':
            return Product
        elif name in ['Question', 'Forum']:
            return Question
        else:
            raise Exception("Unknown type")

    def __unicode__(self):
        if getattr(self, 'name') is not None:
            return self.name
        else:
            return self.title

    @classmethod
    def channel_factory(cls, model):
        for channel in Channel.all_data:
            if channel.name in model.channels:
                return channel.name
        raise Exception("Unset Channel for this model type %s %s" % (model.__class__.__name__, str(model)))


    def add_new(self, owner, **kwargs):
        self.set_values(True, **kwargs)
        self.created_timestamp = datetime.datetime.now()
        self.created_by = owner
        self.published = True
        self.published_timestamp = datetime.datetime.now()
        self.save()
        return self

    def update_existing(self, **kwargs):
        self.set_values(False, **kwargs)
        self.save()
        print self.id
        return self

    def set_values(self, is_new, **kwargs):
        for k, v in kwargs.iteritems():
            if k.endswith('_ref'):
                continue
            if k.endswith('_display'):
                _k = k.replace('_display', '_ref')
                if _k and kwargs.has_key(_k) and kwargs.get(_k, False):
                    v = Content.get_by_id(kwargs[_k])
                else:
                    continue
            setattr(self, k, v)


    def upload_image(self, image):
        self.main_image = Image(image=image)
        self.save()
        return self


from app import db

class Image(db.EmbeddedDocument):
    image = db.ImageField(thumbnail_size=(100, 100, True))
    copyright = db.StringField()

class File(db. EmbeddedDocument):
    data = db.FileField()
    copyright = db.StringField()

class Comment(db.EmbeddedDocument):
    key = db.StringField()
    created_by = db.ReferenceField('Profile', required=True)
    created_on = db.DateTimeField(default=datetime.datetime.now, required=True)
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
    attachments = db.ListField(db.EmbeddedDocumentField(File))
    slug = db.StringField()
    published = db.BooleanField()
    published_timestamp = db.DateTimeField(required=False)
    channels = db.ListField(db.StringField())
    facets = db.ListField(db.StringField())
    comments = db.ListField(db.EmbeddedDocumentField(Comment))
    parent = db.ReferenceField('Content', required=False)
    keywords = db.ListField(db.StringField())

    @classmethod
    def get_by_id(cls, id):
        return Content.objects(pk=id).first()
    
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
        r = random.randint(1111111, 9999998999)
        comment = Comment(created_by=author, text=comment_text, key="%s-%d" % (str(content.id), r))
        content.comments.append(comment)
        content.save()

class Answer(db.EmbeddedDocument):

    up_votes = db.IntField()
    down_votes = db.IntField()
    author = db.ReferenceField('Profile')
    answer = db.StringField()

class Question(Content):
    __template__ = 'model/forum/'
    answers = db.ListField(db.EmbeddedDocumentField(Answer))

    def __unicode__(self): return self.title


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
    facebook = db.StringField()
    linkedin = db.StringField()
    website = db.StringField()

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
    date = db.StringField()
    duration = db.StringField()
    experiences = db.StringField()
    organiser = db.ReferenceField('Profile')
    amount = db.StringField()
    contact = db.StringField()
    location = db.StringField()
    features = db.StringField()
    important_notes = db.StringField()
    links = db.StringField()


class Product(Content):
    __template__ = 'model/product/'
    price = db.FloatField()
    discount = db.FloatField(required=False)


Configuration.load_from_configuration()

if __name__ == '__main__':
    print 'Test Models'
