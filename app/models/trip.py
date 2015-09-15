__author__ = 'arshad'

from app.models import update_content, Entity, ExternalNetwork, Charge, db, Location
from app.models.relationships import RelationShips
from app.models.booking import TripBooking
from app.models.media import TripGalleryImage
from app.models.profile import Profile
from app import utils


DEPARTURE_TYPES = (FIXED_DEPARTURE_TYPE, ON_REQUEST_DEPARTURE_TYPE) = ('Fixed', 'On Request')

@update_content.apply
class Trip(Entity, ExternalNetwork, Charge, db.Document, Location):
    starting_from = db.StringField()
    geo_starting_from = db.PointField()
    organizer = db.ReferenceField('Profile')
    activities = db.ListField(db.ReferenceField('Activity'))
    extra_activities = db.ListField(db.StringField())
    adventure = db.ReferenceField('Adventure')  # deprecated
    difficulty_rating = db.IntField()  # deprecated
    registration = db.StringField()  # deprecated
    start_date = db.DateTimeField()
    end_date = db.DateTimeField()
    schedule = db.StringField()  # deprecated
    itinerary = db.StringField()
    things_to_carry = db.StringField()  #deprecated
    inclusive = db.StringField()  # deprecated
    exclusive = db.StringField()  # deprecated
    inclusive_exclusive = db.StringField()
    others = db.StringField()  # deprecated
    other_details = db.StringField()
    announcements = db.StringField()
    optional_location_name = db.StringField()
    _duration = db.IntField()
    published = db.BooleanField(default=False)
    published_timestamp = db.DateTimeField()
    admin_published = db.BooleanField(default=True)  # Deprecated
    departure_type = db.StringField(choices=DEPARTURE_TYPES, default=FIXED_DEPARTURE_TYPE)
    expected_duration = db.StringField()
    expected_conditions = db.StringField()
    price_on_request = db.BooleanField(default=False)

    meta = {
        'indexes': [
            {'fields': ['-modified_timestamp', 'slug', 'name'], 'unique': False, 'sparse': False, 'types': False },
        ],
    }

    def __repr__(self):
        return self.name

    def __unicode__(self):
        return self.__repr__()

    @classmethod
    def distinct_starting_cities(cls):
        # TODO: Make sure to use flask cache with this.
        return list(set([trip.starting_from for trip in Trip.objects.all()]))

    @property
    def manager(self):
        return self.organizer

    @property
    def from_date_only(self):
        u = self.start_date
        return u.date()
        y = u.date().year
        m = u.date().month
        d = u.date().day
        return "%s/%s/%s" % (m, d, y)

    @property
    def from_date_time(self):
        u = self.start_date
        return u.time()
        h = int(u.time().hour)
        m = u.time().minute
        if h > 12:
            xh = h - 12
            a = 'PM'
        else:
            xh = h
            a = 'AM'
        return "%s:%s %s" % (xh, m, a)

    @property
    def to_date_only(self):
        u = self.end_date
        return u.date()
        y = u.date().year
        m = u.date().month
        d = u.date().day
        return "%s/%s/%s" % (m, d, y)

    @property
    def to_date_time(self):
        u = self.end_date
        return u.time()
        h = u.time().hour
        m = u.time().minute
        if h > 12:
            h = h - 12
            a = 'PM'
        else:
            a = 'AM'
        return "%s:%s %s" % (h, m, a)

    @property
    def media_gallery(self):
        return TripGalleryImage.objects(trip=self).all()

    @property
    def media_gallery_path(self):
        paths = [u.image_path for u in self.media_gallery if u.image_path is not None and len(u.image_path) > 0]
        return paths

    @property
    def duration(self):
        self._duration = ((self.end_date - self.start_date).days + 1) if self.start_date and self.end_date else 0
        self.save()
        return self._duration

    @property
    def total_date(self):
        return self._total_date(partial=False)

    @property
    def partial_date(self):
        return self._total_date()

    def _total_date(self, partial=True):
        start_day = self.start_date.day
        start_sup = self._get_sup(self.start_date)
        start_month = utils.get_month(self.start_date.month)
        start_year = str(self.start_date.year)
        end_day = self.end_date.day
        end_sup = self._get_sup(self.end_date)
        end_month = utils.get_month(self.end_date.month)
        end_year = str(self.end_date.year)
        params = (start_day, start_sup, start_month, start_year, end_day, end_sup, end_month, end_year)
        _total_date = "%d<sup>%s</sup> %s %s" % (start_day, start_sup, start_month, start_year)
        if partial:
            return _total_date
        if start_year == end_year:
            if start_month == end_month:
                if start_day == end_day:
                    _total_date = "%d<sup>%s</sup> %s %s" % (start_day, start_sup, end_month, end_year)
                else:
                    _total_date = "%d<sup>%s</sup> - %d<sup>%s</sup> %s %s" % (start_day, start_sup, end_day, end_sup, end_month, end_year)
            else:
                _total_date = "%d<sup>%s</sup> %s - %d<sup>%s</sup> %s %s" % (start_day, start_sup, start_month, end_day, end_sup, end_month, end_year)
        else:
            _total_date = "%d<sup>%s</sup> %s %s - %d<sup>%s</sup> %s %s" % params
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

    def join_trip(self, profile):
        RelationShips.join(profile, self)

    def leave_trip(self, profile):
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

    def add_enquiry(self, user, name, email, phone, message, contact_pref):
        enquiry = TripBooking(trip=self, booking_by=user, preferred_name=name, preferred_email=email, preferred_phone=phone, enquiry=message, contact_preference=contact_pref, total_charge=self.price, discount_percent=self.discount_percentage if self.discount_percentage is not None else 0.0 * 1.0)
        enquiry.save()
        RelationShips.join(user, self)
        return enquiry
