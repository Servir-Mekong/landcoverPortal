#!/bin/bash

source /home/rlcms/landcover_env/bin/activate
cd /home/rlcms/rlcms-v2
git reset --hard HEAD
git pull
gulp build
python manage.py collectstatic
sudo systemctl restart supervisor 
sudo service nginx restart
