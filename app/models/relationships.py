from app.utils import get_start_end, PAGE_LIMIT

__author__ = 'arshad'
from app.models import db, new_object

FAVORITE, FAVORITED_BY = 'favorite', 'favorited_by'
FOLLOWS, FOLLOWED_BY = 'follows', 'followed_by'
INTERESTED, INTEREST_SHOWN_BY = 'interested', 'interest_shown_by'
JOINED, JOINED_BY = 'joined', 'joined_by',
ACCOMPLISHED, ACCOMPLISHED_BY = 'accomplished', 'accomplished_by'
WISHLISTED, WISHLISTED_BY = 'wishlisted', 'wishlisted_by'


inverse_relation = {
    FAVORITE: FAVORITED_BY,
    FOLLOWS: FOLLOWED_BY,
    INTERESTED: INTEREST_SHOWN_BY,
    JOINED: JOINED_BY,
    ACCOMPLISHED: ACCOMPLISHED_BY,
    WISHLISTED: WISHLISTED_BY
}



class RelationShips(db.Document):
    subject = db.GenericReferenceField()
    object = db.GenericReferenceField()
    relation = db.StringField()

    meta = {
        'indexes': [
            {'fields': ['subject', 'relation'], 'unique': False, 'sparse': False, 'types': False },
        ],
    }


    @classmethod
    def create_relationship(cls, subject, object, relation):
        from app.models.streams import ActivityStream
        if RelationShips.objects(subject=subject, object=object, relation=relation).first() is None:
            relationship = RelationShips(subject=subject, object=object, relation=relation)
            relationship.save()
            ActivityStream.push_relationship_to_stream(relationship)
        if RelationShips.objects(subject=object, object=subject, relation=inverse_relation.get(relation)).first() is None:
            relationship = RelationShips(subject=object, object=subject, relation=inverse_relation.get(relation))
            relationship.save()



    @classmethod
    def remove_relationship(cls, subject, object, relation):
        relation = RelationShips.objects(subject=subject, object=object, relation=relation).first()
        if relation is not None:
            relation.delete()
        relation = RelationShips.objects(subject=object, object=subject, relation=inverse_relation.get(relation)).first()
        if relation is not None:
            relation.delete()

    @classmethod
    def follow(cls, subject, object):
        cls.create_relationship(subject, object, FOLLOWS)

    @classmethod
    def un_follow(cls, subject, object):
        cls.remove_relationship(subject, object, FOLLOWS)

    @classmethod
    def favorite(cls, subject, object):
        cls.create_relationship(subject, object, FAVORITE)

    @classmethod
    def un_favorite(cls, subject, object):
        cls.remove_relationship(subject, object, FAVORITE)

    @classmethod
    def interested(cls, subject, object):
         cls.create_relationship(subject, object, INTERESTED)

    @classmethod
    def uninterested(cls, subject, object):
        cls.remove_relationship(subject, object, INTERESTED)

    @classmethod
    def join(cls, subject, object):
        cls.create_relationship(subject, object, JOINED)

    @classmethod
    def unjoin(cls, subject, object):
        cls.remove_relationship(subject, object, JOINED)

    @classmethod
    def accomplish(cls, subject, object):
        cls.create_relationship(subject, object, ACCOMPLISHED)

    @classmethod
    def unaccomplish(cls, subject, object):
        cls.remove_relationship(subject, object, ACCOMPLISHED)

    @classmethod
    def wishlist(cls, subject, object):
        cls.create_relationship(subject, object, WISHLISTED)

    @classmethod
    def unwishlist(cls, subject, object):
        cls.remove_relationship(subject, object, WISHLISTED)


    @classmethod
    def get_by_query(cls, subject, relation, paged=False, page=1, size=PAGE_LIMIT):
        query = RelationShips.objects(subject=subject, relation=relation)
        if paged:
            s, e = get_start_end(page, size)
            return (u.object for u in query.all()[s: e])
        else:
            return (u.object for u in query.all())


    @classmethod
    def get_following(cls, subject, paged=False, page=1, size=PAGE_LIMIT):
        return RelationShips.get_by_query(subject, FOLLOWS, paged=paged, page=page)

    @classmethod
    def get_followed_by(cls, subject, paged=False, page=1, size=PAGE_LIMIT):
        return RelationShips.get_by_query(subject, inverse_relation.get(FOLLOWS), paged=paged, page=page)

    @classmethod
    def get_interested(cls, subject, paged=False, page=1, size=PAGE_LIMIT):
        return RelationShips.get_by_query(subject, INTERESTED, paged=paged, page=page)

    @classmethod
    def get_interested_in(cls, subject, paged=False, page=1, size=PAGE_LIMIT):
        return RelationShips.get_by_query(subject, inverse_relation.get(INTERESTED), paged=paged, page=page)

    @classmethod
    def get_joined(cls, subject, paged=False, page=1, size=PAGE_LIMIT):
        return RelationShips.get_by_query(subject, JOINED, paged=paged, page=page)

    @classmethod
    def get_joined_in(cls, subject, paged=False, page=1, size=PAGE_LIMIT):
        return RelationShips.get_by_query(subject, inverse_relation.get(JOINED), paged=paged, page=page)

    @classmethod
    def get_favorites(cls, subject, paged=False, page=1, size=PAGE_LIMIT):
        return RelationShips.get_by_query(subject, FAVORITE, paged=paged, page=page)

    @classmethod
    def get_favorited_by(cls, subject, paged=False, page=1, size=PAGE_LIMIT):
        return RelationShips.get_by_query(subject, inverse_relation.get(FAVORITE), paged=paged, page=page)

    @classmethod
    def get_accomplished(cls, subject, paged=False, page=1, size=PAGE_LIMIT):
        return RelationShips.get_by_query(subject, ACCOMPLISHED, paged=paged, page=page)

    @classmethod
    def get_accomplished_by(cls, subject, paged=False, page=1, size=PAGE_LIMIT):
        return RelationShips.get_by_query(subject, inverse_relation.get(ACCOMPLISHED), paged=paged, page=page)

    @classmethod
    def get_wish_listed(cls, subject, paged=False, page=1, size=PAGE_LIMIT):
        return RelationShips.get_by_query(subject, WISHLISTED, paged=paged, page=page)

    @classmethod
    def get_wish_listed_by(cls, subject, paged=False, page=1, size=PAGE_LIMIT):
        return RelationShips.get_by_query(subject, inverse_relation.get(WISHLISTED), paged=paged, page=page)

