# -*- coding: utf-8 -*-

from __future__ import unicode_literals

from rest_framework import serializers

from forest_monitor.models import DownloadInfo

class DownloadInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DownloadInfo
        fields = ('id', 'name', 'organization', 'usage', 'email', 'type')
