# -*- coding: utf-8 -*-

from django.shortcuts import render

def myanmar_national(request):

    return render(request, 'myanmar-national.html', {})
