# -*- coding: utf-8 -*-

from core import GEEApi
from django.conf import settings
from django.http import JsonResponse
from datetime import datetime
import time

def api(request):

    get = request.GET.get
    action = get('action', '')

    if action:
        public_methods = ['tree-canopy-change',
                          'tree-height-change',
                          ]
        if action in public_methods:
            year = get('year', '')
            shape = get('shape', '')
            geom = get('geom', '')
            radius = get('radius', '')
            center = get('center', '')
            core = GEEApi(year, shape, geom, radius, center)

            if action == 'tree-canopy-change':
                data = core.tree_canopy_change()
            elif action == 'tree-height-change':
                data = core.tree_height_change()

            return JsonResponse(data)
