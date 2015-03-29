from base64 import decodestring
from app.models import NodeFactory
from app.models.profile import Profile, ProfileType

__author__ = 'arshad'

from flask import render_template, g, request, jsonify, send_file, flash, redirect, url_for, session
from app.views import login_required
from app import app
from StringIO import StringIO
from PIL import Image
import random, os

@app.route('/dialog/upload_image', methods=['GET', 'POST'])
@login_required
def image_uploader_dialog():
    if request.method == 'POST':
        _id = str(random.randint(9999999999999, 999999999999999999))
        try:
            f = request.files['0']
            f.save(os.getcwd() + '/tmp/' + _id)
            return jsonify(dict(status='success', id=_id))
        except Exception, e:
            raise e
    return render_template('/generic/includes/modal_image_uploader.html', user=g.user)

@app.route('/temp_image/<id>')
@login_required
def get_image_temp(id):
    f = Image.open(os.getcwd() + '/tmp/' + id)
    buffer = StringIO()
    f.save(buffer, f.format)
    buffer.seek(0)
    return send_file(buffer, mimetype='image/' + f.format, add_etags=False, conditional=True)

@app.route("/media/<model_class>/<id>/gallery")
@app.route("/media/<model_class>/<id>/gallery/<int:index>")
def get_gallery_image(model_class, id, index=0):
    if (id and model_class) is None:
        return 'Not found', 404
    model = NodeFactory.get_by_id(model_class, id)
    size = len(model.image_gallery) if hasattr(model, 'image_gallery') else 0
    if size is 0:
        return 'Not Found', 404
    if index >= size:
        index = size - 1
    img, format = model.get_gallery_image(index)
    return send_file(img, mimetype="image/%s" % format.lower())

@app.route("/media/<model_class>/<id>/cover")
def get_cover_image(model_class, id):
    if (id and model_class) is None:
        return 'Not found', 404
    model = NodeFactory.get_by_id(model_class, id)
    img, format = model.get_cover_image()
    if img is None:
        return ''
    return send_file(img, mimetype="image/%s" % format.lower())


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
        profile = Profile.create_new(name, email, "", is_verified=True, roles=['Enthusiast'])
        profile.save()

    if profile.is_social_login is None or not profile.is_social_login:
        profile.is_social_login = True
        profile.save()


    if profile.is_social_login and profile.id:
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
                profile.cover_image.put(buffer)
                profile.save()
            except Exception, e:
                raise e

        session['user'] = str(profile.id)
        return jsonify(dict(location='/stream/me', status='success'))

    return jsonify(dict(location=url_for('login'), status='error'))

@app.route('/login-modal', methods=['GET'])
def login_modal():
    return render_template('site/modals/login.html')

@app.route('/registration-modal', methods=['GET'])
def registration_modal():
    return render_template('site/modals/registration.html')

@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('username', None)
        password = request.form.get('password', None)
        profile = Profile.authenticate(email, password)
        if profile and profile.id:
            session['user'] = str(profile.id)
            return jsonify(dict(status='success', message='Successfully logged in.', node=str(profile.id)))
    return jsonify(dict(status='error', message='Failed to register. Please try again.'))

@app.route('/register', methods=['GET', 'POST'])
def registration():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        password = request.form['password']
        confirm = request.form['confirm']
        if password != confirm:
            flash('Passwords do not match', category='danger')
            return redirect(url_for('registration'))
        type = ProfileType.objects(name__icontains='subscription')
        if Profile.objects(email__iexact=email, type__ne=type).first():
            flash('Email already exists, have you forgotten your password?', category='danger')
            return redirect(url_for('registration'))
        type = ProfileType.objects(name__icontains='enthusiast')
        profile = Profile(name=name, email=email, type=type, roles=['Basic User'])
        profile.password  = password
        profile.save()
        if profile and profile.id:
            session['user'] = str(profile.id)
            """
            mail_data = render_template('notifications/successfully_registered.html', user=profile)
            send_single_email("[Fitrangi] Successfully registered", to_list=[profile.email], data=mail_data)
            """
            return jsonify(dict(status='success', message='Profile created and logged in.', node=str(profile.id)))
    return jsonify(dict(status='error', message='Failed to register. Please try again.'))

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
