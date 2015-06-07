from app.handlers.editors import NodeEditor, response_handler
from app.handlers.extractors import NodeExtractor
from app.models import POST, CHANNEL, DISCUSSION, ARTICLE, Node, NodeFactory
from app.models.profile import ProfileType, Profile
from app.models.streams import ActivityStream
from flask import g, jsonify, render_template, flash
import os

__author__ = 'arshad'


class ContentEditor(NodeEditor):

    def __init__(self, message, type):
        super(ContentEditor, self).__init__(message)
        self.type = type

    def _invoke(self):
        if  self.command == 'add':
            if self.type == 'article':
                return add_content(self.type, self.data)
            else:
                return add_discussion(self.type, self.data)
        elif self.command == 'edit':
            if self.type == 'article':
                return edit(self.node, self.type, self.data)
            else:
                return edit(self.node, self.type, self.data)
        elif self.command == 'delete':
            return delete(self.node, self.type)
        elif self.command == 'publish':
            return publish(self.node, self.type)
        elif self.command == 'unpublish':
            return unpublish(self.node, self.type)
        else:
            raise Exception('Invalid command')

@response_handler('Successfully deleted', 'Failed to delete', flash_message=True)
def delete(node, type):
    node = get_or_create_content(type, node)
    node.delete()
    flash('Delete successful')
    return node


def get_or_create_content(type, id=None):
    print '[*] Get content: ', type, id
    if id:
        node = NodeExtractor.factory(type).get_single('pk:%s;' % str(id))
        if not node:
            raise Exception("Node not found!")
        return node
    else:
        cls = NodeFactory.get_class_by_name(type)
        node = cls()
        node.save()
        return node

@response_handler('Successfully added the content', 'Failed to add content', flash_message=True)
def add_content(type, data):
    return __edit(None, type, data)

@response_handler('Thank you for posting the discussion. Pending Admin Approval. you will be notified once it is approved by admin.', 'Failed to add content', flash_message=True)
def add_discussion(type, data):
    return __edit(None, type, data)


@response_handler('Successfully updated the content', 'Failed to update content', flash_message=True)
def edit(node, type, data):
    return __edit(node, type, data)

def __edit(node, type, data):
    title = data.get('title', None)
    if not title:
        raise Exception("title is required")
    description = data.get('description', '')
    content         = data.get('content', '')
    video = data.get('video', '')
    author          = g.user
    tags = data.get('tags', None)
    if type == 'article':
        channels = NodeExtractor.factory(CHANNEL).get_list('name:Journal;', True, 1, 1)
    else:
        channels = []

    image = data.get('image')
    if image and len(image) > 0:
        image       = image.split('/')[-1]
        path        = os.getcwd() + '/tmp/' + image
    else:
        path        = None
    obj = get_or_create_content(type, node)
    obj.title = title
    obj.content = content
    if video:
        if not obj.video_embed:
            obj.video_embed = []
        obj.video_embed.append(video)
    obj.author = author
    obj.tags = tags
    obj.description = description
    if channels:
        obj.channels = channels
    if path:
        obj.cover_image.put(open(path, 'rb'))
    if type == 'discussion':
        obj.published = True
    obj.save()
    return obj

@response_handler('Thank you for posting the content. Pending Admin Approval. you will be notified once it is approved by admin.', 'Failed to publish', flash_message=True)
def publish(node, type):
    if not node or not type:
        raise Exception("invalid parameters")
    content = NodeExtractor.factory(type).get_single('pk:%s' % str(node))
    if not content:
        raise Exception("Invalid content")
    if content.published:
        return content
    content.published = True
    content.save()
    if content.published and (not hasattr(content, 'admin_published') or not content.admin_published):
        profiles = [u for u in Profile.objects(roles__in=['Admin']).all()]
        from app.handlers.messaging import send_single_email
        if not profiles or len(profiles) is 0:
            print '[*] Publish Mail: Unable to send email to admin'
        for p in profiles:
            if not p or not p.email or p.email != 'fitrangi@gmail.com':
                continue
            mail_data = render_template('notifications/content_posted_admin.html', user=p, content=content)
            send_single_email("[Fitrangi] Content awaiting approval", to_list=[p.email], data=mail_data)
            print '[*] Publish Mail: Sending mail to %s' % p.name
    ActivityStream.push_content_to_stream(content)
    return content

@response_handler('Successfully unpublished the content', 'Failed to unpublish', flash_message=True)
def unpublish(node, type):
    if not node or not type:
        raise Exception("invalid parameters")
    content = NodeExtractor.factory(type).get_single('pk:%s' % str(node))
    if not content:
        raise Exception("Invalid content")
    if not content.published:
        return content
    content.published = False
    content.save()
    return content


