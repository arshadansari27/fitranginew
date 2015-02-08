__author__ = 'arshad'
from flask.ext.wtf import Form
from wtforms import TextField, PasswordField, validators, HiddenField, TextAreaField, BooleanField, FieldList, FormField
from wtforms.validators import Required, EqualTo, Optional, Length, Email


class UserReference(Form):
    name = TextField("Name", validators=[])
    id = HiddenField()


class ProfileEdit(Form):
    id = HiddenField()
    name = TextField('Name', validators=[Required()])
    email = TextField('Email address', validators=[
            Required('Please provide a valid email address'),
            Length(min=6, message=(u'Email address too short')),
            Email(message=(u'That\'s not a valid email address.'))
            ])
    username = TextField('Username', validators=[Required()])
    #agree = BooleanField('I agree all your <a href="/static/tos.html">Terms of Services</a>', validators=[Required(u'You must accept our Terms of Service')])
    phone = TextField('Phone', validators=[])
    address = TextAreaField('Address', validators=[])
    is_social_login = BooleanField('Is Social Login', default = False)
    facebook = TextField('Facebook Link', validators=[])
    linkedin = TextField('LinkedIN Link', validators=[])
    website = TextField('Website Link', validators=[])
    text = TextAreaField("About Me")


class UserEdit(ProfileEdit):
    pass

class ContentEdit(Form):
    pass

class EventEdit(Form):
    pass

class ProductEdit(Form):
    pass

class QuestionEdit(Form):
    pass

