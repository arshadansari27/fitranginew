__author__ = 'arshad'

from app.models import db
import datetime

class Booking(db.Document):
    booking_by = db.ReferenceField('Profile')
    preferred_name  = db.StringField()
    preferred_email = db.StringField()
    preferred_phone = db.StringField()
    enquiry         = db.StringField()
    total_charge     = db.FloatField()
    discount_percent = db.FloatField()
    contact_preference = db.StringField()
    status           = db.StringField(choices=['Enquiry', 'Done', 'Cancelled'], default='Enquiry')
    payment_status   = db.StringField(choices=['Paid', 'Balance'], default='Balance')
    created_timestamp = db.DateTimeField(default=datetime.datetime.now)
    modified_timestamp = db.DateTimeField(default=datetime.datetime.now)

    meta = {
        'allow_inheritance': True,
        'indexes': [
            {'fields': ['-modified_timestamp', '-created_timestamp'], 'unique': False, 'sparse': False, 'types': False }
        ],
    }

    @property
    def actual_charge(self):
        return self.total_charge - (self.total_charge * (self.discount_percent/100.0 if self.discount_percent and self.discount_percent >= 0.0 else 0.0))


class TripBooking(Booking):
    trip = db.ReferenceField('Trip')

class EventBooking(Booking):
    event = db.ReferenceField('Event')

class CampsiteBooking(Booking):
    campsite = db.ReferenceField('Campsite')

class GearBooking(Booking):
    gear = db.ReferenceField('Gear')
