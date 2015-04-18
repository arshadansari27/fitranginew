from app.models.profile import Profile
from ago import human

__author__ = 'arshad'

from app.models import db
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
            if self.action.endswith('e'):
                action = self.action + 'd'
            elif self.action.endswith('ed'):
                action = self.action
            else:
                action = self.action + 'ed'
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
        activity = ActivityStream(profile=post.author, action=post.type, object=post, view_html='', view_text='', view_json='')
        activity.save()
        return activity

    @classmethod
    def push_content_to_stream(cls, content):
        activity = ActivityStream(profile=content.author, action='content', object=content, view_html='', view_text='', view_json='')
        activity.save()
        return activity

    @classmethod
    def push_vote_to_stream(cls, post_vote):
        activity = ActivityStream(profile=post_vote.voter, action= 'vote', object=post_vote.post, view_html='', view_text='', view_json='')
        activity.save()
        return activity

    @classmethod
    def push_relationship_to_stream(cls, relationship):
        activity = ActivityStream(profile=relationship.subject, action=get_activity_display(relationship.relation), object=relationship.object, view_html='', view_text='', view_json='')
        activity.save()
        return activity

    @classmethod
    def push_message_to_stream(cls, to_profile, message):
        activity = ActivityStream(profile=to_profile, action='message', object=message, view_html='', view_text='', view_json='', is_private=True)
        activity.save()
        return activity

    @classmethod
    def get_user_stream(cls, profile, is_self=False):
        if not is_self:
            return ActivityStream.objects(profile=profile, created_timestamp__gt=datetime.datetime.now()).all()
        else:
            from app.models.relationships import RelationShips
            profiles = list(profile.following)
            profiles.append(profile)
            return ActivityStream.objects(profile__in=profiles, created_timestamp__gt=datetime.datetime.now()).all()

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
        message = ChatMessage(profiles=sorted([from_profile, to_profile]), message=mesg, author=from_profile)
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
        cond = {'$cond': { 'if': { '$eq': [ "receiver_read", False] }, 'then': 1, 'else': 0 }}
        pipeline.append({'$group': {'_id': '$profiles', 'count': {'$sum':cond}}})
        result = ChatMessage._get_collection().aggregate(pipeline)['result']
        for u in result:
            p = Profile.objects(id=u['_id']).first()
            if p == profile:
                continue
            user_list[p] = u['count']
        return user_list

    @classmethod
    def get_message_between(cls, profile, another_profile, all=False):
        chat_timestamp = ChatTimestamp.objects(profile=profile).first()

        if not chat_timestamp:
            chat_timestamp = ChatTimestamp(profile=profile)
            chat_timestamp.last_checked = datetime.datetime(2015, 1, 1, 0, 0, 0, 0)
        if all:
            chats = list(reversed(ChatMessage.objects(__raw__=dict(profiles={'$all': [profile.id, another_profile.id]})).order_by('-created_timestamp').all()))
        else:
            chats = list(reversed(ChatMessage.objects(__raw__=dict(profiles={'$all': [profile.id, another_profile.id]}, created_timestamp={'$gte': chat_timestamp.last_checked})).order_by('-created_timestamp').all()))
        for c in chats:
            if c.author != profile:
                c.receiver_read = True
                c.save()

        chat_timestamp.last_checked = datetime.datetime.now()
        chat_timestamp.save()
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