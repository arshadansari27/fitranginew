__author__ = 'arshad'

from app import db

class ExtraPage(db.Document):
    name = db.StringField()
    page_title = db.StringField()
    page_content  = db.StringField()


    @classmethod
    def get_about_us(cls):
        page = cls.objects(name__iexact='aboutus').first()
        return page.page_title, page.page_content

    @classmethod
    def get_faq(cls):
        page = cls.objects(name__iexact='faq').first()
        return page.page_title, page.page_content

    @classmethod
    def get_terms(cls):
        page = cls.objects(name__iexact='terms').first()
        return page.page_title, page.page_content

    @classmethod
    def get_privacy(cls):
        page = cls.objects(name__iexact='privacy').first()
        return page.page_title, page.page_content
