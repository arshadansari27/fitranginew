__author__ = 'arshad'

from base64 import decodestring
from app.handlers.messaging import send_single_email
from app.models import NodeFactory
from app.models.profile import Profile, ProfileType
import re, base64
from flask import render_template, g, request, jsonify, send_file, flash, redirect, url_for, session, make_response
from app.utils import login_required
from app import app
from StringIO import StringIO
from PIL import Image
import random, os

FOLDER = os.getcwd() + '/content-images'

@app.route('/user-csv-download')
def download_csv():
    if not hasattr(g, 'user') or g.user is None or 'Admin' not in g.user.roles:
        return 'Forbidden', 403
    csv = []
    profiles = Profile.objects.all()
    for p in profiles:
        csv.append(",".join([p.name if p.name else '', p.email, p.type[0].name if p.type and len(p.type) > 0 and p.type[0] is not None else '']))
    data = '\n'.join(csv)
    response = make_response(data)
    response.headers["Content-Disposition"] = "attachment; filename=users.csv"
    return response

@app.route('/dialog/upload_image', methods=['POST'])
@login_required
def image_uploader_dialog():
    _id = str(random.randint(9999999999999, 999999999999999999))
    try:
        f = request.files['file-0']
        perm = False
        if not request.args.get('permanent', False):
            path = os.getcwd() + '/tmp/' + _id
        else:
            if not os.path.exists(FOLDER):
                os.makedirs(FOLDER)
            perm = True
            path = FOLDER + '/' + _id
        f.save(path)
        i = Image.open(path)
        originalImgWidth , originalImgHeight = i.size
        if not perm:
            url =  "/temp_image/%s" % str(_id)
        else:
            url =  "/perm_image/%s" % str(_id)
        response = dict(status="success",
				url=url,
				width=originalImgWidth,
				height=originalImgHeight)
        return jsonify(response)
    except Exception, e:
        print '*' * 10, e
        raise e

@app.route('/dialog/cropped_image', methods=['POST'])
@login_required
def image_cropper_dialog():
    image_url = request.form.get('url', None)
    img = request.form.get('img', None)
    if image_url is None or len(image_url) is 0:
        return jsonify(dict(status='error', message='invalid url'))
    _id = image_url.split("/")[-1]
    path = os.getcwd() + '/tmp/' + _id
    if img is None or len(img) is 0:
        return jsonify(dict(status='error', message='invalid image'))
    dataUrlPattern = re.compile('data:image/(png|jpeg);base64,(.*)$')
    imgb64 = dataUrlPattern.match(img).group(2)
    if imgb64 is not None and len(imgb64) > 0:
        img = base64.b64decode(imgb64)
        with open(path , 'wb') as _f:
            _f.write(img)
    return jsonify(dict(status='success', url='/temp_image/%s' % str(_id)))

@app.route('/temp_image/<id>')
def get_image_temp(id):
    f = Image.open(os.getcwd() + '/tmp/' + id)
    buffer = StringIO()
    f.save(buffer, f.format)
    buffer.seek(0)
    return send_file(buffer, mimetype='image/' + f.format, add_etags=False, conditional=True)

@app.route('/perm_image/<id>')
def get_image_perm(id):
    f = Image.open(FOLDER + '/' + id)
    buffer = StringIO()
    f.save(buffer, f.format)
    buffer.seek(0)
    return send_file(buffer, mimetype='image/' + f.format, add_etags=False, conditional=True)

@app.route('/saveimagefromtemp', methods=['POST'])
@login_required
def save_image_from_temp():
    model = request.form["model"]
    type = request.form["type"]
    action = request.form['action']
    cls = NodeFactory.get_class_by_name(type)
    image = request.form["image"]
    if image:
        img_path = os.getcwd() + '/tmp/' + image if len(image) > 0 else None
    else:
        raise Exception("invalid Image")

    object = cls.objects(pk=model).first()
    f = open(img_path)
    if action == 'gallery':
        object.add_to_image_gallery(f)
    elif action == 'cover':
        object.add_cover_image(f)
    object.save()
    os.remove(img_path)
    flash("Successfully updated the image", category='success')
    return redirect(request.referrer)




@app.route('/sociallogin', methods=['POST'])
def social_login():
    if request.method != 'POST':
        return render_template('/generic/main/login.html')
    name = request.form['name']
    email = request.form['email']
    profile = Profile.objects(email__iexact=email).first()

    if profile is None or profile.id is None:
        types = [ProfileType.objects(name__icontains='enthusiast').first()]
        assert len(types) > 0
        profile = Profile(name=name, email=email, is_verified=True, roles=['Basic User'], type=types)
        profile.password = ''
        profile.save()

    if profile.is_social_login is None or not profile.is_social_login:
        profile.is_social_login = True
        profile.save()


    if profile.is_social_login and profile.id and hasattr(profile, 'uploaded_image_cover') and not profile.uploaded_image_cover:
        img_uploaded = request.form['file']
        if img_uploaded and len(img_uploaded) > 0:
            try:
                data = img_uploaded
                data = data[data.index(','):]
                s = StringIO(decodestring(data))
                img = Image.open(s)
                buffer = StringIO()
                img.save(buffer, img.format)
                buffer.seek(0)
                profile.cover_image.replace(buffer)
                profile.save()
                path = os.getcwd() + '/app/assets/' + profile.path_cover_image if profile.path_cover_image and len(profile.path_cover_image) > 0 else 'some-non-existent-path'
                if os.path.exists(path):
                    os.remove(path)

            except Exception, e:
                raise e

    if profile:
        session['user'] = str(profile.id)
        session['just_logged_in'] = True
        return jsonify(dict(location='/stream/me', status='success'))

    return jsonify(dict(location=url_for('login'), status='error'))

@app.route('/cover-image-modal', methods=['GET'])
def cover_image_modal():
    return render_template('site/modals/cover-edit.html')

@app.route('/login-modal', methods=['GET'])
def login_modal():
    return render_template('site/modals/login.html')

@app.route('/registration-modal', methods=['GET'])
def registration_modal():
    return render_template('site/modals/registration.html')

@app.route('/forgot-password-modal', methods=['GET'])
def forgot_password_modal():
    return render_template('site/modals/forgot-password.html')

@app.route('/change-password-modal', methods=['GET'])
@login_required
def change_password_modal():
    return render_template('site/modals/change-password.html', user=g.user)

@app.route('/edit-profile-modal', methods=['GET'])
@login_required
def edit_profile_modal():
    return render_template('site/modals/profile-edit.html', user=g.user)

@app.route('/edit-profile-preferences-modal', methods=['GET'])
@login_required
def edit_profile_preferences_modal():
    return render_template('site/modals/profile-preferences-edit.html', user=g.user)


@app.route('/forgot_password', methods=['POST'])
def forgot_password():
    email = request.form.get('email', None)
    if not email:
        return jsonify(dict(status='error', message='No email provided.'))
    try:
        profile = Profile.objects(email__iexact=email).first()
        if profile is None or profile.id is None or 'Subscription Only' in [u.name for u in profile.type]:
            return jsonify(dict(status='error', message='User does not exists.'))
        else:
            import random
            u, v, w = list('ABCEFGHIJKLMNOPQRSTUVWXYZ'), list('abcefghijklmnopqrstuvwxyz'), range(0, 10)
            random.shuffle(u), random.shuffle(v), random.shuffle(w)
            old_password = profile.password
            password = "%s%s%s" % (''.join(u[0:5]), ''.join(v[0:5]), ''.join(str(x) for x in w[0:3]))
            profile.password = password
            profile.save()
            from app.handlers.messaging import send_single_email
            flash("Successfully sent email with new password.", category='success')
            mail_data = render_template('notifications/password_reset.html', user=profile, password=password)
            send_single_email("[Fitrangi] Password reset on Fitrangi.com", to_list=[profile.email], data=mail_data)
            return jsonify(dict(status='success', message='Password has been reset, please check  your email.', node=str(profile.id)))
    except Exception,e:
        print e
        if profile and old_password:
            profile.password = old_password
            profile.save()
    return jsonify(dict(status='error', message='Cannot reset the password.'))

@app.route('/logout', methods=['GET', 'POST'])
@login_required
def logout():
    if hasattr(g, 'user'):
        g.user = None
    session.clear()
    return redirect(url_for('home'))

@app.before_request
def before_request():
    userid = session.get('user', None)
    if userid is None or len(userid) == 0:
        g.user = None
    else:
        user = Profile.objects(pk=userid).first()
        if user:
            g.user = user
        else:
            g.user = None
