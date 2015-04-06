__author__ = 'arshad'

from app.models import update_content, db, Entity
from app.models.relationships import RelationShips

ICONS = {
"HotAirBallooning" :"/images/adventure-icons/air-activities/hot-air-balooning.png",
"Paragliding" :"/images/adventure-icons/air-activities/paragliding.png",
"ParaMotoring" :"/images/adventure-icons/air-activities/para-motoring.png",
"Parasailing" :"/images/adventure-icons/air-activities/parasailing.png",
"SkyDiving" :"/images/adventure-icons/air-activities/sky-diving.png",
"ZipLine" :"/images/adventure-icons/air-activities/zip-line.png",
"Camping" :"/images/adventure-icons/land-activities/camping.png",
"Canyoning" :"/images/adventure-icons/land-activities/canyoning.png",
"Cycling-Biking" :"/images/adventure-icons/land-activities/cycling-biking.png",
"HorseRiding" :"/images/adventure-icons/land-activities/horse-riding.png",
"Marathons" :"/images/adventure-icons/land-activities/marathons.png",
"Mountaineering" :"/images/adventure-icons/land-activities/mountaineering.png",
"RappellingandValleyCrossing" :"/images/adventure-icons/land-activities/rappelling-valley-crossing.png",
"RockClimbing" :"/images/adventure-icons/land-activities/rock-climbing.png",
"Skiing" :"/images/adventure-icons/land-activities/skiing.png",
"Snow-Flow" :"/images/adventure-icons/land-activities/snowboarding.png",
"TrekkingandHiking" :"/images/adventure-icons/land-activities/trekking-hiking.png",
"Zorbing" :"/images/adventure-icons/land-activities/zorbing.png",
"Kayaking" :"/images/adventure-icons/water-activities/kayaking.png",
"KiteSurfing" :"/images/adventure-icons/water-activities/kite-surfing.png",
"ScubaDiving" :"/images/adventure-icons/water-activities/scuba-diving.png",
"Snorkelling" :"/images/adventure-icons/water-activities/snorkelling.png",
"Surfing" :"/images/adventure-icons/water-activities/surfing.png",
"WaterRafting" :"/images/adventure-icons/water-activities/water-rafting.png"
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
        print "[*] Media Icon: ", self.name, ICONS.get(self.name)
        return ICONS.get(self.name)

