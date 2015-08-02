__author__ = 'arshad'

from app.handlers.messaging import send_single_email, send_email_from_template

from app.models.profile import Profile, ProfileType
from flask import render_template, g, request, jsonify, send_file, flash, redirect, url_for, session, make_response
from app import app
import random, os
from . import login_user_session


@app.route('/mail-template')
@app.route('/mail-template/')
@app.route('/mail-template/<template_name>')
def view_mail_template(template_name="generic_mail_template.html"):
    if not hasattr(g, 'user') or g.user is None or 'Admin' not in g.user.roles:
        return 'Forbidden', 403
    b_file = open(os.getcwd() + '/app/assets/css/bootstrap.min.css', 'r').read().decode('utf-8')
    m_file = open(os.getcwd() + '/app/assets/css/my-style.css','r').read().decode('utf-8')
    return render_template("/notifications/%s" % template_name, user=g.user, b_file=b_file, m_file=m_file)



@app.route('/email-verification/<id>/<linkr>')
def verify_email(id, linkr):
    if not id or not linkr:
        return 'Verification Failed', 400
    try:
        profile = Profile.verify_user(id, linkr)
    except:
        flash('Verification failed.', category='danger')
        return redirect('/')

    if profile is True or profile.id:
        flash('Verified Successfully', category='success')
        try:
            context = dict(user=profile)
            send_email_from_template('notifications/email_verification_success.html', "[Fitrangi] Thank your for successful verification", to_list=[profile.email], force_send=True, **context)
        except:
            pass
        login_user_session(profile)
    return redirect('/')

@app.route('/generate-verification/<id>')
def generate_verification(id):
    if not id:
        return 'Invalid id', 404
    try:
        profile = Profile.objects(pk=str(id)).first()
        link = profile.create_verification_link()
        print 'id: ', id, link
        try:
            if 'fitrangi.com' in request.host:
                host = 'http://www.fitrangi.com'
            else:
                host = 'http://localhost:4500'
            context = dict(user=profile, link="%s%s" % (host, link))
            send_email_from_template('notifications/email_verification.html', "[Fitrangi] Verification email", to_list=[profile.email], force_send=True, **context)
            flash('Successfully sent verification email.', category='success')
            return redirect('/')
        except:
            flash('Failed to send verification email, please try again later', category='danger')
        if not profile:
            flash('Failed to send verification email, please try again later', category='danger')
        return redirect('/')
    except:
        return redirect('/')




