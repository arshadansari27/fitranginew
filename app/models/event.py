__author__ = 'arshad'

from app.models import update_content, Entity, ExternalNetwork, db
from app.models.relationships import RelationShips
from app.models.profile import Profile
from app import utils

@update_content.apply
class Event(Entity, ExternalNetwork, db.Document):
    scheduled_date = db.DateTimeField()
    end_date = db.DateTimeField()
    location = db.StringField()
    about_organizer = db.StringField()
    geo_location = db.PointField()
    organizer = db.ReferenceField('Profile')
    featured = db.BooleanField(default=False)
    admin_published = db.BooleanField(default=False)

    meta = {
        'indexes': [
            {'fields': ['-modified_timestamp', 'slug', 'name'], 'unique': False, 'sparse': False, 'types': False },
        ],
    }

    @property
    def formatted_end_date(self):
        day = self.end_date.day
        sup = self._get_sup(self.end_date)
        month = utils.get_month(self.end_date.month)
        year = str(self.end_date.year)
        _total_date = "%d<sup>%s</sup> %s %s " % (day, sup, month, year)
        return _total_date

    @property
    def formatted_scheduled_date(self):
        day = self.scheduled_date.day
        sup = self._get_sup(self.scheduled_date)
        month = utils.get_month(self.scheduled_date.month)
        year = str(self.scheduled_date.year)
        # hour = str(self.scheduled_date.hour)
        # minute = str(self.scheduled_date.minute)
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
    def scheduled_date_only(self):
        return str(self.scheduled_date).split(' ')[0] if self.scheduled_date and len(str(self.scheduled_date)) > 0 else ''

    @property
    def end_date_only(self):
        return str(self.end_date).split(' ')[0] if self.end_date and len(str(self.end_date)) > 0 else ''

    @property
    def manager(self):
        return self.organizer

    def join_event(self, profile):
        RelationShips.join(profile, self)

    def leave_event(self, profile):
        RelationShips.unjoin(profile, self)

    def show_interest(self, profile):
        RelationShips.interested(profile, self)

    def loose_interest(self, profile):
        RelationShips.uninterested(profile, self)

    @property
    def interested(self):
        return [u for u in RelationShips.get_interested_in(self) if isinstance(u, Profile)]

    @property
    def joined(self):
        return [u for u in RelationShips.get_joined_in(self) if isinstance(u, Profile)]

