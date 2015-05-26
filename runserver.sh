#!/usr/bin/bash
source venv/bin/activate
export ASSETS_DEBUG='TRUE'
python manage.py runserver
