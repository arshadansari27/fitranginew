__author__ = 'arshad'

from app.models import update_content, db, Entity
from app.models.relationships import RelationShips

ICONS = {
"hillstation" :"/images/adventure-icons/air-activities/hot-air-balooning.png",
"hotairballooning" :"/images/adventure-icons/air-activities/hot-air-balooning.png",
"paragliding" :"/images/adventure-icons/air-activities/paragliding.png",
"paramotoring" :"/images/adventure-icons/air-activities/para-motoring.png",
"parasailing" :"/images/adventure-icons/air-activities/parasailing.png",
"skydiving" :"/images/adventure-icons/air-activities/sky-diving.png",
"zipline" :"/images/adventure-icons/air-activities/zip-line.png",
"bungeejumping": '/images/adventure-icons/air-activities/bungee-jumping.png',
"camping" :"/images/adventure-icons/land-activities/camping.png",
"canyoning" :"/images/adventure-icons/land-activities/canyoning.png",
"cyclingbiking" :"/images/adventure-icons/land-activities/cycling-biking.png",
"horseriding" :"/images/adventure-icons/land-activities/horse-riding.png",
"marathons" :"/images/adventure-icons/land-activities/marathons.png",
"mountaineering" :"/images/adventure-icons/land-activities/mountaineering.png",
"rappellingandvalleycrossing" :"/images/adventure-icons/land-activities/rappelling-valley-crossing.png",
"rockclimbing" :"/images/adventure-icons/land-activities/rock-climbing.png",
"skiing" :"/images/adventure-icons/land-activities/skiing.png",
"snowflow" :"/images/adventure-icons/land-activities/snowboarding.png",
"trekkingandhiking" :"/images/adventure-icons/land-activities/trekking-hiking.png",
"zorbing" :"/images/adventure-icons/land-activities/zorbing.png",
"kayaking" :"/images/adventure-icons/water-activities/kayaking.png",
"kitesurfing" :"/images/adventure-icons/water-activities/kite-surfing.png",
"scubadiving" :"/images/adventure-icons/water-activities/scuba-diving.png",
"snorkelling" :"/images/adventure-icons/water-activities/snorkelling.png",
"surfing" :"/images/adventure-icons/water-activities/surfing.png",
"waterrafting" :"/images/adventure-icons/water-activities/water-rafting.png"
}


@update_content.apply
class Activity(Entity, db.Document):
    icon = db.ImageField(thumbnail_size=(100, 100))
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

    @property
    def icon_image_path(self):
        icon_path = self.name.replace(' ', '').replace('-', '').lower()
        path = ICONS.get(icon_path)
        return path

