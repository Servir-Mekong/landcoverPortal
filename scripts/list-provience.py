# -*- coding: utf-8 -*-

import os
from os.path import isfile, join

os.path.dirname(os.path.dirname(__file__))
path = os.path.join(os.getcwd() ,'../landcoverportal/static/data/provience')
path = os.path.abspath(path)

files = [f.split('.json')[0] for f in os.listdir(path) if isfile(join(path, f))]

f = open('provience', 'w')
f.write(str(files))
f.close()
