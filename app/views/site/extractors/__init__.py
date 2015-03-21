from app.models.activity import Activity
from app.models.profile import Profile
from flask import render_template, g
from app.views import env

__author__ = 'arshad'

class NodeExtractor(object):

    def __init__(self, id):
        self.id = id
        self.model = self.__class__.get_model_class().objects(pk=self.id).first()

    @classmethod
    def get_model_class(cls):
        return cls.cls

    @classmethod
    def get_template_folder(cls):
        return cls.template_folder

    def get_context(self):
        return {}

    def __get_card(self, file_name):
        context = self.get_context()
        template_path = self.__class__.get_template_folder() + '/' +file_name
        template = env.get_template(template_path)
        return template.render(**context)

    def get_detail_card(self):
        return self.__get_card('detail.html')

    def get_list_row_card(self):
        return self.__get_card('row.html')

    def get_list_grid_card(self):
        return self.__get_card('card.html')


    def get_list_pod_card(self):
        return self.__get_card('pod.html')


class ProfileExtractor(NodeExtractor):
    cls = Profile
    template_folder = 'site/models/profile'

    def get_context(self):
        return dict(model=self.model)


if __name__ == '__main__':
    profile_extractor = ProfileExtractor('5506bf2f1b4596e7276c0ff9')
    print profile_extractor.get_detail_card()
