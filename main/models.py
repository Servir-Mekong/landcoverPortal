# -*- coding: utf-8 -*-

from __future__ import unicode_literals

from django.conf import settings
from django.contrib import admin
from django.db import models

# =============================================================================
class Email(models.Model):

    sent_on = models.DateTimeField(auto_now_add=True)
    subject = models.CharField(max_length=78) # max_length=78 - RFC 2822
    body = models.TextField()
    from_address = models.EmailField()
    to_address = models.EmailField()
    reply_to = models.EmailField()
    # incoming or outgoing?
    inbound = models.BooleanField(default=False)

    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = '"msg_email"'

    def __str__(self):              # __unicode__ on Python 2
        return "%s" % (self.from_address)

# =============================================================================
class ExportDrive(models.Model):

    name = models.CharField(max_length=254)
    email = models.ForeignKey(Email, on_delete=models.CASCADE, null=True)
    url = models.URLField(max_length=254)
    app = models.CharField(max_length=254)

    started_on = models.DateTimeField(auto_now_add=True)
    completed_on = models.DateTimeField(null=True)

    class Meta:
        db_table = '"export_drive"'

    def __str__(self):
        return '{} - {}'.format(self.name, self.email)

# =============================================================================
class ExportDownloadURL(models.Model):

    url = models.URLField(max_length=254)
    ip_address = models.GenericIPAddressField()
    app = models.CharField(max_length=254)

    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = '"export_download_url"'

    def __str__(self):
        return '{} - {}'.format(self.name, self.email)

# =============================================================================
