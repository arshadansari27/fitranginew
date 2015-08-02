__author__ = 'arshad'

from app import mandrill
from app.models.profile import Profile
import os


SEND_EMAILS = False if os.getenv('SEND_EMAILS', 0) in ['1', 1] else True
print 'SEND EMAILS SET TO', SEND_EMAILS

def send_single_email(subject, from_email='admin@fitrangi.com', to_list=[], data='', force_send=False):
    to_email = []
    for t in to_list:
        p = Profile.objects(email__iexact=t).first()
        if force_send or 'Admin' in p.roles or p.email_enabled is not False or not hasattr(p, 'email_enabled'):
            to_email.append({'email': t})

    if SEND_EMAILS:
        mandrill.send_email(from_email=from_email, from_name="Fitrangi Team", subject=subject, to=to_email, html=data, text=data)

def send_email_from_template(template_name, subject, from_email='admin@fitrangi.com', to_list=[], force_send=False, **context):
    global bootstrap_css, my_style_css
    from app.views import env
    try:
        template_path = template_name
        template = env.get_template(template_path)
        html = template.render(**context)
        print html
        send_single_email(subject, from_email, to_list, data=html, force_send=force_send)
    except Exception, e:
        print '\n', '*' * 100,'\n','Failed to sent email', str(e), '\n','*' * 100
