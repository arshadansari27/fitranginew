__author__ = 'arshad'
from collections import defaultdict

from app.models import update_content, db, Entity
from app.models.relationships import RelationShips

ACTIVITY_CATEGORY = {
    'Trekking and Hiking': 'Land Activities',
    'Camping': 'Land Activities',
    'Rock Climbing': 'Land Activities',
    'Cycling and Biking': 'Land Activities',
    'Marathons': 'Land Activities',
    'Mountaineering': 'Land Activities',
    'Rappelling and Valley Crossing': 'Land Activities',
    'Canyoning': 'Land Activities',
    'Horse Riding': 'Land Activities',
    'Zorbing': 'Land Activities',
    'Skiing': 'Land Activities',
    'Snowboarding': 'Land Activities',
    'Scuba Diving': 'Water Activities',
    'Water Rafting': 'Water Activities',
    'Kayaking': 'Water Activities',
    'Surfing': 'Water Activities',
    'Kite Surfing': 'Water Activities',
    'Snorkelling': 'Water Activities',
    'Paragliding': 'Air Activities',
    'Parasailing': 'Air Activities',
    'Bungee jumping': 'Air Activities',
    'Bungee Jumping': 'Air Activities',
    'Hot Air Ballooning': 'Air Activities',
    'Sky Diving': 'Air Activities',
    'Zip Line': 'Air Activities',
    'Paramotoring': 'Air Activities',
    'Wildlife': 'Land Activities',
    'Motor Biking': 'Land Activities'
}


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
"cyclingandbiking" :"/images/adventure-icons/land-activities/cycling-biking.png",
"horseriding" :"/images/adventure-icons/land-activities/horse-riding.png",
"marathons" :"/images/adventure-icons/land-activities/marathons.png",
"mountaineering" :"/images/adventure-icons/land-activities/mountaineering.png",
"rappellingandvalleycrossing" :"/images/adventure-icons/land-activities/rappelling-valley-crossing.png",
"rockclimbing" :"/images/adventure-icons/land-activities/rock-climbing.png",
"motorbiking" :"/images/adventure-icons/land-activities/Motor-Biking.png",
"wildlife" :"/images/adventure-icons/land-activities/Wildlife.png",
"skiing" :"/images/adventure-icons/land-activities/skiing.png",
"snowboarding" :"/images/adventure-icons/land-activities/snowboarding.png",
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
    def category(self):
        return ACTIVITY_CATEGORY.get(self.name)

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

ALL_ACTIVITIES = Activity.objects.all()
CATEGORIES_ACTIVITIES = defaultdict(list)
print 'All Activities', len(ALL_ACTIVITIES)
for activity in ALL_ACTIVITIES:
    CATEGORIES_ACTIVITIES[activity.category].append(activity)

print 'CATEGORIZED_ACTIVITIES: ', CATEGORIES_ACTIVITIES
