__author__ = 'arshad'

from wtforms import Form, PasswordField, BooleanField, SelectField, TextAreaField
from wtforms.fields import TextAreaField, HiddenField, TextField
from wtforms.widgets import TextInput
from wtforms.fields import StringField
from wtforms.widgets import TextInput

class ClassedWidgetMixin(object):
    """Adds the field's name as a class
    when subclassed with any WTForms Field type.

    Has not been tested - may not work."""
    def __init__(self, *args, **kwargs):
        super(ClassedWidgetMixin, self).__init__(*args, **kwargs)

    def __call__(self, field, **kwargs):
        c = kwargs.pop('class', '') or kwargs.pop('class_', '')
        kwargs['class'] = u'geo_complete'
        return super(ClassedWidgetMixin, self).__call__(field, **kwargs)

# An example
class ClassedTextInput(ClassedWidgetMixin, TextInput):
    pass


class ChangePasswordForm(Form):
    current_password = PasswordField()
    new_password = PasswordField()
    confirm_password = PasswordField()


class UserPreferenceForm(Form):
    sms_enabled = BooleanField("Receive sms notifications", [])
    email_enabled = BooleanField("Receive email notifications", [])
    email_frequency = SelectField("Receive emails every", choices=(('daily', "Daily"), ('weekly', 'Weekly'), ('monthly', 'Monthly')))


class ProfileForm(Form):
    name = TextAreaField()
    about = TextAreaField()
    phone = TextAreaField()
    website = TextAreaField()
    facebook = TextAreaField()
    twitter = TextAreaField()
    google_plus = TextAreaField()
    linked_in= TextAreaField()
    youtube_channel = TextAreaField()
    blog_channel = TextAreaField()

class LocationForm(Form):
    location = StringField()
    formatted_address = HiddenField()
    lat = HiddenField()
    lng = HiddenField()
    locality_short = HiddenField()
    administrative_area_level_2 = HiddenField()
    administrative_area_level_1 = HiddenField()
    country_short = HiddenField()
