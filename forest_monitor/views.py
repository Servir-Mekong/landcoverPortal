# -*- coding: utf-8 -*-

from django.shortcuts import render

def forest_monitor(request):
    return render(request, 'forest-monitor.html', {})
