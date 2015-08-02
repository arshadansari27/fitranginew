__author__ = 'arshad'


from app import db

class Feedback(db.Document):
    profile = db.ReferenceField('Profile')
    message = db.StringField()

    meta = {
        'allow_inheritance': True
    }

class ClaimProfile(Feedback):
    claimed = db.ReferenceField('Profile')

    def __repr__(self):
        return '%s claimed %s profile' % (self.profile.name, self.claimed.name)

    def __unicode__(self):
        return self.__repr__()


class GenericFeedBack(Feedback):
    feedback_type = db.StringField()

    def __repr__(self):
        return '%s feedback [%s]' % (self.profile.name, self.feedback_type)

    def __unicode__(self):
        return self.__repr__()

class NotOkFeedBack(Feedback):
    not_ok = db.GenericReferenceField()
    option = db.StringField(choices=['Indecency', 'Spam', 'Misinformation', 'Other'])

    def __repr__(self):
        return '%s marked %s as not ok' % (self.profile.name, self.not_ok.name if hasattr(self.not_ok, 'name') else self.not_ok.title)

    def __unicode__(self):
        return self.__repr__()

