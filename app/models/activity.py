__author__ = 'arshad'

from app.models import update_content, db, Entity
from app.models.relationships import RelationShips

@update_content.apply
class Activity(Entity, db.Document):
    dos = db.ListField(db.StringField())
    donts = db.ListField(db.StringField())
    safety_tips = db.ListField(db.StringField())
    tips = db.ListField(db.StringField())
    facts = db.ListField(db.StringField())
    highlights = db.StringField()

    meta = {
        'indexes': [
            {'fields': ['-modified_timestamp', 'slug', 'name'], 'unique': False, 'sparse': False, 'types': False },
        ],
    }

    @property
    def favorited_by(self):
        RelationShips.get_favorited_by(self)

    def mark_favorite(self, profile):
        RelationShips.favorite(profile, self)

    def unmark_from_favorite(self, profile):
        RelationShips.un_favorite(profile, self)



