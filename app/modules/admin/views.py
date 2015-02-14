from app.handlers import login_required

__author__ = 'arshad'


from flask import render_template,g, request,flash, redirect, jsonify
from mongoengine import Q
from flask.ext.classy import FlaskView, route
from app.modules.admin import admin_module
from app.models.forms import ProfileEdit
from app.models.models import Profile, Content

SIZE = 15

def get_start_end(page=1):
    start = (page - 1) * SIZE
    return start, start + SIZE


def get_content_list(facets, user, not_in=False, template="content_list.html", content_type="ALL", active="publishing"):
    page = request.args.get('page', 1)
    page = int(page)

    if request.method == 'POST':
        search = request.form['query']
        page = 1
    else:
        search = request.args.get('query', None)
    p = request.path + "?page=%d"
    if search:
        p += '&query=' + search
    if not_in:
        if search:
            query = Content.objects(Q(channels__nin=facets) & Q(title__icontains=search))
        else:
            query = Content.objects(channels__nin=facets)
    else:
        if search:
            query = Content.objects(Q(channels__in=facets) & Q(title__icontains=search))
        else:
            query = Content.objects(channels__in=facets)
    total = query.count()
    print "Query Found: %d" % total
    s, e = get_start_end(page)
    if s == 0:
        prev = None
    else:
        prev= p % (page - 1)
    if e >= total:
        next = None
    else:
        next = p % (page + 1)
    contents = query.all()[s: e]
    return render_template(template, content_type=content_type, contents=contents, user=user, active=active, prev=prev, next=next, detail=request.path + '/view/')

class UserView(FlaskView):
    route_base = "user"

    @route('/', methods=['GET'])
    def view_users(self):
        return get_content_list(["Profile"], g.user, template="users_list.html", active="users")

class ContentView(FlaskView):

    @route('/edit/comment/remove', methods=["POST"])
    def remove_comment(self):
        id = request.json.get('id', None)
        key = request.json.get('key', None)
        if not id or not key:
            raise Exception("Invalid key")
        content = Content.get_by_id(id)
        comment_delete = None
        for comment in content.comments:
            if comment.key == key:
                comment_delete = comment
                break
        if comment_delete:
            content.comments.remove(comment)
            content.save()
            message, status = "Successfully added the comment", 'success'
        else:
            message, status = "Comment could not be deleted", 'error'
        flash(message, category=status)
        return jsonify(status=status, message=message)


    @route('/edit', methods=['POST'])
    def edit_content(self):
        try:
            id = request.json.get('key', None)
            if not id:
                raise Exception("Invalid key")
            content = Content.objects(pk=id).first()
            field = request.json.get('field', 'text')
            type = request.json.get('type', None)
            if type == 'array':
                value = request.json.get('data', None)
                if value:
                    value = value.split(',')
            else:
                value = request.json.get('data', '')
            content.__setattr__(field, value)
            print "Modifying:", id, field, value
            content.save()
            flash('Successfully updated the content', category="success")
            return jsonify(dict(message='Successfully updated the content', status="success"))
        except Exception, e:
            print e
            flash('Failed to update the content', category="danger")
            return jsonify(dict(message="Failed to update the content", status="error"))

    @route("/all", methods=['GET', 'POST'])
    @login_required
    def list_content(self):
        return get_content_list(["Profile", "Post", "Stream"], g.user,  not_in=True, active="publishing")

    @route("/all/view/<id>", methods=['GET', 'POST'])
    @login_required
    def view_content(self, id):
        content = Content.get_by_id(id)
        return render_template("content.html", content=content, content_type=content.channels[0].lower(), user=g.user, active=request.args.get('publishing'))

    @route('/article', methods=['GET', 'POST'])
    @login_required
    def list_article(self):
        return get_content_list(["Article"], g.user, content_type='Articles', active=request.args.get('publishing'))

    @route("/article/view/<id>", methods=['GET', 'POST'])
    @login_required
    def view_content(self, id):
        content = Content.get_by_id(id)
        return render_template("content.html", content=content, content_type=content.channels[0].lower(), user=g.user, active=request.args.get('publishing'))

    @route('/destination', methods=['GET', 'POST'])
    @login_required
    def list_destination(self):
        return get_content_list(["Destination"], g.user,  content_type='Destinations', active=request.args.get('publishing'))

    @route("/destination/view/<id>", methods=['GET', 'POST'])
    @login_required
    def view_destination(self, id):
        content = Content.get_by_id(id)
        return render_template("content.html", content=content, content_type=content.channels[0].lower(), user=g.user, active=request.args.get('publishing'))

    @route('/activity', methods=['GET', 'POST'])
    @login_required
    def list_activity(self):
        return get_content_list(["Activity"], g.user,  content_type='Activities', active=request.args.get('publishing'))

    @route("/activity/view/<id>", methods=['GET', 'POST'])
    @login_required
    def view_activity(self, id):
        content = Content.get_by_id(id)
        return render_template("content.html", content=content, content_type=content.channels[0].lower(), user=g.user, active=request.args.get('publishing'))

    @route('/forum', methods=['GET', 'POST'])
    @login_required
    def list_forum(self):
        return get_content_list(["Forum"], g.user,  content_type='Discussions', active=request.args.get('publishing'))

    @route("/forum/view/<id>", methods=['GET', 'POST'])
    @login_required
    def view_forum(self, id):
        content = Content.get_by_id(id)
        return render_template("content.html", content=content, content_type=content.channels[0].lower(), user=g.user, active=request.args.get('publishing'))

    @route('/event', methods=['GET', 'POST'])
    @login_required
    def list_event(self):
        return get_content_list(["Event"], g.user,  content_type='Events', active=request.args.get('publishing'))

    @route("/event/view/<id>", methods=['GET', 'POST'])
    @login_required
    def view_event(self, id):
        content = Content.get_by_id(id)
        return render_template("content.html", content=content, content_type=content.channels[0].lower(), user=g.user, active=request.args.get('publishing'))

    @route('/product', methods=['GET', 'POST'])
    @login_required
    def list_product(self):
        return get_content_list(["Product"], g.user,  content_type='Products', active=request.args.get('publishing'))

    @route("/product/view/<id>", methods=['GET', 'POST'])
    @login_required
    def view_product(self, id):
        content = Content.get_by_id(id)
        return render_template("content.html", content=content, content_type=content.channels[0].lower(), user=g.user, active=request.args.get('publishing'))



class ViewHandler(FlaskView):

    route_base = '/'

    @route("/", methods=['GET', 'POST'])
    @login_required
    def index(self):
        return render_template('base_admin.html', page_title='Account Manger', user=g.user, active='dashboard')

    @route("/profile", methods=['GET', 'POST'])
    @login_required
    def profile(self):
        form = ProfileEdit()
        profile = Profile.get_by_id(g.user.id)
        if request.method != 'POST':
            form.populate_obj(profile)
        else:
            someother = Profile.objects(email__iexact=form.email.data).all()[0]
            email_exists, username_exists = False, False
            if someother.id != profile.id:
                email_exists = True
                form.email.errors = ("Email is already taken by someone else",)
            someother = Profile.objects(username__iexact=form.username.data).all()[0]
            if someother.id != profile.id:
                username_exists = True
                form.username.errors = ("Username is already taken by someone else",)
            if email_exists or username_exists:
                form.populate_obj(profile)
                flash("Unable to update the profile", category='danger')
                return render_template('profile_edit.html', page_title='Edit Profile', user=g.user, form=form, active='profile')


            profile.name = form.name.data
            profile.email = form.email.data
            profile.username = form.username.data
            profile.phone = form.phone.data
            profile.address = form.address.data
            profile.facebook = form.facebook.data
            profile.linkedin = form.linkedin.data
            profile.website = form.website.data
            profile.text = form.text.data
            profile.save()
            form.populate_obj(profile)
            flash('Successfully updated the profile.', category='success')
        return render_template('profile_edit.html', page_title='Edit Profile', user=g.user, form=form, active='profile')

    @route("/inbox", methods=['GET', 'POST'])
    @login_required
    def inbox(self):
        return render_template('base_admin.html', page_title='Account Manger', user=g.user, active='inbox')

    @route("/inbox/message", methods=['GET', 'POST'])
    @login_required
    def inbox(self):
        return render_template('base_admin.html', page_title='Account Manger', user=g.user, active='inbox')


    @route("/settings", methods=['GET', 'POST'])
    @login_required
    def settings(self):
        return render_template('settings.html', page_title='Account Manger', user=g.user, active='settings')

UserView.register(admin_module)
ContentView.register(admin_module)
ViewHandler.register(admin_module)
