__author__ = 'arshad'

from app import mandrill
import os

SEND_EMAILS = False if os.getenv('SEND_EMAILS', 0) in ['1', 1] else True
print 'SEND EMAILS SET TO', SEND_EMAILS

def send_single_email(subject, from_email='admin@fitrangi.com', to_list=[], data=''):

    to_email = [{'email': t} for t in to_list]
    print 'Sending emails to: ', to_email
    if SEND_EMAILS:
        mandrill.send_email(from_email=from_email, from_name="Fitrangi Team", subject=subject, to=to_email, html=data, text=data)


