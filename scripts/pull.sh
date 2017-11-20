#!/bin/sh

git reset --hard HEAD
git pull
python /home/landcoverportal/landcoverportal/manage.py collectstatic
