__author__ = 'arshad'
import datetime
import cStringIO
from PIL import Image as PImage
import mongoengine as db2
from mongoengine import Q

db2.connect('adventure2', host='localhost', port=27017)

class Image(db2.EmbeddedDocument):
    image = db2.ImageField(thumbnail_size=(100, 100, True))
    copyright = db2.StringField()

class File(db2. EmbeddedDocument):
    data = db2.FileField()
    copyright = db2.StringField()

class Comment(db2.EmbeddedDocument):
    key = db2.StringField()
    created_by = db2.ReferenceField('Profile', required=True)
    created_on = db2.DateTimeField(default=datetime.datetime.now, required=True)
    text = db2.StringField()
    keywords = db2.ListField(db2.StringField())


class Content(db2.Document):

    created_timestamp = db2.DateTimeField(default=datetime.datetime.now, required=True)
    modified_timestamp = db2.DateTimeField(default=datetime.datetime.now, required=True)
    created_by = db2.ReferenceField('Profile')
    title = db2.StringField()
    description = db2.StringField()
    text = db2.StringField()
    main_image = db2.EmbeddedDocumentField(Image)
    additional_images = db2.ListField(db2.EmbeddedDocumentField(Image))
    attachments = db2.ListField(db2.EmbeddedDocumentField(File))
    slug = db2.StringField()
    published = db2.BooleanField(default=False)
    published_timestamp = db2.DateTimeField(required=False)
    channels = db2.ListField(db2.StringField())
    facets = db2.ListField(db2.StringField())
    comments = db2.ListField(db2.EmbeddedDocumentField(Comment))
    parent = db2.ReferenceField('Content', required=False)
    keywords = db2.ListField(db2.StringField())
    location = db2.StringField()
    admin_published = db2.BooleanField(default=False)
    youtube_embed = db2.StringField()

    def get_image(self):
        if self and self.main_image:
            return self.main_image.image
        else:
            return None

    meta = {
        'allow_inheritance': True,
        'indexes': [
            {'fields': ['slug', 'title'], 'unique': False, 'sparse': False, 'types': False },
        ],
    }


class Answer(db2.EmbeddedDocument):

    up_votes = db2.IntField()
    down_votes = db2.IntField()
    author = db2.ReferenceField('Profile')
    answer = db2.StringField()

class Question(Content):
    answers = db2.ListField(db2.EmbeddedDocumentField(Answer))

class Post(Content):
    likes = db2.ListField(db2.ReferenceField('Profile'))
    dislikes = db2.ListField(db2.ReferenceField('Profile'))

class Profile(Content):
    name = db2.StringField()
    username = db2.StringField()
    password = db2.StringField()
    email = db2.StringField()
    phone = db2.StringField()
    address = db2.StringField()
    is_social_login = db2.BooleanField(default=False)
    following = db2.ListField(db2.ReferenceField('Profile'))
    follower = db2.ListField(db2.ReferenceField('Profile'))
    favorites = db2.ListField(db2.ReferenceField('Profile'))
    favorited_by = db2.ListField(db2.ReferenceField('Profile'))
    blogs = db2.ListField(db2.ReferenceField('Content'))
    questions = db2.ListField(db2.ReferenceField('Content'))
    answers = db2.ListField(db2.ReferenceField('Content'))
    is_verified = db2.BooleanField('Verified')
    roles = db2.ListField(db2.StringField())
    facebook = db2.StringField()
    linkedin = db2.StringField()
    website = db2.StringField()


class Event(Content):
    event_type = db2.StringField()
    start_date = db2.StringField()
    end_date = db2.StringField()
    duration = db2.StringField()
    experiences = db2.StringField()
    organiser = db2.ReferenceField('Profile')
    amount = db2.StringField()
    contact = db2.StringField()
    location = db2.StringField()
    source = db2.StringField()
    destination = db2.StringField()
    features = db2.StringField()
    important_notes = db2.StringField()
    links = db2.StringField()



class Product(Content):
    price = db2.FloatField()
    discount = db2.FloatField(required=False)


class Tag(db2.Document):

    name = db2.StringField()

class Message(db2.Document):
    created_timestamp = db2.DateTimeField(default=datetime.datetime.now, required=True)
    created_by = db2.ReferenceField('Profile')
    created_for = db2.ReferenceField('Profile')
    message = db2.StringField()


    meta = {
        'allow_inheritance': True,
    }

class UserMessage(Message): pass # Can be anonymous
class SubscriptionMessage(Message): pass # Can be anonymous
class Notification(Message): pass # Can be system generated



class Advertisement(db2.Document):
    created_timestamp = db2.DateTimeField(default=datetime.datetime.now, required=True)
    modified_timestamp = db2.DateTimeField(default=datetime.datetime.now, required=True)
    created_by = db2.ReferenceField('Profile')
    title = db2.StringField()
    description = db2.StringField()
    url = db2.StringField()
    main_image = db2.EmbeddedDocumentField(Image)
    long_image = db2.EmbeddedDocumentField(Image)
    published = db2.BooleanField()
    published_timestamp = db2.DateTimeField(required=False)
    placements = db2.ListField(db2.StringField())

    def get_image(self, long=False):
        if self and self.main_image and not long:
            img = self.main_image
        elif self and self.long_image and long:
            img = self.long_image
        else:
            return None, None

        img_io = cStringIO.StringIO()
        img = PImage.open(img.image)
        format = self.main_image.image.format
        img.save(img_io, "JPEG", quality=70)
        img_io.seek(0)
        return img_io, format

def save_cover_image(image, obj):
    img_io = cStringIO.StringIO()
    img = PImage.open(image)
    format = image.format
    img.save(img_io, "JPEG", quality=70)
    img_io.seek(0)
    obj.cover_image.put(img_io) #, format)


def createProfileType(type):
    from app.models.profile import Profile as newProfile, ProfileType as newProfileType
    if newProfileType.objects(name__iexact=type).first() is not None:
        return
    ptype = newProfileType(name=type)
    ptype.save()

def create_subscription_profile(a):
    from app.models.profile import Profile as newProfile, ProfileType as newProfileType
    if len(a.message.strip()) is 0:
        print 'Invalid message, skipping'
        return
    if newProfile.objects(email__iexact=a.message).first() is not None or Profile.objects(email__iexact=a.message).first() is not None:
        print 'Profile seems to exists, so not to subscription for ', a.message
        return

    ptype = newProfileType.objects(name__iexact='Subscription Only').first()
    p = newProfile(is_subscription_only=True, email=a.message)
    p.type = [ptype]
    p.save()
    print 'Created subscription %s' % (a.message)

def create_profile(a, profile_types):
    from app.models.profile import Profile as newProfile, ProfileType as newProfileType
    ptype = newProfileType.objects(name__in=profile_types).first()
    roles = []
    if 'Admin' in a.roles:
        roles.append('Admin')
    if 'Organizer' in profile_types or 'Gear Dealer' in profile_types:
        roles.append('Service Provider')
        is_business_profile = True
    else:
        is_business_profile = False
    roles.append('Basic User')
    if hasattr(a, 'main_image') and a.main_image and a.main_image.image:
        cover_image = a.main_image.image
    else:
        cover_image = None
    size = newProfile.objects(email__iexact=a.name).count()
    if size>0:
        b = newProfile.objects(name__exact=a.name).first()
        b.name, b.email, b.cover_image, b.is_business_profile = a.name, a.email, cover_image, False
        b.website, b.facebook, b.linked_in, b.type = a.website, a.facebook, a.linkedin, [ptype]
        b.roles, b.phone, b.about = roles, a.phone, a.description
        b.is_subscription_only = False
        print count, 'Updating Profile', b.name
    else:
        p = newProfile(name=a.name, email=a.email, is_business_profile=is_business_profile,
                website=a.website, facebook=a.facebook, linked_in=a.linkedin, type=[ptype],
                roles=roles, phone=a.phone)
        b = p
        print count, 'Creating Profile', b.name
    if b and cover_image:
        save_cover_image(cover_image, b)
    if a.password:
        b.password = a.password
    try:
        b.save()
    except Exception, e:
        print str(e), 'Unable to save', b.name

def create_adventure(a):
    from app.models.adventure import Adventure as newAdventure
    if newAdventure.objects(name=a.title).first() is not None:
        return
    if hasattr(a, 'main_image') and a.main_image and a.main_image.image:
        cover_image = a.main_image.image
    else:
        cover_image = None
    adventure = newAdventure(name=a.title, about=a.text, description=a.description)
    if adventure and cover_image:
        save_cover_image(cover_image, adventure)
    adventure.save()
    print count, 'Creating Adventure', adventure.name


def create_activity(a):
    from app.models.activity import Activity as newActivity
    if newActivity.objects(name=a.title).first() is not None:
        return
    if hasattr(a, 'main_image') and a.main_image and a.main_image.image:
        cover_image = a.main_image.image
    else:
        cover_image = None
    activity = newActivity(name=a.title, about=a.text, description=a.description)
    if activity and cover_image:
        save_cover_image(cover_image, activity)
    activity.save()
    print count, 'Creating Activity', activity.name


def create_article(a):
    from app.models.profile import Profile as newProfile, ProfileType as newProfileType
    from app.models.content import (Article as newArticle, Post as newPost)
    if newArticle.objects(title=a.title).first() is not None:
        return

    if hasattr(a, 'main_image') and a.main_image and a.main_image.image:
        cover_image = a.main_image.image
    article = newArticle(title=a.title, content=a.text, description=a.description)
    author = Profile.objects(pk=a.created_by.id).first()
    print 'Article author', author.email
    article.author = newProfile.objects(email__iexact=author.email).first()
    for c in a.comments:
        c_author = Profile.objects(pk=c.created_by.id).first()
        nc = newPost(author=newProfile.objects(email__iexact=c_author.email).first(), created_timestamp=c.created_on, modified_timestamp=c.created_on, content=c.text)
        nc.save()
        article.comments.append(nc)
    if article and cover_image:
        save_cover_image(cover_image, article)
    article.save()
    print count, 'Creating Article', article.title

def create_discussion(a):
    from app.models.profile import Profile as newProfile, ProfileType as newProfileType
    from app.models.content import (Discussion as newDiscussion,
                                    Tag as newTag,
                                    Post as newPost)
    if newDiscussion.objects(title=a.title).first() is not None:
        return
    if hasattr(a, 'main_image') and a.main_image and a.main_image.image:
        cover_image = a.main_image.image
    else:
        cover_image = None
    discussion = newDiscussion(title=a.title, content=a.text, description=a.description)
    author = Profile.objects(pk=a.created_by.id).first()
    discussion.author = newProfile.objects(pk=author.id).first()

    if hasattr(discussion, 'facets') and discussion.tags:
        tags = a.facets
        tags_ref = [newTag.objects(name=t).first() for t in tags]
        discussion.tag_refs = tags_ref
    print 'Dicussion author', author.email, '->', discussion.author
    for c in a.comments:
        c_author = Profile.objects(pk=c.created_by.id).first()
        nc = newPost(author=newProfile.objects(email__iexact=c_author.email).first(), created_timestamp=c.created_on, modified_timestamp=c.created_on, content=c.text)
        nc.save()
        discussion.comments.append(nc)
    if discussion and cover_image:
        save_cover_image(cover_image, discussion)
    discussion.save()
    print count, 'Creating Discussion', discussion.title

def create_post(a):
    from app.models.profile import Profile as newProfile, ProfileType as newProfileType
    from app.models.content import (Post as newPost, Comment as newComment)
    if hasattr(a, 'main_image') and a.main_image and a.main_image.image:
        cover_image = a.main_image.image
    else:
        cover_image = None
    post = newPost(content=a.text, description=a.description)
    author = Profile.objects(pk=a.created_by.id).first()
    post.author = newProfile.objects(email__iexact=author.email).first()
    for c in a.comments:
        c_author = Profile.objects(pk=c.created_by.id).first()
        comment = newComment(author=newProfile.objects(email__iexact=c_author.email).first(), created_timestamp=c.created_on, modified_timestamp=c.created_on, content=c.text)
        post.comments.append(comment)
    if post and cover_image:
        save_cover_image(cover_image, post)
    post.save()
    print count, 'Creating Posts', post.content

def create_event(a):
    from app.models.event import Event as newEvent
    if newEvent.objects(name=a.title).first() is not None:
        return
    if hasattr(a, 'main_image') and a.main_image and a.main_image.image:
        cover_image = a.main_image.image
    else:
        cover_image = None
    event = newEvent(title=a.title, description=a.description, about=a.text)
    if a.organiser:
        organizer = Profile.objects(pk=a.organiser.id).first()
        event.organizer = organizer
    if event and cover_image:
        save_cover_image(cover_image, event)
    event.save()

def create_trip(a):
    from app.models.trip import Trip as newTrip
    if newTrip.objects(name=a.title).first() is not None:
        return
    if hasattr(a, 'main_image') and a.main_image and a.main_image.image:
        cover_image = a.main_image.image
    else:
        cover_image = None
    trip = newTrip(title=a.title, description=a.description, about=a.text)
    if a.organiser:
        organizer = Profile.objects(pk=a.organiser.id).first()
        trip.organizer = organizer
    if trip and cover_image:
        save_cover_image(cover_image, trip)
    trip.save()

def create_tag(a):
    from app.models.content import Tag as newTag
    if newTag.objects(name__iexact=a.name).first() is not None:
        return
    tag = newTag(name=a.name)
    tag.save()


if __name__ == '__main__':


    for a in ['Enthusiast', 'Gear Dealer', 'Organizer', 'Subscription Only']:
        createProfileType(a)

    print '*' * 100
    print 'Tags:', Tag.objects.count()
    for a in Tag.objects.all():
        create_tag(a)


    print '*' * 100
    print "Subscription Counts:", SubscriptionMessage.objects.count()
    count = 0
    for a in SubscriptionMessage.objects.all():
        count += 1
        create_subscription_profile(a)
        print count, a.message

    print '*' * 100
    print "Profiles Enthusiast:", Profile.objects(facets__in=['Enthusiast', 'Enthusiasts']).count()
    count = 0
    for a in Profile.objects(facets__in=['Enthusiast', 'Enthusiasts']).all():
        count += 1
        create_profile(a, profile_types=['Enthusiast', 'Enthusiasts'])
        print count, a.name

    print "Profiles Organizer:", Profile.objects(facets__in=['Organizer']).count()
    count = 0
    for a in Profile.objects(facets__in=['Organizer']).all():
        count += 1
        create_profile(a, profile_types=['Organizer'])
        print count, a.name

    print "Profiles Gear Dealer:", Profile.objects(facets__in=['Gear Dealer']).count()
    count = 0
    for a in Profile.objects(facets__in=['Gear Dealer']).all():
        count += 1
        create_profile(a, profile_types=['Gear Dealer'])
        print count, a.name

    print '*' * 100
    print "Activities:", Content.objects(facets='Activity').count()
    count = 0
    for a in Content.objects(facets='Activity').all():
        count += 1
        create_activity(a)
        print count, a.title


    print '*' * 100
    print "Destination:", Content.objects(channels__in=['Destinations', 'Destination']).count()
    count = 0
    for a in Content.objects(channels__in=['Destinations', 'Destination']).all():
        count += 1
        create_adventure(a)
        print count, a.title


    print '*' * 100
    print "Article:", Content.objects(facets='Article').count()
    count = 0
    for a in Content.objects(facets='Article').all():
        count += 1
        create_article(a)
        print count, a.title


    print '*' * 100
    print "Forum Question:", Question.objects.count()
    count = 0
    for a in Question.objects().all():
        count += 1
        create_discussion(a)


    print '*' * 100
    count = 0
    print "Posts:", Post.objects.count()
    for a in Post.objects.all():
        count += 1
        create_post(a)

    print '*' * 100
    print "Event:", Event.objects(channels__nin=['Adventure Trip']).count()
    for a in Event.objects(channels__nin=['Adventure Trip']).all():
        create_event(a)

    print "Event Adventure Trips:", Event.objects(channels__in=['Adventure Trip']).count()
    for a in Event.objects(channels__in=['Adventure Trip']).all():
        create_trip(a)

    print '*' * 100
    print "Products:", Product.objects.count()


    print '*' * 100
    print 'Advertisement:', Advertisement.objects.count()

