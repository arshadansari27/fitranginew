from app.handlers.editors import NodeEditor, response_handler
from app.handlers.extractors import NodeExtractor
from app.models import POST, CHANNEL
from app.models.content import Post, Comment
from app.models.streams import ActivityStream
from flask import g, jsonify
import os

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
        else:
            raise Exception('Invalid command')

@response_handler('Successfully deleted the post', 'Failed to remove the post')
def delete(node):
    post = get_or_create_post(node)
    post.delete()
    return post


def get_or_create_post(id=None):
    if id:
        post = NodeExtractor.factory(POST, dict(pk=id)).get_single()
        return post
    else:
        post = Post()
        post.save()
        post = NodeExtractor.factory(POST, dict(pk=post.id)).get_single()
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
        extractor   = NodeExtractor.factory(parent_type.lower(), {'pk': parent})
        parent      = extractor.get_single()
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
    return post

@response_handler('Successfully voted on post', 'Failed to vote')
def vote(node, data):
    post = NodeExtractor.factory(POST, dict(pk=node)).get_single()
    if not post:
        raise Exception("Invalid post")
    post.vote(g.user.id, data.get('up', False))
    return post

@response_handler('Successfully added comment on post', 'Failed to comment')
def comment(node, data):
    post = NodeExtractor.factory(POST, dict(pk=node)).get_single()
    content = data.get('content', '')
    comment = Comment(author=g.user, content=content)
    post.comments.append(comment)
    post.save()
    return post


