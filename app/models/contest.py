__author__ = 'arshad'

from app.models import update_content, Entity, ExternalNetwork, db
from app.models.relationships import RelationShips
from app.models.content import Content
from app.models.profile import Profile
from app import utils
import datetime, random

@update_content.apply
class Contest(Content, db.Document):
    start_date      = db.DateTimeField()
    end_date        = db.DateTimeField()
    creator         = db.ReferenceField('Profile')
    answer_type     = db.StringField(choices=['Objective', 'Subjective'])
    contest_type    = db.StringField(choices=['Survey', 'Information', 'Lucky Draw'])
    answer_choices  = db.ListField(db.StringField())
    correct_choice  = db.IntField()
    winner          = db.ReferenceField('Profile')
    winning_answer  = db.ReferenceField('ContestAnswer')

    meta = {
        'indexes': [
            {'fields': ['-modified_timestamp', 'slug', 'title'], 'unique': False, 'sparse': False, 'types': False },
        ],
    }

    @property
    def formatted_start_date(self):
        return self._formatted_data(self.start_date)

    @property
    def formatted_end_date(self):
        return self._formatted_data(self.end_date)

    def _formatted_data(self, date):
        day = date.day
        sup = self._get_sup(self.date)
        month = utils.get_month(self.date.month)
        year = str(self.date.year)
        hour = str(self.date.hour)
        minute = str(self.date.minute)
        _total_date = "%s:%s at %d<sup>%s</sup> %s %s " % (hour, minute, day, sup, month, year)
        return _total_date

    def _get_sup(self, date):
        if date.day is 1:
            return 'st'
        elif date.day is 2:
            return 'nd'
        elif date.day is 3:
            return 'rd'
        else:
            return 'th'

    def is_started(self):
        return self.start_date < datetime.datetime.now() < self.end_date

    def is_not_started(self):
        return self.start_date > datetime.datetime.now()

    def is_closed(self):
        return self.end_date < datetime.datetime.now()

    def find_lucky_answer(self):
        answers = list(ContestAnswer.objects(contest=self).all())
        win_id = random.randint(0, len(answers))
        return answers[win_id]


class ContestAnswer(db.Document):
    author = db.ReferenceField('Profile')
    answer = db.StringField()
    created_timestamp = db.DateTimeField(default=datetime.datetime.now)
    contest = db.ReferenceField('Contest')
