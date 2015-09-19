from ago import human
from app.utils import convertLinks
from bs4 import BeautifulSoup
import requests, os

__author__ = 'arshad'

from app.models import Node, update_content, db
from app.models.profile import Profile
import datetime

class Comment(db.EmbeddedDocument):
    author = db.ReferenceField('Profile')
    content = db.StringField()
    created_timestamp = db.DateTimeField(default=datetime.datetime.now)
    modified_timestamp = db.DateTimeField(default=datetime.datetime.now)

    @property
    def since(self):
        return human(self.created_timestamp, precision=1)

    @property
    def process_content(self):
        return convertLinks(self.content.replace('\n', '<br/>'))



class Channel(db.Document):
    name = db.StringField()
    type = db.StringField()
    parent = db.ReferenceField('Channel')

    def __unicode__(self):
        return self.name


class ContentCommon(Node):
    video_embed = db.ListField(db.StringField())
    map_embed = db.DictField()
    content = db.StringField()
    author = db.ReferenceField('Profile')

    @property
    def manager(self):
        return self.author

    def get_videos_list(self):
        if not self.video_embed or len(self.video_embed) is 0:
            return []

        videos = []
        for v in self.video_embed:
            if 'watch?' in v and 'v=' in v:
                video_id = v[v.index('v=') + 2:]
                videos.append('<embed class="col-sm-12" height="400px" src="http://www.youtube.com/v/%s">' % video_id)
                break

        return videos[0] if len(videos) > 0 else None


@update_content.apply
class Content(ContentCommon, db.Document):
    title = db.StringField()
    comments = db.ListField(db.ReferenceField('Post'))
    source = db.StringField()
    tags = db.ListField(db.StringField())
    channels = db.ListField(db.ReferenceField('Channel'))
    published = db.BooleanField()
    published_timestamp = db.DateTimeField()
    admin_published = db.BooleanField()
    views = db.IntField(default=0)

    meta = {
        'allow_inheritance': True,
        'indexes': [
            {'fields': ['-modified_timestamp', '-published_timestamp', 'author'], 'unique': False, 'sparse': False, 'types': False },
            {'fields': ['-modified_timestamp', '-published_timestamp', 'title'], 'unique': False, 'sparse': False, 'types': False },
        ],
    }

    @property
    def sorted_comments(self):
        return sorted(self.comments, reverse=True)

    def update_tags_list(self):
        self.tags = []
        for t in self.tag_refs:
            self.tags.append(t.name)

    @property
    def process_content(self):
        """

        soup = BeautifulSoup(self.content)
        images = soup.findAll('img')
        j = 0
        values = {}
        for i in images:
            src = i.attrs['src']
            rep = 'IMAGE_PATH_' + str(j)
            i.attrs['src'] = rep
            values[rep] = src
            j += 1
        new_content = str(soup)
        soup = BeautifulSoup())
        images = soup.findAll('img')
        j = 0
        for i in images:
            i.attrs['src'] = values.get(i.attrs['src'])
        return str(soup)
        """
        return self.content


    @property
    def comments_count(self):
        raw = {'parent._ref.$id': self.id}
        return Post.objects(__raw__=raw).count()

    def add_comment(self, content, author):
        comment = Post(parent=self, content=content, author=author)
        comment.save()
        self.comments.append(comment)
        self.save()
        return comment

    def remove_comment(self, comment_id):
        comment = Post.objects(pk=comment_id).firs()
        self.comments.remove(comment)
        self.save()
        comment.delete()

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

    def on_save(self):
        soup = BeautifulSoup(self.content)
        images = soup.findAll('img')
        for i, image in enumerate(images):
            src = image.attrs['src']
            if (src.startswith('/')):
                continue
            elif src.startswith('http'):
                data = requests.get(src).content
                ext = src.split('/')[-1].split('.')[-1]
            elif src.startswith('data:'):
                typo, data = src.split(',')
                ext = typo.split(';')[0].split('/')[1]
                data = data.decode('base64')
            else:
                raise Exception('Invalid image')
            base_path = os.getcwd() + '/app/assets'
            generic_path = '/media/%s/%s' % (self.__class__.__name__.lower(), str(self.id))
            file_path = "%s/%d.%s" % (generic_path, i, ext)
            if not os.path.exists(base_path + generic_path):
                os.makedirs(base_path + generic_path)
            with open(base_path + file_path, 'wb') as _f:
                _f.write(data)
            image.attrs['src'] = file_path

        self.content = str(soup)
        self.save()

@update_content.apply
class Post(ContentCommon, db.Document):
    parent = db.GenericReferenceField()
    comments = db.ListField(db.EmbeddedDocumentField(Comment))
    type = db.StringField(choices=['comment', 'review', 'stream', 'discussion'])

    meta = {
        'allow_inheritance': True,
        'indexes': [
            {'fields': ['-modified_timestamp', 'author'], 'unique': False, 'sparse': False, 'types': False },
        ],
    }

    def __repr__(self):
        return "%s %s" % (self.author.name if self.author and hasattr(self.author, 'name') and self.author.name else 'Anonymous', self.content[0: 25] if self.content and len(self.content) > 25 else self.content)

    def __unicode__(self):
        return "%s %s" % (self.author.name if self.author and hasattr(self.author, 'name') and self.author.name else 'Anonymous', self.content[0: 25] if self.content and len(self.content) > 25 else self.content)

    @property
    def partial_content(self):
        content = self.content
        split_content = content.split(' ')
        if len(split_content) > 20:
            split_content = split_content[:20]
        return convertLinks(' '.join(split_content))

    @property
    def sorted_comments(self):
        return sorted(self.comments, reverse=True)

    @property
    def process_content(self):
        return convertLinks(self.content.replace('\n', '<br/>'))

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

    def unvote(self, voter_id):
        voter = Profile.objects(pk=voter_id).first()
        if PostVote.objects(post=self, voter=voter).count() is 0:
            return
        op = all([u.delete() for u in PostVote.objects(post=self, voter=voter).all()])


    def voted(self, user_id, up):
        voter = Profile.objects(pk=user_id).first()
        vote = PostVote.objects(post=self, voter=voter).first()
        if not vote:
            return False
        if vote.up_vote == up:
            return True
        return False

    @property
    def up_votes(self):
        return PostVote.objects(post=self, up_vote=True).count()

    @property
    def down_votes(self):
        return PostVote.objects(post=self, up_vote=False).count()


class PostVote(db.Document):
    post = db.ReferenceField('Post')
    up_vote = db.BooleanField()
    voter = db.ReferenceField('Profile')

    meta = {
        'indexes': [
            {'fields': ['post', 'voter'], 'unique': False, 'sparse': False, 'types': False },
        ],
    }




@update_content.apply
class Article(Content):
    pass

@update_content.apply
class Discussion(Content):
    pass

class Advertisement(Node, db.Document):
    title = db.StringField()
    link = db.StringField()
    is_specific = db.BooleanField()

    def __repr__(self):
        return self.title

    def __unicode__(self):
        return self.__repr__()
