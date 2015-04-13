from app.handlers.editors import NodeEditor, response_handler
from app.handlers.extractors import NodeExtractor
from app.models import POST, CHANNEL, DISCUSSION, ARTICLE, Node, NodeFactory
from app.models.streams import ActivityStream
from flask import g, jsonify
import os

__author__ = 'arshad'


class ContentEditor(NodeEditor):

    def __init__(self, message, type):
        super(ContentEditor, self).__init__(message)
        self.type = type

    def _invoke(self):
        if  self.command == 'add':
            return add(self.type, self.data)
        elif self.command == 'edit':
            return edit(self.node, self.type, self.data)
        elif self.command == 'delete':
            return delete(self.node, self.type)
        elif self.command == 'publish':
            return publish(self.node, self.type)
        elif self.command == 'unpublish':
            return unpublish(self.node, self.type)
        else:
            raise Exception('Invalid command')

@response_handler('Successfully deleted the post', 'Failed to remove the post')
def delete(node):
    node = get_or_create_content(node)
    node.delete()
    return node


def get_or_create_content(type, id=None):

    if id:
        node = NodeExtractor.factory(type, dict(pk=id)).get_single()
        return node
    else:
        cls = NodeFactory.get_class_by_name(type)
        node = cls()
        node.save()
        return node

@response_handler('Successfully added the content', 'Failed to add content')
def add(type, data):
    return __edit(None, type, data)


@response_handler('Successfully updated the content', 'Failed to update content')
def edit(node, type, data):
    return __edit(node, type, data)

def __edit(node, type, data):
    title = data.get('title', None)
    if not title:
        raise Exception("title is required")
    description = data.get('description', '')
    content         = data.get('content', '')
    author          = g.user
    tags = data.get('tags', None)
    channels = NodeExtractor.factory(CHANNEL, dict(name='Journal')).get_list(True, 1, 1)
    assert len(channels) > 0

    image = data.get('image')
    if image and len(image) > 0:
        image       = image.split('/')[-1]
        path        = os.getcwd() + '/tmp/' + image
    else:
        path        = None
    obj = get_or_create_content(type, node)
    obj.title = title
    obj.content = content
    obj.author = author
    obj.tags = tags
    obj.description = description
    if channels:
        obj.channels = channels
    if path:
        obj.cover_image.put(open(path, 'rb'))
    obj.save()
    return obj

@response_handler('Successfully published the content', 'Failed to publish')
def publish(node, type):
    if not node or not type:
        raise Exception("invalid parameters")
    content = NodeExtractor.factory(type, dict(pk=node)).get_single()
    if not content:
        raise Exception("Invalid content")
    if content.published:
        return content
    content.published = True
    content.save()
    ActivityStream.push_content_to_stream(content)
    return content

@response_handler('Successfully unpublished the content', 'Failed to unpublish')
def unpublish(node, type):
    if not node or not type:
        raise Exception("invalid parameters")
    content = NodeExtractor.factory(type, dict(pk=node)).get_single()
    if not content:
        raise Exception("Invalid content")
    if not content.published:
        return content
    content.published = False
    content.save()
    return content


