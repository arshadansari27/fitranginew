__author__ = 'arshad'

from flask import request, redirect, flash, g, render_template, jsonify, send_file, url_for

from app.handlers.editors.model_editor import ModelEditor
from app.handlers.messaging import send_single_email
from app import app
from app.handlers import login_required, redirect_url
from app.models import Profile, Post, Content
from StringIO import StringIO
import random, os
from PIL import Image



from app.models import PROFILE, ACTIVITY, ADVENTURE, ARTICLE, BLOG, POST, EVENT, TRIP
from app.views.site.extractors import NodeExtractor

__author__ = 'arshad'

from flask import jsonify


class NodeEditor(object):

    def __init__(self, message):
        self.message = message

    def invoke(self):
        status, node, message = self.__execute()
        return jsonify(dict(status=status, node=node, message=message))

    def __execute(self):
        self.node = self.__get_by_id(self.message['node_id'])
        action = self.message['action']
        if action == 'upload_cover_image':
            return self.__upload_cover_image()
        elif action == 'remove_cover_image':
            return self.__remove_cover_image()
        elif action == 'upload_to_image_gallery':
            return self.__upload_to_image_gallery()
        elif action == 'remove_from_image_gallery':
            return self.__remove_from_image_gallery()
        else:
            return self.execute()

    def __upload_cover_image(self):
        pass

    def __remove_cover_image(self):
        pass

    def __upload_to_image_gallery(self):
        pass

    def __remove_from_image_gallery(self):
        pass

    def execute(self):
        raise Exception("Not Implemented")

    def __get_by_id(self, id):
        if not (isinstance(id, str) or isinstance(id, unicode)):
            id = str(id)
        node = NodeExtractor.factory(self.message['type'])().model_class().objects(pk=id).first()
        if not node:
            raise Exception("Node not found")
        return node


    @classmethod
    def factory(cls, message):
        type = message['type']
        if type is None:
            raise Exception("Invalid message")
        else:
            if type == PROFILE:
                return ProfileEditor
            elif type == ACTIVITY:
                return ActivityEditor
            elif type == ADVENTURE:
                return AdventureEditor
            elif type == TRIP:
                return TripEditor
            elif type == EVENT:
                return EventEditor
            elif type in [ARTICLE, BLOG]:
                return ContentEditor
            elif type == POST:
                return PostEditor
            elif type == 'stream':
                return StreamEditor
            else:
                raise Exception("Not implemented")


class ProfileEditor(NodeEditor):

    def execute(self):
        action = self.message['action']
        if action == 'change_password':
            pass
        elif action == 'edit_model':
            pass

class ActivityEditor(NodeEditor):
    pass

class AdventureEditor(NodeEditor):
    pass

class TripEditor(NodeEditor):
    pass

class EventEditor(NodeEditor):
    pass

class ContentEditor(NodeEditor):
    pass

class StreamEditor(NodeEditor):
    pass

class PostEditor(NodeEditor):
    pass

"""
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
    image = request.form["image"]
    if image:
        img_path = os.getcwd() + '/tmp/' + image if len(image) > 0 else None
    else:
        raise Exception("invalid Image")
    f = Image.open(img_path)
    buffer = StringIO()
    f.save(buffer, f.format)
    buffer.seek(0)
    content = Content.get_by_id(model)
    content.upload_image(buffer)
    content.save()
    os.remove(img_path)
    flash("Successfully updated the image", category='success')
    return redirect(request.referrer)




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
"""
