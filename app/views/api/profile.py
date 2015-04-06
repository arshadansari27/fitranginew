from flask.ext.mongorest import methods
from flask.ext.restful import Resource
from app.models.profile import ProfileType, Profile
from app.models.relationships import RelationShips
from flask.ext.mongorest import operators as ops

__author__ = 'arshad'


class ProfileTypeResource(Resource):
    document = ProfileType
    methods = [methods.Create, methods.Update, methods.Fetch, methods.List]

class ProfileResource(Resource):

    document = Profile
    methods = [methods.Create, methods.Update, methods.Fetch, methods.List]

    related_resources = {
        'type': ProfileTypeResource
    }

    filters = {
        'name': [ops.Contains, ops.Exact],
        'email': [ops.Exact]
    }

