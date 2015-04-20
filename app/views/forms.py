__author__ = 'arshad'

from wtforms import Form, PasswordField, BooleanField, SelectField, TextAreaField
from wtforms.fields import TextAreaField, HiddenField
from wtforms.widgets import TextInput

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
    name = TextAreaField()
    geo_location_name = HiddenField()
    geo_location_lat = HiddenField()
    geo_location_long = HiddenField()
