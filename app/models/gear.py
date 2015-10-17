__author__ = 'arshad'

from app.models import update_content, Entity, ExternalNetwork, Charge, db, Location
from app.models.relationships import RelationShips
from app.models.booking import GearBooking
from app.models.media import GearGalleryImage

CATEGORIES = ['Accessories', 'Shoes & Footwear', 'Clothing', 'Equipments', 'Bags & Rucksack', 'Tent and Camping Gears', 'Others']

ALLOWED_CATEGORIES = ['Shoes', 'Adventure Gear', 'Bags', 'Head Gears and Caps']
ALLOWED_CATEGORIES.extend(CATEGORIES)

@update_content.apply
class Gear(Entity, ExternalNetwork, Charge, db.Document, Location):
    owner = db.ReferenceField('Profile')
    published = db.BooleanField(default=False)
    published_timestamp = db.DateTimeField()
    category = db.StringField(choices=ALLOWED_CATEGORIES)
    available_for = db.ListField(db.StringField(choices=['BUYING', 'RENTING']))
    condition = db.StringField(choices=['Brand New', 'Used Product', ''])

    meta = {
        'indexes': [
            {'fields': ['-modified_timestamp', 'slug', 'name'], 'unique': False, 'sparse': False, 'types': False },
        ],
    }

    def __repr__(self):
        return self.name

    def __unicode__(self):
        return self.__repr__()

    @property
    def manager(self):
        return self.owner

    @property
    def media_gallery(self):
        return GearGalleryImage.objects(gear=self).all()

    @property
    def media_gallery_single_path(self):
        return GearGalleryImage.objects(gear=self).first().image_path

    @property
    def media_gallery_single_path_small(self):
        return GearGalleryImage.objects(gear=self).first().image_path_small

    @property
    def media_gallery_path_small(self):
        paths = [u.image_path_small for u in self.media_gallery if u.image_path_small is not None and len(u.image_path_small) > 0]
        return paths

    @property
    def media_gallery_path(self):
        paths = [u.image_path for u in self.media_gallery if u.image_path is not None and len(u.image_path) > 0]
        return paths

    def add_to_wish_list(self, profile):
        RelationShips.wishlist(profile, self)

    def remove_from_wish_list(self, profile):
        RelationShips.unwishlist(profile, self)

    def add_enquiry(self, user, name, email, phone, message, contact_pref):
        enquiry = GearBooking(gear=self, booking_by=user, preferred_name=name, preferred_email=email, preferred_phone=phone, enquiry=message, contact_preference=contact_pref, total_charge=self.price, discount_percent=self.discount_percentage if self.discount_percentage is not None else 0.0 * 1.0)
        enquiry.save()
        RelationShips.join(user, self)
        return enquiry
