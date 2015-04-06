__author__ = 'arshad'

from app.models import update_content, Entity, ExternalNetwork, Charge, db
from app.models.relationships import RelationShips
from app.models.profile import Profile

@update_content.apply
class Trip(Entity, ExternalNetwork, Charge, db.Document):
    starting_from = db.ReferenceField('Location')
    organizer = db.ReferenceField('Profile')
    activities = db.ListField(db.ReferenceField('Activity'))
    adventure = db.ReferenceField('Adventure')
    difficulty_rating = db.IntField()
    registration = db.StringField()
    start_date = db.DateTimeField()
    end_date = db.DateTimeField()
    schedule = db.ListField(db.StringField())
    things_to_carry = db.ListField(db.StringField())
    inclusive = db.ListField(db.StringField())
    exclusive = db.ListField(db.StringField())
    others = db.ListField(db.StringField())
    comments = db.ListField(db.ReferenceField('Post'))
    enquiries = db.ListField(db.ReferenceField('Post'))
    announcements = db.ListField(db.StringField())

    meta = {
        'indexes': [
            {'fields': ['-modified_timestamp', 'slug', 'name'], 'unique': False, 'sparse': False, 'types': False },
        ],
    }

    @property
    def duration(self):
        return (self.end_date - self.start_date).days

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

