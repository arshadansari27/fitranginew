from app.models import *
from app.utils import extract_keywords, tag_remove

def __key_words(text):
    return [v[0] for v in extract_keywords(tag_remove(text))]

def update_ancestor():
    print 'Do nothing'

def update_keywords():
    for c in Content.objects.all():
        print 'Updating:', c.title
        if not c.text or len(c.text) == 0:
            continue
        Content.objects(id=c.id).update_one(set__keywords=__key_words(c.text))
        if len(c.comments) > 0:
            for comment in c.comments:
                comment.keywords = __key_words(comment.text)
            Content.objects(id=c.id).update_one(set__comments=c.comments)

    for e in Event.objects.all():
        Event.objects(id=e.id).update_one(set_keywords=__key_words(e.description))
   
    for p in Product.objects.all():
        Product.objects(id=p.id).update_one(set_keywords=__key_words(e.description))
