__author__ = 'arshad'

from app import mandrill
import os


SEND_EMAILS = True or False if os.getenv('SEND_EMAILS', 0) in ['1', 1] else True
print 'SEND EMAILS SET TO', SEND_EMAILS

def send_single_email(subject, from_email='admin@fitrangi.com', to_list=[], data=''):
    to_email = [{'email': t} for t in to_list]
    if SEND_EMAILS:
        mandrill.send_email(from_email=from_email, from_name="Fitrangi Team", subject=subject, to=to_email, html=data, text=data)

def send_email_from_template(template_name, subject, from_email='admin@fitrangi.com', to_list=[], **context):
    global bootstrap_css, my_style_css
    from app.views import env
    try:
        template_path = template_name
        template = env.get_template(template_path)
        html = template.render(**context)
        print html
        send_single_email(subject, from_email, to_list, data=html)
    except Exception, e:
        print '\n', '*' * 100,'\n','Failed to sent email', str(e), '\n','*' * 100
