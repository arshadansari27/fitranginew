__author__ = 'arshad'

from app.models import update_content, Entity, db, Charge


@update_content.apply
class Product(Entity, Charge, db.Document):
    category = db.StringField()

