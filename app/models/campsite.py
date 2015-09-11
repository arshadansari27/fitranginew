__author__ = 'arshad'

from app.models import update_content, Entity, ExternalNetwork, Charge, db, Location
from app.models.relationships import RelationShips
from app.models.booking import CampsiteBooking
from app.models.media import TripGalleryImage
from app.models.profile import Profile


@update_content.apply
class Campsite(Entity, ExternalNetwork, Charge, db.Document, Location):
    host = db.ReferenceField('Profile')
    activities = db.ListField(db.ReferenceField('Activity'))
    extra_activities = db.ListField(db.StringField())
    accommodations = db.StringField()
    tariff = db.StringField()
    how_to_reach = db.StringField()
    announcements = db.StringField()
    optional_location_name = db.StringField()
    published = db.BooleanField(default=False)
    published_timestamp = db.DateTimeField()
    price_on_request = db.BooleanField(default=False)
    best_season = db.ListField(db.StringField(choices=['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']))
    nearby_stay = db.ListField(db.StringField())
    nearby_eat = db.ListField(db.StringField())
    nearby_station = db.ListField(db.StringField())
    nearby_airport = db.ListField(db.StringField())
    extremity_level = db.StringField(choices=['Easy', 'Medium', 'Difficult'])
    reach_by_air = db.ListField(db.StringField())
    reach_by_train = db.ListField(db.StringField())
    reach_by_road = db.ListField(db.StringField())
    reach_by_sea = db.ListField(db.StringField())

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
    def wish_listed_by(self):
        return RelationShips.get_wish_listed_by(self)

    @property
    def done_by(self):
        return RelationShips.get_accomplished_by(self)

    def add_to_wish_list(self, profile):
        RelationShips.wishlist(profile, self)

    def remove_from_wish_list(self, profile):
        RelationShips.unwishlist(profile, self)

    def mark_as_done(self, profile):
        RelationShips.accomplish(profile, self)

    def unmark_from_done(self, profile):
        RelationShips.unaccomplish(profile, self)

    def add_review(self, content, author):
        from app.models.content import Post
        review = Post(parent=self, content=content, author=author)
        review.save()
        self.reviews.append(review)
        self.save()
        return review

    def remove_review(self, id):
        from app.models.content import Post
        review = Post.objects(pk=id).first()
        self.reviews.remove(review)
        self.save()
        review.delete()

    @property
    def reviews(self):
        from app.models.content import Post
        reviews = Post.objects(parent=self).all()
        return reviews

    @property
    def reviews_count(self):
        from app.models.content import Post
        return Post.objects(parent=self).count()

    @property
    def media_gallery(self):
        return TripGalleryImage.objects(trip=self).all()

    @property
    def media_gallery_path(self):
        paths = [u.image_path for u in self.media_gallery if u.image_path is not None and len(u.image_path) > 0]
        return paths

    def show_interest(self, profile):
        RelationShips.interested(profile, self)

    def loose_interest(self, profile):
        RelationShips.uninterested(profile, self)

    @property
    def interested(self):
        return [u for u in RelationShips.get_interested_in(self) if isinstance(u, Profile)]

    def add_enquiry(self, user, name, email, phone, message, contact_pref):
        enquiry = CampsiteBooking(campsite=self, booking_by=user, preferred_name=name, preferred_email=email, preferred_phone=phone, enquiry=message, contact_preference=contact_pref, total_charge=self.price, discount_percent=self.discount_percentage if self.discount_percentage is not None else 0.0 * 1.0)
        enquiry.save()
        self.show_interest(user)
        return enquiry
