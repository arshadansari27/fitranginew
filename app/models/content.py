__author__ = 'arshad'

from app.models import Node, update_content, db
from app.models.profile import Profile
import datetime

class Tag(db.Document):
    name = db.StringField()

    def __unicode__(self): return self.name

class Comment(db.EmbeddedDocument):
    author = db.ReferenceField('Profile')
    content = db.StringField()
    created_timestamp = db.DateTimeField(default=datetime.datetime.now)
    modified_timestamp = db.DateTimeField(default=datetime.datetime.now)


class Channel(db.Document):
    name = db.StringField()
    type = db.StringField(choices=['Discussion Group', 'User Channel', 'Activity', 'Adventure', ''])
    parent = db.ReferenceField('Channel')

class Content(Node):
    title = db.StringField()
    content = db.StringField()
    author = db.ReferenceField('Profile')
    comments = db.ListField(db.EmbeddedDocumentField(Comment))
    source = db.StringField()
    tags = db.ListField(db.StringField())
    tag_refs = db.ListField(db.ReferenceField('Tag'))

    def update_tags_list(self):
        self.tags = []
        for t in self.tag_refs:
            self.tags.append(t.name)

    @property
    def comments_count(self):
        return len(self.comments)

    def __unicode__(self): return self.title if self.title else (self.content if self.content else 'Empty Post')

    def on_create(self):
        from app.models.streams import ActivityStream
        if isinstance(self, Post):
            if self.parent is not None:
                ActivityStream.push_comment_to_stream(self)
            else:
                ActivityStream.push_content_to_stream(self)
        elif isinstance(self, PostVote):
            ActivityStream.push_vote_to_stream(self)
        else:
            ActivityStream.push_content_to_stream(self)


@update_content.apply
class Post(Content, db.Document):
    parent = db.GenericReferenceField()

    meta = {
        'allow_inheritance': True,
        'indexes': [
            {'fields': ['-modified_timestamp', 'slug'], 'unique': False, 'sparse': False, 'types': False },
            {'fields': ['-modified_timestamp', 'author'], 'unique': False, 'sparse': False, 'types': False },
        ],
    }

    @property
    def vote_count(self):
        return PostVote.objects(post=self).count()

    @property
    def votes(self):
        return PostVote.objects(post=self).all()

    def vote(self, voter_id, up):
        voter = Profile.objects(pk=voter_id).first()
        if PostVote.objects(post=self, voter=voter).count() > 0:
            return
        PostVote(voter=voter, up_vote=up, post=self).save()

    @property
    def up_votes(self):
        return PostVote.objects(post=self, up=True).count()

    @property
    def down_votes(self):
        return PostVote.objects(post=self, up=False).count()


class PostVote(db.Document):
    post = db.ReferenceField('Post')
    up_vote = db.BooleanField()
    voter = db.ReferenceField('Profile')

    meta = {
        'indexes': [
            {'fields': ['post', 'voter'], 'unique': False, 'sparse': False, 'types': False },
        ],
    }


class Journal(Content):
    published = db.BooleanField()
    published_timestamp = db.DateTimeField()
    admin_published = db.BooleanField()


@update_content.apply
class Article(Journal, db.Document):
    meta = {
        'indexes': [
            {'fields': ['-modified_timestamp', '-published_timestamp', 'author'], 'unique': False, 'sparse': False, 'types': False },
            {'fields': ['-modified_timestamp', '-published_timestamp', 'title'], 'unique': False, 'sparse': False, 'types': False },
        ],
    }


@update_content.apply
class Blog(Journal, db.Document):
    meta = {
        'indexes': [
            {'fields': ['-modified_timestamp', '-published_timestamp', 'author'], 'unique': False, 'sparse': False, 'types': False },
            {'fields': ['-modified_timestamp', '-published_timestamp', 'title'], 'unique': False, 'sparse': False, 'types': False },
        ],
    }


@update_content.apply
class Discussion(Journal, db.Document):
    meta = {
        'indexes': [
            {'fields': ['-modified_timestamp', '-published_timestamp', 'author'], 'unique': False, 'sparse': False, 'types': False },
            {'fields': ['-modified_timestamp', '-published_timestamp', 'title'], 'unique': False, 'sparse': False, 'types': False },
        ],
    }
