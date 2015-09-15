from app.models.profile import Profile
from app.models.content import Content
from ago import human

__author__ = 'arshad'

from app.models import db
from mongoengine import Q
import datetime

def get_activity_display(name):
    return name

class ActivityStream(db.Document):
    profile = db.ReferenceField('Profile')
    action = db.StringField()
    object = db.GenericReferenceField()
    created_timestamp = db.DateTimeField(default=datetime.datetime.now)
    view_html = db.StringField()
    view_text = db.StringField()
    view_json = db.StringField()
    is_private = db.BooleanField(default=False)

    meta = {
        'indexes': [
            {'fields': ['-created_timestamp', 'profile', 'object'], 'unique': False, 'sparse': False, 'types': False },
        ],
    }

    def __unicode__(self): return "%s -> %s: %s" % (self.profile, self.object, self.action)

    @property
    def action_display(self):
        if self.action is None:
            action = 'responded'
        else:
            if '_' in self.action:
                action = self.action.replace('_', ' ')
            else:
                action = self.action
            return action

        return action

    @property
    def is_post_activity(self):
        from app.models.content import Post
        return isinstance(self.object, Post) and self.action == 'stream'

    @property
    def is_content_activity(self):
        from app.models.content import Content
        return isinstance(self.object, Content) or (hasattr(self.object, 'parent') and self.object.parent is not None and isinstance(self.object.parent, Content))

    @property
    def is_entity_activity(self):
        from app.models import Entity
        return isinstance(self.object, Entity)

    @classmethod
    def push_comment_to_stream(cls, post):
        return cls.push_post_to_stream(post, 'commented on')

    @classmethod
    def push_stream_post_to_stream(cls, post):
        return cls.push_post_to_stream(post, 'stream')

    @classmethod
    def push_review_to_stream(cls, post):
        return cls.push_post_to_stream(post, 'reviewed')


    @classmethod
    def push_post_to_stream(cls, post, type):
        activity = ActivityStream(profile=post.author, action=type, object=post, view_html='', view_text='', view_json='')
        activity.save()
        #TODO: CELERYFY
        if False and post.author:
            author = Profile.objects(pk=post.author.id).first()
            author.increment_public_activity_count()
            if type == 'stream':
                for u in author.followers:
                    u.increment_public_activity_count()

        if post.parent is not None and isinstance(post.parent, Content):
            content = post.parent
            activity2 = ActivityStream(profile=content.author, action='received comment on', object=content, view_html='', view_text='', view_json='')
            activity2.save()
            if content.author:
                author = Profile.objects(pk=content.author.id).first()
                author.increment_public_activity_count()

        return activity

    @classmethod
    def push_content_to_stream(cls, content):
        activity = ActivityStream(profile=content.author, action='added content', object=content, view_html='', view_text='', view_json='')
        activity.save()
        if content.author:
            author = Profile.objects(pk=content.author.id).first()
            author.increment_public_activity_count()
            #TODO: CELERYFY
            """
            for u in author.followers:
                u.increment_public_activity_count()
            """
        return activity

    @classmethod
    def push_trip_to_stream(cls, content):
        activity = ActivityStream(profile=content.organizer, action='added trip', object=content, view_html='', view_text='', view_json='')
        activity.save()
        if content.organizer:
            author = Profile.objects(pk=content.organizer.id).first()
            author.increment_public_activity_count()
        return activity

    @classmethod
    def push_gear_to_stream(cls, content):
        activity = ActivityStream(profile=content.owner, action='added gear/product ', object=content, view_html='', view_text='', view_json='')
        activity.save()
        if content.owner:
            author = Profile.objects(pk=content.owner.id).first()
            author.increment_public_activity_count()
        return activity

    @classmethod
    def push_campsite_to_stream(cls, content):
        activity = ActivityStream(profile=content.host, action='added campsite', object=content, view_html='', view_text='', view_json='')
        activity.save()
        if content.host:
            author = Profile.objects(pk=content.host.id).first()
            author.increment_public_activity_count()
        return activity

    @classmethod
    def push_vote_to_stream(cls, post_vote):
        activity = ActivityStream(profile=post_vote.voter, action= 'voted on', object=post_vote.post, view_html='', view_text='', view_json='')
        activity.save()
        if post_vote.voter:
            voter = Profile.objects(pk=post_vote.voter.id).first()
            voter.increment_public_activity_count()
            #TODO: CELERYFY
            """
            for u in voter.followers:
                u.increment_public_activity_count()
            """

        if post_vote.post.author is not None:
            post = post_vote.post
            activity2 = ActivityStream(profile=post.author, action='received vote on', object=post, view_html='', view_text='', view_json='')
            activity2.save()
            if post.author:
                author = Profile.objects(pk=post.author.id).first()
                author.increment_public_activity_count()

        return activity

    @classmethod
    def push_relationship_to_stream(cls, relationship):
        activity = ActivityStream(profile=relationship.subject, action=get_activity_display(relationship.relation), object=relationship.object, view_html='', view_text='', view_json='')
        activity.save()
        relationship.subject.increment_public_activity_count()
        # TODO: CELERYFY
        """
        for u in relationship.subject.followers:
            u.increment_public_activity_count()
        """
        return activity


    @classmethod
    def push_message_to_stream(cls, to_profile, message):
        activity = ActivityStream(profile=to_profile, action='message', object=message, view_html='', view_text='', view_json='', is_private=True)
        activity.save()
        to_profile.increment_private_activity_count()
        return activity

    @classmethod
    def get_user_stream(cls, profile, is_self=False):
        if not is_self:
            return ActivityStream.objects(profile=profile, created_timestamp__gt=datetime.datetime.now()).all()
        else:
            profiles = list(profile.following)
            profiles.append(profile)
            return ActivityStream.objects(Q(profile__in=profiles) | Q(object=profile)).all()

class ChatTimestamp(db.Document):
    profile = db.ReferenceField('Profile')
    last_checked = db.DateTimeField(default=datetime.datetime(2015, 1, 1, 0, 0, 0, 0))

class ChatMessage(db.Document):
    profiles = db.ListField(db.ReferenceField('Profile'))
    message = db.StringField()
    author = db.ReferenceField('Profile')
    receiver_read = db.BooleanField(default=False)
    created_timestamp = db.DateTimeField(default=datetime.datetime.now)

    meta = {
        'indexes': [
            {'fields': ['profiles','-created_timestamp'], 'unique': False, 'sparse': False, 'types': False },
        ],
    }

    @property
    def since(self): return human(self.created_timestamp, precision=1)

    def __unicode__(self): return "%s" % str(self.profiles)

    # Only two profiles
    @classmethod
    def create_message(cls, from_profile, to_profile, mesg):
        message = ChatMessage(profiles=sorted([from_profile, to_profile]), message=mesg, author=from_profile, receiver_read=False)
        message.save()
        ActivityStream.push_message_to_stream(to_profile, message)
        return message


    @classmethod
    def get_user_list(cls, profile):
        user_list = {}

        ids= [p.id for p in ChatMessage.objects(profiles=profile).all()]

        pipeline = []
        pipeline.append({'$unwind': '$profiles'})
        pipeline.append({'$match': {'_id': {'$in': ids}}})
        cond = {'$cond': { 'if': { '$eq': ["$receiver_read", False]}, 'then': 1, 'else': 0 }}
        pipeline.append({'$group': {'_id': '$profiles', 'count': {'$sum':cond}}})
        result = ChatMessage._get_collection().aggregate(pipeline)['result']
        print '[**]', result
        for u in result:
            _id = u['_id']
            count = u['count']
            p = Profile.objects(pk=str(_id)).first()
            print '***', p, _id, count, type(profile) == type(p)
            if not p or p.id == profile.id:
                continue
            user_list[str(p.id)] = int(u['count'])
        return user_list

    @classmethod
    def get_unread_message_between(cls, profile, another_profile):
        dct = {
            '$and': [{
                'profiles': {'$all': [profile.id, another_profile.id]}
                },
                {
                    '$or': [
                        {
                            "receiver_read": {"$exists": False}
                        },
                        {
                            "receiver_read": False
                        }
                    ]
                }
            ]
        }
        chats = list(ChatMessage.objects(__raw__=dct).order_by('-created_timestamp').all())
        return reversed([c for c in chats if not hasattr(c, 'receiver_read') or c.receiver_read is False])

    @classmethod
    def get_message_between(cls, profile, another_profile, all=False):
        chats = list(reversed(ChatMessage.objects(__raw__=dict(profiles={'$all': [profile.id, another_profile.id]})).order_by('-created_timestamp').all()))
        _chats = []
        for c in chats:
            if c.author == profile:
                continue
            c.receiver_read = True
            c = c.save()
            _chats.append(c)
        return chats


    @classmethod
    def get_by_id(cls, id):
        return ChatMessage.objects(pk=id).first()

    """
    @classmethod
    def _generate_random_messages(cls, p1, p2):
        import random
        mesg = 'This is a test message ' + ' '.join(str(random.randint(121313, 21312312312312)) for u in xrange(7))
        _mesg = mesg.split(' ')
        random.shuffle(_mesg)
        cls.create_message(p1, p2, ' '.join(_mesg))
    """