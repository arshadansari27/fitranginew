from app.models.relationships import RelationShips

__author__ = 'arshad'

from mongoengine import *
from app.models import update_content, Entity, db, new_object
from activity import Activity
from adventure import Adventure
import datetime, hashlib
from ago import human

class ProfileType(db.Document):
    name = db.StringField()

    def __unicode__(self): return self.name

@new_object.apply
@update_content.apply
class Profile(Entity, db.Document):
    featured = db.BooleanField(default=False)
    is_subscription_only = db.BooleanField(default=False)
    subscription_date = db.DateTimeField(default=datetime.datetime.now)
    email = db.StringField(unique=True)
    passwd = db.StringField()
    location = db.ReferenceField('Location')
    location_typed = db.StringField()
    phone = db.StringField()
    website = db.StringField()
    facebook = db.StringField()
    twitter = db.StringField()
    google_plus = db.StringField()
    linked_in= db.StringField()
    youtube_channel = db.StringField()
    blog_channel = db.StringField()
    email_enabled = db.BooleanField()
    email_frequency = db.StringField(choices=(('daily', 'Daily'), ('weekly', 'Weekly'), ('fortnightly', 'Fortnightly'), ('monthly', 'Monthly')))
    user_since = db.DateTimeField(default=datetime.datetime.now)
    last_login = db.DateTimeField()
    adventures_done = db.ListField(db.ReferenceField('Adventure'))
    adventures_wishlist = db.ListField(db.ReferenceField('Adventure'))
    favorite_activities = db.ListField(db.ReferenceField('Activity'))
    bookmarks = db.ListField(db.ReferenceField('Article'))
    is_business_profile = db.BooleanField()
    roles = db.ListField(db.StringField(choices=(('Admin', 'Admin'), ('Content Manager', 'Content Manager'), ('Basic User', 'Basic User'), ('Service Provider', 'Service Provider'))))
    type = db.ListField(db.ReferenceField('ProfileType'))
    deactivated = db.BooleanField(default=False)
    is_verified = db.BooleanField(default=False)
    is_social_login = db.BooleanField(default=False)
    uploaded_image_cover = db.BooleanField(default=False)

    meta = {
        'indexes': [
            {'fields': ['email', 'slug', 'name'], 'unique': False, 'sparse': False, 'types': False },
        ],
    }

    @property
    def since(self):
        return human(self.user_since, precision=1)



    def __unicode__(self):
        return self.name if self.name else (self.email if self.email else 'No name or email')

    @property
    def password(self):
        return self.passwd

    @password.setter
    def password(self, new_val):
        self.passwd = hashlib.md5(new_val).hexdigest()

    def change_password(self, **kwargs):
        if kwargs['confirm'] == kwargs['password']:
            self.passwd = hashlib.md5(kwargs['password']).hexdigest()
            self.save()
        else:
            raise Exception('Invalid Password, do not match')

    @classmethod
    def create(cls, name, email, **kwargs):
        profile = Profile(name=name, email=email)
        for k, v in kwargs.iteritems():
            if hasattr(profile, k):
                setattr(profile, k, v)
        profile.save()
        return profile

    def update(self, key, value):
        setattr(self, key, value)
        self.save()
        return self

    def deactivate(self):
        self.deactivated = True
        self.save()

    @classmethod
    def authenticate(cls, email, password):
        if password is None or len(password) is 0:
            return False
        profile = Profile.objects(email__iexact=email).first()
        if profile and profile.password == hashlib.md5(password).hexdigest():
            if profile.user_since is None:
                profile.user_since = datetime.datetime.now()
            profile.save()
            return profile
        else:
            return False

    def update_last_login(self):
        self.last_login = datetime.datetime.now()
        self.save()

    @property
    def favorite_activities(self):
        return [u for u in RelationShips.get_favorites(self) if isinstance(u, Activity)]

    @property
    def followers(self):
        return [u for u in RelationShips.get_followed_by(self) if isinstance(u, Profile)]

    @property
    def following(self):
        return [u for u in RelationShips.get_following(self) if isinstance(u, Profile)]

    @property
    def wish_list_adventure(self):
        return [u for u in RelationShips.get_wish_listed(self) if isinstance(u, Adventure)]

    @property
    def wish_list_product(self):
        from app.models.store import Product
        return [u for u in RelationShips.get_wish_listed(self) if isinstance(u, Product)]

    @property
    def accomplished_adventure(self):
        return [u for u in RelationShips.get_accomplished(self) if isinstance(u, Adventure)]

    @property
    def bought_products(self):
        from app.models.store import Product
        return [u for u in RelationShips.get_accomplished(self) if isinstance(u, Product)]


