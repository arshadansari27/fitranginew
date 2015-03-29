__author__ = 'arshad'

from app.models import update_content, Entity, db

@update_content.apply
class Product(Entity, db.Document):
    category = db.StringField()

