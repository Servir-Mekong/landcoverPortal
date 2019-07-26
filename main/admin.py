# -*- coding: utf-8 -*-

from __future__ import unicode_literals

from django.contrib import admin

from .models import Email, ExportDrive, ExportDownloadURL

admin.site.register(Email)
admin.site.register(ExportDrive)
admin.site.register(ExportDownloadURL)
