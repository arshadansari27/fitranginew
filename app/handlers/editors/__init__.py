__author__ = 'arshad'

from flask import request, redirect, flash, g, render_template, jsonify, send_file, url_for

from app.handlers.editors.model_editor import ModelEditor
from app.handlers.messaging import send_single_email
from app import app
from app.handlers import login_required, redirect_url
from app.models.models import Profile, Post
from StringIO import StringIO
import random, os
from PIL import Image

@app.route('/model/<channel>/<key>/edit', methods=['GET', 'POST'])
@app.route('/model/<channel>/add', methods=['GET', 'POST'])
@login_required
def model_editor_view(channel, key=None):
    if request.method == 'POST':
        form = {}
        for k, v in request.form.iteritems():
            if k == 'facets':
                try:
                    form[k] = request.form.getlist(k)
                except:
                    form[k] = request.form[k]
            elif k == 'tags':
                form['facets'] = [u.strip() for u in v.split(',')]
            else:
                form[k] = v
        if form.get('action', None) and form['action'] == 'update_existing':
            form['channels'] = [channel]

        print 'Form data: ', str(form)
        if key:
            ModelEditor(key, channel_name=channel, form=form).update()
        else:

            me = ModelEditor(key, channel_name=channel, form=form)
            me.add_new()
            key = str(me.model.id)
            return redirect('/model/%s/%s/edit' % (channel, key))
    if key:
        return ModelEditor(key, channel_name=channel).render()
    else:
        return ModelEditor(key, channel_name=channel).render()


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
            print e
            raise e
    else:
        print 'Rending GET'
    return render_template('/generic/includes/modal_image_uploader.html', user=g.user)

@app.route('/temp_image/<id>')
@login_required
def get_image_temp(id):
    f = Image.open(os.getcwd() + '/tmp/' + id)
    buffer = StringIO()
    f.save(buffer, f.format)
    buffer.seek(0)
    return send_file(buffer, mimetype='image/' + f.format, add_etags=False, conditional=True)


@app.route("/make_post", methods=['POST'])
@login_required
def make_post():
    if request.method != 'POST':
        return redirect(url_for('stream', (None,)))
    try:
        post_data = request.form["post_data"]
        img_path = os.getcwd() + '/tmp/' + request.form['image_attached'] if len(request.form['image_attached']) > 0 else None
        f = Image.open(img_path)
        buffer = StringIO()
        f.save(buffer, f.format)
        buffer.seek(0)
        p = Post()
        p.add_new(g.user, text=post_data, channels=['Post'])
        p.upload_image(buffer)
        flash("Successfully posted.", category='success')
        os.remove(img_path)
        return redirect('/stream/me')
    except Exception, e:
        print e
        flash("Unable to post.", category='error')
        return redirect('stream/me')

@app.route('/profile/remove-favorites', methods=['POST'])
@login_required
def remove_from_favorites():
    return profile_toggle(lambda me, other: me.remove_from_favorites(other), 'Successfully removed', 'Failed to remove')

@app.route('/profile/add-favorites', methods=['POST'])
@login_required
def add_to_favorites():
    return profile_toggle(lambda me, other: me.add_to_favorites(other), 'Successfully added to favorites ', 'Failed to Add')


@app.route('/profile/follow', methods=['POST'])
@login_required
def follow():
    return profile_toggle(lambda me, other: me.follow(other), 'Successfully Followed', 'Failed to Follow')

@app.route('/profile/unfollow', methods=['POST'])
@login_required
def unfollow():
    return profile_toggle(lambda me, other: me.unfollow(other), 'Successfully Unfollowed', 'Failed to Unfollow')


def profile_toggle(func, success_message, failed_message):
    model_id = request.args.get('profile', None)
    if not model_id or not g.user:
        flash(failed_message, category='error')
        return redirect(redirect_url())
    else:
        me = g.user
        other = Profile.objects(pk=model_id).first()
        func(me, other)
        flash(success_message, category='success')
        return redirect(redirect_url())
