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
        public_methods = ['tree-canopy',
                          'tree-height',
                          'forest-gain',
                          'forest-loss',
                          'forest-change',
                          ]
        if action in public_methods:
            shape = get('shape', '')
            geom = get('geom', '')
            radius = get('radius', '')
            center = get('center', '')
            area_path = get('areaSelectFrom', '')
            area_name = get('areaName', '')
            core = GEEApi(area_path, area_name, shape, geom, radius, center)

            if action == 'tree-canopy':
                data = core.tree_canopy(year=get('year', ''))
            elif action == 'tree-height':
                data = core.tree_height(year=get('year', ''))
            elif action == 'forest-gain':
                data = core.forest_gain(start_year = get('startYear', ''),
                                        end_year = get('endYear', ''))
            elif action == 'forest-loss':
                data = core.forest_loss(start_year = get('startYear', ''),
                                        end_year = get('endYear', ''))
            elif action == 'forest-change':
                data = core.forest_change(start_year = get('startYear', ''),
                                          end_year = get('endYear', ''))

            return JsonResponse(data)
