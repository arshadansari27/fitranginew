#!/usr/bin/env bash
source ~/virtualenvs/fitrangi/bin/activate
export APP_STATE='BACK'
export ASSETS_DEBUG='TRUE'
cd daemons
crossbar start
