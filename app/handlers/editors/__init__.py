__author__ = 'arshad'

from flask import request, redirect

from app.handlers.editors.model_editor import ModelEditor
from app import app


@app.route('/model/<channel>/<key>/edit', methods=['GET', 'POST'])
@app.route('/model/<channel>/add', methods=['GET', 'POST'])
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
            if channel == 'Profile':
                form['facets'].append('Enthusiast')

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

