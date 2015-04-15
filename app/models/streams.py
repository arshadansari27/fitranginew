
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


class UserMessage(db.EmbeddedDocument):
    message = db.StringField()
    author = db.ReferenceField('Profile')
    read = db.BooleanField(default=False)
    created_timestamp = db.DateTimeField(default=datetime.datetime.now)

class ChatMessage(db.Document):
    profiles = db.ListField(db.ReferenceField('Profile'))
    messages = db.ListField(db.EmbeddedDocumentField(UserMessage))
    cleared = db.ListField(db.ReferenceField('Profile'))

    def __unicode__(self): return "%s -> %s" % (str(self.profiles), str(len(self.messages)))

    # Only two profiles
    @classmethod
    def create_message(cls, from_profile, to_profile, mesg):
        message = ChatMessage.objects(profiles__in=[from_profile, to_profile]).first()
        if not message:
            message = ChatMessage(profiles=[from_profile, to_profile], messages=[UserMessage(message=mesg, author=from_profile)])
        else:
            message.messages.append(UserMessage(message=mesg, author=from_profile))
        message.save()
        ActivityStream.push_message_to_stream(to_profile, message)


    @classmethod
    def get_messages(cls, profile):

        message_list = {}
        for message in ChatMessage.objects(profiles__in=[profile], cleared__nin=[profile]).all():
            for p in message.profiles:
                if p.id == profile.id:
                    continue
                message_list.setdefault(str(p.id), [])
                message_list[str(p.id)].append(message)
        return message_list

    @classmethod
    def get_message_between(cls, profile, another_profile):
        return  ChatMessage.objects(profiles__in=[profile, another_profile], cleared__nin=[profile]).first()

    @classmethod
    def get_by_id(cls, id):
        return ChatMessage.objects(pk=id).first()

    def clear_messages(self, profile):
        if profile not in self.cleared:
            self.cleared.append(profile)

