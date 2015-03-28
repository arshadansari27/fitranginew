from app.views.site.extractors import NodeExtractor

__author__ = 'arshad'

from flask import jsonify


class NodeEditor(object):

    def __init__(self, message):
        self.message = message

    def invoke(self):
        status, node, message = self.__execute()
        return jsonify(dict(status=status, node=node, message=message))

    def __execute(self):
        self.node = self.__get_by_id(self.message['node_id'])
        action = self.message['action']
        if action == 'upload_cover_image':
            return self.__upload_cover_image()
        elif action == 'remove_cover_image':
            return self.__remove_cover_image()
        elif action == 'upload_to_image_gallery':
            return self.__upload_to_image_gallery()
        elif action == 'remove_from_image_gallery':
            return self.__remove_from_image_gallery()
        else:
            return self.execute()

    def __upload_cover_image(self):
        pass

    def __remove_cover_image(self):
        pass

    def __upload_to_image_gallery(self):
        pass

    def __remove_from_image_gallery(self):
        pass

    def execute(self):
        raise Exception("Not Implemented")

    def __get_by_id(self, id):
        if not (isinstance(id, str) or isinstance(id, unicode)):
            id = str(id)
        node = NodeExtractor.factory(self.message['type'])().model_class().objects(pk=id).first()
        if not node:
            raise Exception("Node not found")
        return node


    @classmethod
    def factory(cls, message):
        type = message['type']
        if type is None:
            raise Exception("Invalid message")
        else:
            if type == 'profile':
                return ProfileEditor
            elif type == 'activity':
                return ActivityEditor
            elif type == 'adventure':
                return AdventureEditor
            elif type == 'trip':
                return TripEditor
            elif type == 'event':
                return EventEditor
            elif type in ['article', 'blog']:
                return ContentEditor
            elif type == 'post':
                return PostEditor
            elif type == 'activity_stream':
                return StreamEditor
            else:
                raise Exception("Not implemented")


class ProfileEditor(NodeEditor):

    def execute(self):
        action = self.message['action']
        if action == 'change_password':
            pass
        elif action == 'edit_model':
            pass

class ActivityEditor(NodeEditor):
    pass

class AdventureEditor(NodeEditor):
    pass

class TripEditor(NodeEditor):
    pass

class EventEditor(NodeEditor):
    pass

class ContentEditor(NodeEditor):
    pass

class StreamEditor(NodeEditor):
    pass

class PostEditor(NodeEditor):
    pass
