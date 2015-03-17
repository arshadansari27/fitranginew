__author__ = 'arshad'

from app.models import update_content, Entity, ExternalNetwork, db
from app.models.relationships import RelationShips
from app.models.profile import Profile

@update_content.apply
class Event(Entity, ExternalNetwork, db.Document):
    scheduled_date = db.DateTimeField()
    location = db.ReferenceField('Location')
    organizer = db.ReferenceField('Profile')

    meta = {
        'indexes': [
            {'fields': ['-modified_timestamp', 'slug', 'name'], 'unique': False, 'sparse': False, 'types': False },
        ],
    }

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

