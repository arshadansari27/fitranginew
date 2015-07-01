__author__ = 'arshad'

from app.models import update_content, db
from app.models.content import Content
from app.models.profile import Profile
from app import utils
from bson import ObjectId
from mongoengine import Q
import datetime, random

class ContestAnswerOption(db.EmbeddedDocument):
    option = db.StringField()
    enumaration = db.StringField()

    def __repr__(self):
        return "%s: %s" % (self.enumaration, self.option)

    def __unicode__(self):
        return self.__repr__()

class ContestQuestion(db.EmbeddedDocument):
    enumeration = db.StringField()
    question = db.StringField()
    options  = db.ListField(db.EmbeddedDocumentField(ContestAnswerOption))
    correct_option = db.StringField()

    def __repr__(self):
        return "%s: %s" % (self.enumaration, self.question)

    def __unicode__(self):
        return self.__repr__()

    def get_answer_by_enumeration(self, enumeration):
        for a in self.options:
            if a.enumeration == enumeration:
                return a
        raise Exception('Invalid enumeration')

@update_content.apply
class Contest(Content):
    start_date      = db.DateTimeField(default=datetime.datetime.now())
    end_date        = db.DateTimeField()
    creator         = db.ReferenceField('Profile')
    questions       = db.ListField(db.EmbeddedDocumentField(ContestQuestion))
    winner          = db.ReferenceField('Profile')
    closed          = db.BooleanField(default=False)
    sponsorer        = db.ReferenceField('Profile')

    def is_closed(self):
        if datetime.datetime.now() > self.end_date:
            return True
        else:
            return self.closed

    def get_question_by_enumeration(self, enumeratoin):
        for q in self.questions:
            if enumeratoin == q.enumeration:
                return q
        raise Exception('Invalid enumeration')

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
        print '[->] Getting formatted date'
        sup = self._get_sup(date)
        month = utils.get_month(date.month)
        year = str(date.year)
        hour = str(date.hour)
        minute = str(date.minute)
        _total_date = "%d<sup>%s</sup> %s %s " % (day, sup, month, year)
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

    @property
    def is_started(self):
        return self.start_date < datetime.datetime.now() < self.end_date

    @property
    def is_not_started(self):
        is_not = (self.start_date > datetime.datetime.now())
        print 'Started: ', is_not
        return is_not

    @property
    def is_closed(self):
        return self.end_date < datetime.datetime.now() or self.closed

    def find_lucky_answer(self):
        answers = list(ContestAnswer.objects(contest=self).all())
        win_id = random.randint(0, len(answers))
        return answers[win_id]

    def has_user_answered(self, user):
        if isinstance(user, str) or isinstance(user, unicode) or isinstance(user, ObjectId):
            user = Profile.objects(pk=str(user)).first()
        users = ContestAnswer.get_all_participants_by_contest(self)
        print user, users
        if len(users) is 0:
            return False
        return user in users

    def get_user_score(self, user):
        return len(filter(lambda a: a, [answer.is_correct_answer for answer in ContestAnswer.answers_by_contest_and_user(self, user)]))


class ContestAnswer(db.Document):
    author = db.ReferenceField('Profile')
    created_timestamp = db.DateTimeField(default=datetime.datetime.now)
    contest  = db.ReferenceField('Contest')
    question_enumeration = db.StringField()
    answer_enumeration = db.StringField()
    correct_answer     = db.BooleanField()

    @property
    def is_correct_answer(self):
        if not self.question_enumeration:
            raise Exception('Invalid Question Selected')
        if not self.answer_enumeration:
            return None
        question = self.contest.get_question_by_enumeration(self.question_enumeration)
        answer = question.get_answer_by_enumeration(self.answer_enumeration)
        return answer.enumaration == self.answer_enumeration

    @property
    def answer(self):
        if not self.question_enumeration:
            raise Exception('Invalid Question Selected')
        if not self.answer_enumeration:
            return None
        question = self.contest.get_question_by_enumeration(self.question_enumeration)
        answer = question.get_answer_by_enumeration(self.answer_enumeration)
        return answer

    @answer.setter
    def answer(self, value):
        self.answer_enumeration = value
        question = self.contest.get_question_by_enumeration(self.question_enumeration)
        if question.correct_option == value:
            self.correct_answer = True
        else:
            self.correct_answer = False

    @classmethod
    def answers_by_contest(cls, contest):
        if isinstance(contest, str) or isinstance(contest, unicode) or isinstance(contest, ObjectId):
            contest = Contest.objects(pk=str(contest)).first()
        return ContestAnswer.objects(contest=contest).all()

    @classmethod
    def answers_by_contest_and_user(cls, contest, user):
        if isinstance(contest, str) or isinstance(contest, unicode) or isinstance(contest, ObjectId):
            contest = Contest.objects(pk=str(contest)).first()
        if isinstance(user, str) or isinstance(user, unicode) or isinstance(user, ObjectId):
            user = Profile.objects(pk=str(user)).first()
        return ContestAnswer.objects(Q(contest=contest) & Q(user=user)).all()

    @classmethod
    def correct_answers_by_contest_and_user(cls, contest, user):
        if isinstance(contest, str) or isinstance(contest, unicode) or isinstance(contest, ObjectId):
            contest = Contest.objects(pk=str(contest)).first()
        if isinstance(user, str) or isinstance(user, unicode) or isinstance(user, ObjectId):
            user = Profile.objects(pk=str(user)).first()
        return len(filter(lambda u: u.correct_answer, ContestAnswer.objects(Q(contest=contest) & Q(user=user)).all()))

    @classmethod
    def check_all_correct_answers_by_contest_and_user(cls, contest, user):
        if isinstance(contest, str) or isinstance(contest, unicode) or isinstance(contest, ObjectId):
            contest = Contest.objects(pk=str(contest)).first()
        if isinstance(user, str) or isinstance(user, unicode) or isinstance(user, ObjectId):
            user = Profile.objects(pk=str(user)).first()
        return len(contest.questions) == cls.correct_answers_by_contest_and_user(contest, user)

    @classmethod
    def get_all_participants_by_contest(cls, contest):
        if isinstance(contest, str) or isinstance(contest, unicode) or isinstance(contest, ObjectId):
            contest = Contest.objects(pk=str(contest)).first()
        users = set([c.author for c in ContestAnswer.objects(contest=contest).all()])
        print users
        return users

    @classmethod
    def get_all_participants_by_contest_count(cls, contest):
        return len(cls.get_all_participants_by_contest(contest))

