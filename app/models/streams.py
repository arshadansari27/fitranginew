
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

    @classmethod
    def push_comment_to_stream(cls, post):
        activity = ActivityStream(profile=post.author, action='comment', object=post, view_html='', view_text='', view_json='')
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
            profiles = list(profile.get_profiles_followed_by_me())
            profiles.append(profile)
            return ActivityStream.objects(profile__in=profiles, created_timestamp__gt=datetime.datetime.now()).all()


class UserMessage(db.EmbeddedDocument):
    message = db.StringField()
    author = db.ReferenceField('Profile')

class Message(db.Document):
    profiles = db.ListField(db.ReferenceField('Profile'))
    messages = db.ListField(db.EmbeddedDocumentField(UserMessage))
    cleared = db.ListField(db.ReferenceField('Profile'))

    def __unicode__(self): return "%s -> %s: %s" % (self.from_user.name, self.to_user.name, self.subject)

    # Only two profiles
    @classmethod
    def create_message(cls, from_profile, to_profile, message):
        message = Message.objects(profiles__in=[from_profile, to_profile]).first()
        if not message:
            message = Message(profiles=[from_profile, to_profile], messages=[UserMessage(message=message, author=from_profile)])
        else:
            message.messages.append(UserMessage(message=message, author=from_profile))
        message.save()
        ActivityStream.push_message_to_stream(to_profile, message)


    @classmethod
    def get_messages(cls, profile):

        message_list = {}
        for message in Message.objects(profiles__in=[profile], cleared__nin=[profile]).all():
            for p in message.profiles:
                if p.id == profile.id:
                    continue
                message_list.setdefault(str(p.id), [])
                message_list[str(p.id)].append(message)
        return message_list

    @classmethod
    def get_message_between(cls, profile, another_profile):
        return  Message.objects(profiles__in=[profile, another_profile], cleared__nin=[profile]).first()

    @classmethod
    def get_by_id(cls, id):
        return Message.objects(pk=id).first()

    def clear_messages(self, profile):
        if profile not in self.cleared:
            self.cleared.append(profile)

