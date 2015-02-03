__author__ = 'arshad'

from app import mandrill

def send_single_email(subject, from_email='admin@fitrangi.com', to_list=[], data=''):
    to_email = [{'email': t} for t in to_list]
    print 'Sending emails to: ', to_email
    mandrill.send_email(from_email=from_email, from_name="Fitrangi Team", subject=subject, to=to_email, html=data, text=data)


