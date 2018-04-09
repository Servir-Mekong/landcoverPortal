# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from cms.sitemaps import CMSSitemap
from django.conf import settings
from django.conf.urls import include, url
from django.conf.urls.i18n import i18n_patterns
from django.contrib import admin
from django.contrib.sitemaps.views import sitemap
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.views.static import serve
from django.views.generic import TemplateView
from oauth2client.contrib.django_util.site import urls as oauth2_urls
from forest_monitor import api
from landcover_viewer import api as landcover_api

admin.autodiscover()

urlpatterns = [
    url(r'^sitemap\.xml$', sitemap,
        {'sitemaps': {'cmspages': CMSSitemap}}),
    url(r'^oauth2/', include(oauth2_urls)),
    url(r'^forest-monitor/api/$', api.api),
    url(r'^landcover/api/$', landcover_api.api),
]

urlpatterns += i18n_patterns(
    url(r'^admin/', include(admin.site.urls)),  # NOQA
    url(r'^$', TemplateView.as_view(template_name="home.html")),
    url(r'^home/', TemplateView.as_view(template_name="home.html")),
    url(r'^method/', TemplateView.as_view(template_name="method.html")),
    url(r'^privacy-policy/', TemplateView.as_view(template_name="privacy-policy.html")),
    url(r'^service-applications/', TemplateView.as_view(template_name="service-applications.html")),
    url(r'', include('forest_monitor.urls')),
    url(r'', include('landcover_viewer.urls')),
    url(r'^', include('cms.urls')),
)

# This is only needed when using runserver.
if settings.DEBUG:
    urlpatterns = [
        url(r'^media/(?P<path>.*)$', serve,
            {'document_root': settings.MEDIA_ROOT, 'show_indexes': True}),
        ] + staticfiles_urlpatterns() + urlpatterns
