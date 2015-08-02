from app.handlers.messaging import send_single_email
from app.handlers import GENERIC_TITLE
from app import app, USE_CDN
from app.settings import EXCEPTION_API
from app.models import STREAM
from flask import render_template, request, g, redirect, jsonify, url_for, session, flash
from app.handlers.editors import NodeEditor
from app.handlers import NodeCollectionFactory, NodeExtractor
from app.models import Node, NodeFactory, ACTIVITY, ADVENTURE, ARTICLE, DISCUSSION, PROFILE, EVENT, TRIP, CONTEST
from app.models.profile import Profile, ProfileType
from app.utils import login_required, all_tags, specific_tags_article, specific_channels_discussion, specific_tags_discussion, specific_channels_article, specific_channels, specific_tags, save_profile_image
from app.handlers import  EditorView, PageManager
from app.settings import CDN_URL
from app.models import NodeFactory
from app.models.profile import Profile, ProfileType
import re, base64
from flask import render_template, g, request, jsonify, send_file, flash, redirect, url_for, session, make_response
from app.utils import login_required
from app import app
from StringIO import StringIO
from PIL import Image
import random, os, requests, base64

(MODEL_DETAIL_VIEW, MODEL_LIST_ROW_VIEW, MODEL_LIST_GRID_VIEW, MODEL_LIST_POD_VIEW) = ('detail', 'row', 'grid', 'pod')

FOLDER = os.getcwd() + '/content-images'


def login_user_session(user):
    session['user'] = str(user.id)
    session['just_logged_in'] = True

@app.route('/test-api/youtube')
def youtube_channel_test():
    return requests.get('https://www.googleapis.com/youtube/v3/search?key=AIzaSyC2G0kvBLJBEnBCUPf053z6mL5tgbWON5o&channelId=UC9MLurIp4Afr3gF_r57ID4w&part=snippet,id&order=date&maxResults=20').content


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
        ig = request.form.get('images')
        print ig[0: 100]
        perm = False
        if not request.args.get('permanent', False):
            path = os.getcwd() + '/tmp/' + _id
        else:
            if not os.path.exists(FOLDER):
                os.makedirs(FOLDER)
            perm = True
            path = FOLDER + '/' + _id

        fh = open(path, "wb")
        fh.write(ig.decode('base64'))
        fh.close()
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
        raise

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


@app.route('/cover-image-modal', methods=['GET'])
def cover_image_modal():
    return render_template('site/modals/cover-edit.html')

@app.route('/not-ok-modal', methods=['GET'])
def not_ok_modal():
    return render_template('site/modals/not-ok.html')

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
            from app.handlers.messaging import send_single_email, send_email_from_template
            flash("Successfully sent email with new password.", category='success')
            send_email_from_template('notifications/password_reset.html', "[Fitrangi] Password reset on Fitrangi.com", to_list=[profile.email], force_send=True, **dict(user=profile, password=password))
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


@app.route('/login', methods=['GET', 'POST'])
def login_page():
    if request.method == 'POST':
        email = request.form.get('email', None)
        password = request.form.get('password', None)
        #remember = request.form.get('remember', None)
        profile = Profile.authenticate(email, password)
        if profile and profile.id:
            target = request.args.get('target', None)
            login_user_session(profile)
            if not hasattr(profile, 'location') or not profile.location or len(profile.location) is 0:
                flash('Please update your location by clicking <a href="/edit-profile">here</a>')
            response = dict(status='success', message='Successfully logged in.', node=str(profile.id), my_page=target if target and len(target) > 0 else profile.slug)
            return jsonify(response)
        return jsonify(dict(status='error', message='Incorrect email address and/or password.'))

    if hasattr(g, 'user') and g.user is not None:
        return redirect(g.user.slug)
    from app.views import force_setup_context

    target = request.args.get('target', '')
    context = force_setup_context({})
    context['referrer'] = target if target else ''
    title, card, context = PageManager.get_common_title_and_page('login', **context)
    context['title'] = title
    context['card']  = card
    context['cdn_url'] = CDN_URL if USE_CDN else ''
    print '[*] Target', target

    return render_template('site/layouts/empty_layout.html', **context)

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
        profile = profile.save()

    if profile:
        profile.is_social_login = True
        profile.is_verified = True
        profile = profile.save()
        login_user_session(profile)

    try:
        if profile.is_social_login and profile.id and not profile.uploaded_image_cover:
            img_uploaded = request.form['file']
            if img_uploaded and len(img_uploaded) > 0:
                save_profile_image(str(profile.id), img_uploaded)
    except:
        print '[ERROR]: Unable to download profile image for profile'

    if profile:
        return jsonify(dict(location='/stream/me', status='success'))

    return jsonify(dict(location=url_for('login'), status='error'))

@app.route('/register', methods=['GET', 'POST'])
def registration():
    target = request.args.get('target', None)
    if request.method == 'POST':
        name = request.form.get('name', None)
        email = request.form.get('email', None)
        password = request.form.get('password', None)
        confirm = request.form.get('confirm', None)
        if password != confirm:
            return jsonify(dict(status='error', message='Passwords do not match'))
        type = ProfileType.objects(name__icontains='subscription').first()
        if Profile.objects(email__iexact=email, type__nin=[str(type.id)]).first():
            return jsonify(dict(status='error', message='Email already exists, have you forgotten your password? <a href="#" class="show_forgot_password">Click</a> to reset it.'))
        type = ProfileType.objects(name__iexact='Enthusiast').first()
        profile = Profile(name=name, email=email, type=[type], roles=['Basic User'])
        profile.password  = password
        profile.save()
        if profile and profile.id:
            login_user_session(profile)
            if profile.is_verified:
                send_email_from_template('notifications/successfully_registered.html', "[Fitrangi] Successfully registered", to_list=[profile.email], force_send=True, **dict(user=profile))
            else:
                if 'fitrangi.com' in request.host:
                    host = 'http://www.fitrangi.com'
                else:
                    host = 'http://localhost:4500'
                link = profile.create_verification_link()
                context = dict(user=profile, link="%s%s" % (host, link))
                send_email_from_template('notifications/email_verification.html', "[Fitrangi] Verification email", to_list=[profile.email], force_send=True, **context)
            return jsonify(dict(status='success', message='Profile created and logged in.', node=str(profile.id), my_page=target if target and len(target) > 0 else profile.slug))
        return jsonify(dict(status='error', message='Failed to register. Please try again.'))
    if hasattr(g, 'user') and g.user is not None:
        return redirect('/')
    from app.views import force_setup_context
    title, card, context = PageManager.get_common_title_and_page('register', target=target)
    context = force_setup_context(context)
    context['title'] = title
    context['card']  = card
    context['referrer'] = request.referrer
    context['cdn_url'] = CDN_URL if USE_CDN else ''
    return render_template('site/layouts/empty_layout.html', **context)

@app.route('/write/<model_name>')
@app.route('/write/<model_name>/<model_id>')
@login_required
def editor(model_name, model_id=None):

    from app.views import force_setup_context
    context = force_setup_context({})
    try:
        card = EditorView(model_name, model_id).get_card()
        context['cdn_url'] = CDN_URL if USE_CDN else ''
        context['card'] = card
    except Exception, e:
        if e.message == 'Invalid User':
            return 'Not Authorise', 403
        else:
            raise e
    return render_template('site/pages/commons/view.html', **context)

@app.route("/explore")
def act_home():
    return redirect('/')

@app.route("/")
def home():
    from app.views import force_setup_context
    context = PageManager.get_landing_title_and_page('explore', user=g.user if hasattr(g, 'user') else None)
    return render_template('site/pages/commons/view.html', **context)

@app.route('/pages/<name>')
def extra_pages(name):
    context = PageManager.get_landing_title_and_page(name, user=g.user if hasattr(g, 'user') else None)
    return render_template('site/pages/commons/view.html', **context)


@app.route("/activities")
def activity_view():
    name = request.args.get('name')
    query="name__iexact:%s;" % name
    node = NodeExtractor.factory(ACTIVITY).get_single(query)
    return redirect(node.slug)

@app.route("/adventures")
def list_adventure():
    query = request.args.get('query', '')
    if not query or len(query) is 0:
        query = None
    context = PageManager.get_search_title_and_page(ADVENTURE, query=query, title='Adventures @ Fitrangi')
    return render_template('site/pages/commons/view.html', **context)

@app.route('/journals')
@app.route('/blog')
def list_journal():
    query = request.args.get('query', '')
    if not query or len(query) is 0:
        query = None
    title = 'Articles and Blogs @ Fitrangi'
    context = PageManager.get_search_title_and_page(ARTICLE, query=query, title=title)
    return render_template('site/pages/commons/view.html', **context)

@app.route('/discussions')
def list_discussion():
    query = request.args.get('query', '')
    if not query or len(query) is 0:
        query = None
    context = PageManager.get_search_title_and_page(DISCUSSION, query=query, title='Discussion @ Fitrangi')
    return render_template('site/pages/commons/view.html', **context)

@app.route("/profiles")
def list_profile():
    query = request.args.get('query', '')
    if not query or len(query) is 0:
        query = None
    context = PageManager.get_search_title_and_page(PROFILE, query=query, title="Profile Finder")
    return render_template('site/pages/commons/view.html', **context)

@app.route("/community/my")
def my_profile():
    if not hasattr(g, 'user') or g.user is None:
        return redirect(url_for('community_mail'))
    slug = g.user.slug
    return redirect(slug)

@app.route("/events")
def list_event():
    query = request.args.get('query', '')
    if not query or len(query) is 0:
        query = None
    context = PageManager.get_search_title_and_page(EVENT, query=query)
    return render_template('site/pages/commons/view.html', **context)

@app.route("/contests")
def list_contest():
    context = PageManager.get_search_title_and_page(CONTEST, query=None)
    return render_template('site/pages/commons/view.html', **context)


@app.route("/trips")
def list_trip():
    query = request.args.get('query', '')
    if not query or len(query) is 0:
        query = None
    context = PageManager.get_search_title_and_page(TRIP, query=query, title="Trips @ Fitrangi")
    return render_template('site/pages/commons/view.html', **context)

@app.route("/listings")
def paged_list():
    query       = request.args.get('query', None)
    sort        = request.args.get('sort', None)
    size        = request.args.get('size', 12)
    page        = request.args.get('page', 1)
    model       = request.args.get('model_view', None)
    card_type   = request.args.get('card_type', None)
    category    = request.args.get('category', 'all')
    context = {}
    print 'Query Info rec: ', query
    print 'Sort Info rec: ', sort
    extractor = NodeExtractor.factory(model)
    models = extractor.get_list(query, True, page, size, sort=sort)
    html = NodeCollectionFactory.resolve(model, card_type, category, fixed_size=size).only_list(models)

    if hasattr(g, 'user')  and g.user and g.user.id:
        if model == STREAM and 'pk' in query and str(g.user.id) in query:
            g.user.public_activity_count = 0
            g.user.save()

    context['user'] = g.user if hasattr(g, 'user') and g.user is not None else None
    last_page=extractor.last_page(query, size, sort=sort)
    if model != 'post':
        err_html = '<div class="jumbotron result-not-found"><h6>No content associated with category was found!</h6></div>' if request.referrer  and '/profile/' not in request.referrer else ''
    else:
        err_html = ''
    has_data = 1
    if len(html) is 0:
        html = err_html
        has_data = 0
    return jsonify(status='success', html=html, last_page=last_page, has_data=has_data)

@app.route('/notifications-count')
def get_notifications_count():
    if hasattr(g, 'user') and g.user:
        return jsonify(dict(public_activity_count=g.user.public_activity_count, private_activity_count=g.user.private_activity_count))

@app.route('/options')
def ajax_options():
    model_name = request.args.get('model_name', '')
    attr = request.args.get('attr', None)
    attr2 = request.args.get('attr2', None)
    attr3 = request.args.get('attr3', None)
    select = request.args.get('select', 0)
    if model_name == 'tag':
        options = [(u[0], u[0]) for u in all_tags()]
    elif model_name == 'location' and attr == 'name':
        options = ((str(getattr(u, 'id')), u.name) for u in NodeFactory.get_class_by_name(model_name).objects.all())
    elif attr2 is not None and attr3 is None:
        options = ((str(getattr(getattr(u, attr), 'id')), getattr(getattr(u, attr), attr2)) for u in NodeFactory.get_class_by_name(model_name).objects.all())
    elif attr2 is not None and attr3 is not None:
        objs = [getattr(u, attr) for u in NodeFactory.get_class_by_name(model_name).objects.all()]
        _options = {}
        for obj in objs:
            for a in obj:
                _options[a.id] = getattr(a, attr3)

        options = _options.items()
    else:
        options = ((str(getattr(u, 'id')), getattr(u, attr)) for u in NodeFactory.get_class_by_name(model_name).objects.all())
    if not select:
        str_to_use = '<option id="%s" value="%s">'
    else:
        str_to_use = '<option value="%s">%s</option>'
    results = set([str_to_use % u for u in options])
    return ''.join(results)

@app.route('/names')
def ajax_names():
    model_name = request.args.get('model_name', '')
    attr = request.args.get('attr', None)
    size = request.args.get('size', None)
    model_type = request.args.get('model_type', None)
    if model_name == 'tag':
        if model_type is not None:
            if model_type == 'article':
                options = [u[0] for u in specific_tags_article()]
            elif model_type == 'discussion':
                options = [u[0] for u in specific_tags_discussion()]
            else:
                options = [u[0] for u in specific_tags(model_type)]
        else:
            options = [u[0] for u in all_tags()]
        if size:
            options = options[0: int(size)]
    elif model_name == 'channel':
        from app.models.content import Channel
        if model_type == 'article':
            options = [Channel.objects(pk=str(u[0])).first().name for u in specific_channels_article()]
        elif model_type == 'discussion':
            options = [Channel.objects(pk=str(u[0])).first().name for u in specific_channels_discussion()]
        else:
            options = [Channel.objects(pk=str(u[0])).first().name for u in specific_channels(model_type)]
    else:
        options = (getattr(u, attr) for u in NodeFactory.get_class_by_name(model_name).objects.all())
    results = (u for u in options)
    return ','.join(results)

@app.route('/buttons')
def ajax_buttons():
    model_name = request.args.get('model_name', '')
    attr = request.args.get('attr', None)
    if model_name == 'tag':
        options = [u[0] for u in all_tags()][:30]
    else:
        options = (getattr(u, attr) for u in NodeFactory.get_class_by_name(model_name).objects.all())
    results = ('<a href="#"> %s </a>' % u for u in options)
    return ''.join(results)

@app.route('/activity/<slug>')
@app.route('/adventure/<slug>')
@app.route('/event/<slug>')
@app.route('/trip/<slug>')
@app.route('/profile/<slug>')
@app.route('/article/<slug>')
@app.route('/blog/<slug>')
@app.route('/discussion/<slug>')
@app.route('/post/<slug>')
@app.route('/contest/<slug>')
def model_view(slug):
    model_type = [u for u in request.path.split('/') if u and len(u) > 0][0]

    value = '/%s/%s' % (model_type, slug)
    user_id = str(g.user.id) if g.user and g.user.id else ''
    context = PageManager.get_detail_title_and_page(model_type, query="slug__iexact:%s;" % value, user=user_id)
    return render_template('site/pages/commons/view.html', **context)

@app.route('/edit-profile')
@login_required
def edit_profile():
    if not hasattr(g, 'user') and not g.user:
        return 'Forbidden', 403
    context = PageManager.get_edit_title_and_page('profile', query="pk:%s;" % str(g.user.id))
    return render_template('site/pages/commons/view.html', **context)

@app.route('/manage-profile')
@login_required
def manage_profile():
    if not hasattr(g, 'user') and not g.user:
        return 'Forbidden', 403
    pk = request.args.get('pk', None)
    if pk:
        query = 'pk:%s;' % pk
    else:
        query = None
    context = PageManager.get_edit_title_and_page('profile', query=query, business=True)
    return render_template('site/pages/commons/view.html', **context)

@app.route('/add-edit-trip')
def add_edit_trip():
    if not hasattr(g, 'user') and not g.user: return 'Forbidden', 403
    pk = request.args.get('pk', None)
    if pk:
        query = 'pk:%s;' % pk
    else:
        query = None
    context = PageManager.get_edit_title_and_page('trip', query=query)
    return render_template('site/pages/commons/view.html', **context)

@app.route('/editors/invoke', methods=['POST'])
def editor_invoke():
    try:
        message = request.get_json(force=True)
        editor = NodeEditor.factory(message)
        return editor.invoke()
    except Exception, e:
        if EXCEPTION_API:
            raise
        return jsonify(dict(status='error', message='Something went wrong', exception=str(e)))


@app.route('/extractors/invoke', methods=['GET', 'POST'])
def extractor_invoke():
    try:
        message = request.get_json(force=True)
        extractor = NodeExtractor.factory(message.get('model_type'))
        is_single = message.get('is_single', False)
        query       = message.get('query', None)
        if is_single:
            model       = extractor.get_single(query)
            return jsonify(status='success', node=model)
        else:
            sort        = message.get('sort', None)
            size        = message.get('size', 12)
            page        = message.get('page', 1)
            models      = extractor.get_list(query, True, page, size, sort=sort)
            return jsonify(status='success', nodes=models)
    except Exception, e:
        return jsonify(dict(status='error', message='Something went wrong', exception=str(e)))

from .mailers import *