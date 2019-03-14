# -*- coding: utf-8 -*-

from __future__ import unicode_literals

from django.db import models

class DownloadInfo(models.Model):

    name = models.CharField(max_length=250)
    organization = models.CharField(max_length=250)
    email = models.EmailField()

    TYPE = (
        ('tree_canopy', 'Tree Canopy'),
        ('tree_height', 'Tree Height'),
        ('forest_gain', 'Forest Gain'),
        ('forest_loss', 'Forest Loss'),
        ('forest_extend', 'Forest Extend'),
        ('primary_forest', 'Primary Forest'),
    )
    type = models.CharField(max_length=50, choices=TYPE)

    USAGE = (
        ('agriculture', 'Agriculture'),
        ('climate_change', 'Climate Change'),
        ('env', 'Environment'),
        ('forest', 'Forest'),
        ('biology', 'Biology'),
        ('conservation', 'Conservation'),
        ('others', 'Others'),
    )
    usage = models.CharField(max_length=50, choices=USAGE)

    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = '"fms_user_download_info"'

    def __str__(self):              # __unicode__ on Python 2
        return "{} - {}" % (self.name, self.organization)
