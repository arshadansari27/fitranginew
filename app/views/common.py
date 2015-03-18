from app.models import NodeFactory

__author__ = 'arshad'

from flask import render_template, g, request, jsonify, send_file, flash, redirect
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
