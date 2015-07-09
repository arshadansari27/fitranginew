from app.models.relationships import RelationShips

__author__ = 'arshad'

from mongoengine import *
from app.models import update_content, Entity, db, new_object, Location
from activity import Activity
from adventure import Adventure
import datetime, hashlib, random
from ago import human
from flask import flash

class ProfileType(db.Document):
    name = db.StringField()

    def __unicode__(self): return self.name

class Verification(db.EmbeddedDocument):
    verification_link = db.StringField()
    expiration = db.DateTimeField()

    @classmethod
    def create_verification_link(self, profile):
        v = Verification()
        v.verification_link = "/email-verification/%s/%s" % (str(profile.id), str(hashlib.md5(str(random.randrange(000000000, 1000000000))).hexdigest()))
        v.expiration = datetime.datetime.now() + datetime.timedelta(days=2)
        return v

    def is_expired(self):
        return self.expiration <= datetime.datetime.now()

    def match(self, id, linkr):
        val = '/email-verification/%s/%s' % (id, linkr)
        print self.verification_link
        print val
        return self.verification_link ==  val

@new_object.apply
@update_content.apply
class Profile(Entity, db.Document, Location):
    featured = db.BooleanField(default=False)
    is_subscription_only = db.BooleanField(default=False)
    subscription_date = db.DateTimeField(default=datetime.datetime.now)
    email = db.StringField(unique=True)
    alternative_email = db.StringField()
    passwd = db.StringField()
    phone = db.StringField()
    alternative_phone = db.StringField()
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
    verification = db.EmbeddedDocumentField(Verification)
    is_social_login = db.BooleanField(default=False)
    uploaded_image_cover = db.BooleanField(default=False)
    public_activity_count = db.IntField(default=0)
    private_activity_count = db.IntField(default=0)
    owned_by = db.ReferenceField('Profile')
    managed_by = db.ListField(db.ReferenceField('Profile'))
    interest_in_activities = db.ListField(db.StringField())
    address = db.StringField()
    admin_approved = db.BooleanField(default=False)


    meta = {
        'indexes': [
            {'fields': ['email', 'slug', 'name'], 'unique': False, 'sparse': False, 'types': False },
        ],
    }

    def create_verification_link(self):
        self.verification = Verification.create_verification_link(self)
        self.save()
        return self.verification.verification_link

    @classmethod
    def verify_user(cls, id, linkr):
        profile = Profile.objects(pk=id).first()
        if profile.is_verified:
            flash('Already verified', category='warning')
            return True
        if profile.verification.is_expired() :
            return False
        elif not profile.verification.match(id, linkr):
            return False
        else:
            flash('Successfully verified.', category='success')
            profile.is_verified = True
            profile.save()
            return profile

    @property
    def is_admin(self):
        if not self.roles or len(self.roles) is 0:
            return False
        return 'Admin' in self.roles

    @property
    def is_admin_approved_business_profile(self):
        if hasattr(self, 'admin_approved') and self.admin_approved:
            return True
        return False

    def increment_public_activity_count(self):
        if not hasattr(self, 'public_activity_count'):
            self.public_activity_count = 0
        self.public_activity_count += 1
        self.save()

    def increment_private_activity_count(self):
        if not hasattr(self, 'private_activity_count'):
            self.private_activity_count = 0
        self.private_activity_count += 1
        self.save()

    @property
    def since(self):
        return human(self.user_since, precision=1)

    def __repr__(self):
        return self.name if self.name else (self.email if self.email else 'No name or email')

    def __unicode__(self):
        return self.__repr__()

    def __eq__(self, other):
        if not isinstance(other, Profile):
            return False
        return self.id == other.id

    def __hash__(self):
        return self.id.__hash__

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

    @property
    def interested_trip(self):
        from app.models.trip import Trip
        return [u for u in RelationShips.get_interested(self) if isinstance(u, Trip)]

    @property
    def interested_event(self):
        from app.models.event import Event
        return [u for u in RelationShips.get_interested(self) if isinstance(u, Event)]

    @property
    def joined_trip(self):
        from app.models.trip import Trip
        return [u for u in RelationShips.get_joined(self) if isinstance(u, Trip)]

    @property
    def joined_event(self):
        from app.models.event import Event
        return [u for u in RelationShips.get_joined(self) if isinstance(u, Event)]

    @property
    def managed_profiles(self):
        return Profile.objects(managed_by__in=[self.id]).all()

    @property
    def owned_profiles(self):
        return Profile.objects(owned_by=self.id).all()


PROFILE_TYPE_ENTHUSIAST = ProfileType.objects(name='Enthusiast').first()
PROFILE_TYPE_SUBSCRIPTION_ONLY = ProfileType.objects(name='Subscription Only').first()
PROFILE_TYPE_GEAR_DEALER = ProfileType.objects(name='Gear Dealer').first()
PROFILE_TYPE_ORGANISER = ProfileType.objects(name='Organizer').first()