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

if __name__ == '__main__':

    from app.models.profile import Profile as newProfile, ProfileType as newProfileType
    from app.models.event import Event as newEvent
    from app.models.activity import Activity as newActivity
    from app.models.content import (Article as newArticle,
                                    Tag as newTag,
                                    Post as newPost,
                                    Blog as newBlog,
                                    Discussion as newDiscussion,
                                    Comment as newComment)
    from app.models.trip import Trip as newTrip
    from app.models.store import Product as newProduct
    from app.models.adventure import Adventure as newAdventure

    for a in ['Enthusiast', 'Gear Dealer', 'Organizer', 'Subscription Only']:
        if newProfileType.objects(name__iexact=a).first() is not None:
            print a, 'exists, moving on '
            continue
        ptype = newProfileType(name=a)
        ptype.save()
        print 'Creating profile type', ptype

    print '*' * 100
    print "Subscription Counts:", SubscriptionMessage.objects.count()
    count = 0
    print '*' * 100
    for a in SubscriptionMessage.objects.all():
        count += 1
        print 'Subscription: ', count
        if len(a.message.strip()) is 0:
            print 'Invalid message, skipping'
            continue
        if newProfile.objects(email__iexact=a.message).first() is not None or Profile.objects(email__iexact=a.message).first() is not None:
            print 'Profile seems to exists, so not to subscription for ', a.message
            continue

        ptype = newProfileType.objects(name__iexact='Subscription Only').first()
        print 'Applying %s to %s' % (ptype.name, a.message)
        p = newProfile(is_subscription_only=True, email=a.message)
        p.type = [ptype]
        p.save()

    print '*' * 100
    print "Profiles Enthusiast:", Profile.objects(facets__in=['Enthusiast', 'Enthusiasts']).count()
    ptype = newProfileType.objects(name__iexact='Enthusiast').first()
    count = 0
    for a in Profile.objects(facets__in=['Enthusiast', 'Enthusiasts']).all():
        count += 1
        if 'Admin' in a.roles:
            role = 'Admin'
        else:
            role = 'Basic User'
        if hasattr(a, 'main_image') and a.main_image and a.main_image.image:
            cover_image = a.main_image.image
        else:
            cover_image = None
        size = newProfile.objects(email__iexact=a.name).count()
        if size>0:
            b = newProfile.objects(name__exact=a.name).first()
            b.name, b.email, b.cover_image, b.is_business_profile = a.name, a.email, cover_image, False
            b.website, b.facebook, b.linked_in, b.type = a.website, a.facebook, a.linkedin, [ptype]
            b.roles, b.phone, b.about = [role], a.phone, a.description
            b.is_subscription_only = False
            print count, 'Updating Profile', b.name
        else:
            p = newProfile(name=a.name, email=a.email, cover_image=cover_image,
                       website=a.website, facebook=a.facebook, linked_in=a.linkedin, type=[ptype],
                       roles=[role], phone=a.phone)
            b = p
            print count, 'Creating Profile', b.name
        if a.password:
            b.password = a.password
        try:
            b.save()
        except Exception, e:
            print str(e), 'Unable to save', b.name

    print "Profiles Organizer:", Profile.objects(facets__in=['Organizer']).count()
    ptype = newProfileType.objects(name__iexact='Organizer').first()
    count = 0
    for a in Profile.objects(facets__in=['Organizer']).all():
        count += 1
        if 'Admin' in a.roles:
            role = 'Admin'
        else:
            role = 'Service Provider'
        if hasattr(a, 'main_image') and a.main_image and a.main_image.image:
            cover_image = a.main_image.image
        else:
            cover_image = None
        print 'Trying', a.name
        size = newProfile.objects(name__exact=a.name).count()
        if size > 0:
            b = newProfile.objects(name__exact=a.name).first()
            b.name, b.email, b.cover_image, b.is_business_profile = a.name, a.email, cover_image, True
            b.website, b.facebook, b.linked_in, b.type = a.website, a.facebook, a.linkedin, [ptype]
            b.roles, b.phone, b.about = [role, 'Basic User'], a.phone, a.description
            b.is_subscription_only = False
            print count, 'Updating Profile', b.name
        else:
            p = newProfile(name=a.name, email=a.email, cover_image=cover_image, is_business_profile=True,
                       website=a.website, facebook=a.facebook, linked_in=a.linkedin, type=[ptype],
                       roles=[role, 'Basic User'], phone=a.phone, about=a.description)
            b = p
            print count, 'Creating Profile', b.name
        if a.password:
            b.password = a.password
        try:
            b.save()
        except Exception, e:
            print str(e), 'Unable to save', b.name

    print "Profiles Gear Dealer:", Profile.objects(facets__in=['Gear Dealer']).count()
    ptype = newProfileType.objects(name__iexact='Gear Dealer').first()
    count = 0
    for a in Profile.objects(facets__in=['Gear Dealer']).all():
        count += 1
        if 'Admin' in a.roles:
            role = 'Admin'
        else:
            role = 'Service Provider'
        if hasattr(a, 'main_image') and a.main_image and a.main_image.image:
            cover_image = a.main_image.image
        else:
            cover_image = None
        size = newProfile.objects(name__iexact=a.name).count()
        if size>0:
            b = newProfile.objects(name__iexact=a.name).first()
            b.name, b.email, b.cover_image, b.is_business_profile = a.name, a.email, cover_image, True
            b.website, b.facebook, b.linked_in, b.type = a.website, a.facebook, a.linkedin, [ptype]
            b.roles, b.phone, b.about = [role, 'Basic User'], a.phone, a.description
            b.is_subscription_only = False
            print count, 'Updating Profile', b.name
        else:
            p = newProfile(name=a.name, email=a.email, cover_image=cover_image, is_business_profile=True,
                       website=a.website, facebook=a.facebook, linked_in=a.linkedin, type=[ptype],
                       roles=[role, 'Basic User'], phone=a.phone, about=a.description)
            b = p
            print count, 'Creating Profile', b.name
        if a.password:
            b.password = a.password
        try:
            b.save()
        except Exception, e:
            print str(e), 'Unable to save', b.name


    print '*' * 100
    print "Activities:", Content.objects(facets='Activity').count()
    count = 0
    for a in Content.objects(facets='Activity').all():
        count += 1
        if newActivity.objects(name=a.title).first() is not None:
            continue
        if hasattr(a, 'main_image') and a.main_image and a.main_image.image:
            cover_image = a.main_image.image
        else:
            cover_image = None
        activity = newActivity(name=a.title, about=a.text, cover_image=cover_image, description=a.description)
        activity.save()
        print count, 'Creating Activity', activity.name



    print '*' * 100
    print "Destination:", Content.objects(channels__in=['Destinations', 'Destination']).count()
    count = 0
    for a in Content.objects(channels__in=['Destinations', 'Destination']).all():
        count += 1
        if newAdventure.objects(name=a.title).first() is not None:
            continue
        if hasattr(a, 'main_image') and a.main_image and a.main_image.image:
            cover_image = a.main_image.image
        else:
            cover_image = None
        adventure = newAdventure(name=a.title, about=a.text, cover_image=cover_image, description=a.description)
        adventure.save()
        print count, 'Creating Adventure', adventure.name


    print '*' * 100
    print "Article:", Content.objects(facets='Article').count()
    count = 0
    for a in Content.objects(facets='Article').all():
        count += 1
        if newArticle.objects(title=a.title).first() is not None:
            continue

        if hasattr(a, 'main_image') and a.main_image and a.main_image.image:
            cover_image = a.main_image.image
        else:
            cover_image = None
        article = newArticle(title=a.title, content=a.text, cover_image=cover_image, description=a.description)
        author = Profile.objects(pk=a.created_by.id).first()
        print 'Article author', author.email
        article.author = newProfile.objects(email__iexact=author.email).first()
        for c in a.comments:
            c_author = Profile.objects(pk=c.created_by.id).first()
            nc = newComment(author=newProfile.objects(email__iexact=c_author.email).first(), created_timestamp=c.created_on, content=c.text)
            article.comments.append(nc)
        article.save()
        print count, 'Creating Article', article.title


    print '*' * 100
    print "Forum Question:", Question.objects.count()
    count = 0
    for a in Question.objects().all():
        count += 1
        if newDiscussion.objects(title=a.title).first() is not None:
            continue
        if hasattr(a, 'main_image') and a.main_image and a.main_image.image:
            cover_image = a.main_image.image
        else:
            cover_image = None
        discussion = newDiscussion(title=a.title, content=a.text, cover_image=cover_image, description=a.description)
        author = Profile.objects(pk=a.created_by.id).first()
        discussion.author = newProfile.objects(pk=author.id).first()
        print 'Dicussion author', author.email, '->', discussion.author
        for c in a.comments:
            c_author = Profile.objects(pk=c.created_by.id).first()
            nc = newComment(author=newProfile.objects(email__iexact=c_author.email).first(), created_timestamp=c.created_on, content=c.text)
            discussion.comments.append(nc)
        discussion.save()
        print count, 'Creating Discussion', discussion.title


    print '*' * 100
    count = 0
    print "Posts:", Post.objects.count()
    for a in Post.objects.all():
        count += 1
        if newPost.objects(title=a.title).first() is not None:
            continue
        if hasattr(a, 'main_image') and a.main_image and a.main_image.image:
            cover_image = a.main_image.image
        else:
            cover_image = None
        post = newPost(title=a.title, content=a.text, cover_image=cover_image, description=a.description)
        author = Profile.objects(pk=a.created_by.id).first()
        post.author = newProfile.objects(email__iexact=author.email).first()
        for c in a.comments:
            c_author = Profile.objects(pk=c.created_by.id).first()
            nc = newComment(author=newProfile.objects(email__iexact=c_author.email).first(), created_timestamp=c.created_on, content=c.text)
            post.comments.append(nc)
        post.save()
        print count, 'Creating Posts', post.title

    print '*' * 100
    print "Event:", Event.objects(channels__nin=['Adventure Trip']).count()
    for a in Event.objects(channels__nin=['Adventure Trip']).all():
        if newTrip.objects(name=a.title).first() is not None:
            continue
        if hasattr(a, 'main_image') and a.main_image and a.main_image.image:
            cover_image = a.main_image.image
        else:
            cover_image = None
        trip = newTrip(title=a.title, description=a.description, about=a.text, cover_image=cover_image)
        if a.organiser:
            organizer = Profile.objects(pk=a.organiser.id).first()
            trip.organizer = organizer
        trip.save()

    print "Event Adventure Trips:", Event.objects(channels__in=['Adventure Trip']).count()
    for a in Event.objects(channels__in=['Adventure Trip']).all():
        if newTrip.objects(name=a.title).first() is not None:
            continue
        if hasattr(a, 'main_image') and a.main_image and a.main_image.image:
            cover_image = a.main_image.image
        else:
            cover_image = None
        event = newEvent(title=a.title, description=a.description, about=a.text, cover_image=cover_image)
        if a.organiser:
            organizer = Profile.objects(pk=a.organiser.id).first()
            trip.organizer = organizer
        event.save()


    print '*' * 100
    print "Products:", Product.objects.count()


    print '*' * 100
    print 'Tags:', Tag.objects.count()
    for a in Tag.objects.all():
        if newTag.objects(name__iexact=a.name).first() is not None:
            continue
        tag = newTag(name=a.name)
        tag.save()

    print '*' * 100
    print 'Advertisement:', Advertisement.objects.count()

