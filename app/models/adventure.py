from app.models.relationships import RelationShips

__author__ = 'arshad'

from app.models import update_content, Entity, db

@update_content.apply
class Location(db.Document):
    geo_location = db.PointField()
    name = db.StringField()

    meta = {
        'indexes': [
            {'fields': ['geo_location'], 'unique': True, 'sparse': False, 'types': False },
            {'fields': ['name'], 'unique': True, 'sparse': False, 'types': False },
        ],
    }

    def __repr__(self):
        return self.name

    def __unicode__(self):
        return self.name

@update_content.apply
class Adventure(Entity, db.Document):
    best_season = db.ListField(db.StringField(choices=['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']))
    location = db.ReferenceField('Location')
    nearby_stay = db.ListField(db.StringField())
    nearby_eat = db.ListField(db.StringField())
    nearby_station = db.ListField(db.StringField())
    nearby_airport = db.ListField(db.StringField())
    extremity_level = db.StringField(choices=['Easy', 'Medium', 'Difficult'])
    activities = db.ListField(db.ReferenceField('Activity'))
    reach_by_air = db.ListField(db.StringField())
    reach_by_train = db.ListField(db.StringField())
    reach_by_road = db.ListField(db.StringField())
    reach_by_sea = db.ListField(db.StringField())

    meta = {
        'indexes': [
            {'fields': ['-modified_timestamp', 'slug', 'name'], 'unique': False, 'sparse': False, 'types': False },
        ],
    }

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

