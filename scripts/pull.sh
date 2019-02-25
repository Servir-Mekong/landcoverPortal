#!/bin/bash

source /home/ubuntu/landcovertool_env/bin/activate
cd /home/landcoverportal
git reset --hard HEAD
git pull
gulp build
python manage.py collectstatic
service supervisor restart
service nginx restart
