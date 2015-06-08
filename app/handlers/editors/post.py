from app.handlers.editors import NodeEditor, response_handler
from app.handlers.extractors import NodeExtractor
from app.models import POST, CHANNEL
from app.models.content import Post, Comment
from app.models.streams import ActivityStream
from flask import g, jsonify
import os, datetime

__author__ = 'arshad'


class PostEditor(NodeEditor):

    def _invoke(self):
        if   self.command == 'add':
            return add(self.data)
        elif self.command == 'delete':
            return delete(self.node)
        elif self.command == 'comment':
            return comment(self.node, self.data)
        elif self.command == 'vote':
            return vote(self.node, self.data)
        elif self.command == 'unvote':
            return unvote(self.node, self.data)
        else:
            raise Exception('Invalid command')

@response_handler('Successfully deleted the post', 'Failed to remove the post')
def delete(node):
    post = get_or_create_post(node)
    post.delete()
    return post


def get_or_create_post(id=None):
    if id:
        post = NodeExtractor.factory(POST).get_single('pk:%s;' % str(id))
        return post
    else:
        post = Post()
        post.save()
        return post


@response_handler('Successfully added the post', 'Failed to add post')
def add(data):
    content         = data.get('content', '')
    author          = g.user
    post_type       = data.get('post_type', None)
    parent          = data.get('parent', None)
    assert post_type is not None
    if parent:
        parent_type = data.get('parent_type', None)
        extractor   = NodeExtractor.factory(parent_type.lower())
        parent      = extractor.get_single('pk:%s;' % str(parent))
    image = data.get('image')
    if image and len(image) > 0:
        image       = image.split('/')[-1]
        path        = os.getcwd() + '/tmp/' + image
    else:
        path        = None
    post = get_or_create_post(None)
    post.content = content
    post.author = author
    post.type = post_type
    post.parent = parent
    if path:
        post.cover_image.put(open(path, 'rb'))
    post.save()
    if post_type == 'comment':
        ActivityStream.push_comment_to_stream(post)
    elif post_type == 'review':
        ActivityStream.push_review_to_stream(post)
    else:
        ActivityStream.push_stream_post_to_stream(post)
    if parent:
        parent.modified_timestamp = datetime.datetime.now()
        parent.save()
    return post

@response_handler('Successfully voted on post', 'Failed to vote')
def vote(node, data):
    post = NodeExtractor.factory(POST).get_single('pk:%s;' % str(node))
    user = data['user']
    up = data['up']
    if not post or not user:
        raise Exception("Invalid parameters")
    post.vote(user, up)
    return post

@response_handler('Successfully removed vote from the post', 'Failed to vote')
def unvote(node, data):
    post = NodeExtractor.factory(POST).get_single('pk:%s;' % str(node))
    user = data['user']
    up = data['up']
    if not post or not user:
        raise Exception("Invalid parameters")
    post.unvote(user)
    return post

@response_handler('Successfully added comment on post', 'Failed to comment')
def comment(node, data):
    post = NodeExtractor.factory(POST).get_single('pk:%s;' % str(node))
    content = data.get('content', '')
    comment = Comment(author=g.user, content=content)
    post.comments.append(comment)
    post.save()
    ActivityStream.push_comment_to_stream(post)
    return post


