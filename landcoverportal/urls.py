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
from forest_monitor import api as forest_monitor_api
from forest_monitor import views as forest_monitor_views
from landcover_viewer import api as landcover_api
from myanmar_national import api as myanmar_national_api
from myanmar_ipcc import api as myanmar_ipcc_api
from myanmar_fra import api as myanmar_fra_api
from myanmar_plantation import api as myanmar_plantation_api
from .views import store_auth_code, home, about, services, method, library, event, publication, blog, dashboard, GETBlog, GETEvents, GETTensorContent, training, service_applications, publications, GETTrainingContent, training_detail

admin.autodiscover()

urlpatterns = [
    url(r'^sitemap\.xml$', sitemap,
        {'sitemaps': {'cmspages': CMSSitemap}}),
    url(r'^oauth2/', include(oauth2_urls)),
    # forest monitor urls
    url(r'^api/forest-monitor/download-info/$', forest_monitor_views.DownloadInfoCreateRead.as_view()),
    url(r'^api/forest-monitor/$', forest_monitor_api.api),
    url(r'^api/landcover/$', landcover_api.api),
    url(r'^api/myanmar-national/$', myanmar_national_api.api),
    url(r'^api/myanmar-ipcc/$', myanmar_ipcc_api.api),
    url(r'^api/myanmar-fra/$', myanmar_fra_api.api),
    url(r'^api/myanmar-plantation/$', myanmar_plantation_api.api),
    url(r'^storeauthcode/$', store_auth_code),
    url(r'training-detail/$', training_detail),
]

#urlpatterns += i18n_patterns(
urlpatterns += i18n_patterns(
    url(r'^admin/', include(admin.site.urls)),  # NOQA
    #url(r'^$', TemplateView.as_view(template_name="home.html")),
    #url(r'^home/', TemplateView.as_view(template_name="home.html")),
    url(r'^$', home),
    url(r'^home/', home),
    url(r'^about/', about),
    url(r'^method/', method),
    url(r'^library/code', library),
    url(r'^library/events', event),
    url(r'^library/publication', publication),
    url(r'^blog/', blog),
    url(r'^training/', training),
    url(r'^dashboard/', dashboard),
    url(r'^services/', services),
    url(r'^service-applications/', service_applications),
    url(r'^publications/', publications),
    url(r'^api/blog/', GETBlog),
    url(r'^api/events/', GETEvents),
    url(r'^api/tf-content/', GETTensorContent),
    url(r'^api/training/', GETTrainingContent),

    # url(r'^method/', TemplateView.as_view(template_name="method.html")),
    url(r'^privacy-policy/', TemplateView.as_view(template_name="privacy-policy.html")),
    url(r'^service-applications/', TemplateView.as_view(template_name="service-applications.html")),
    url(r'^side-by-side-map/', TemplateView.as_view(template_name="side-by-side-map.html")),
    url(r'^', include('forest_monitor.urls')),
    url(r'^', include('landcover_viewer.urls')),
    url(r'^', include('myanmar_national.urls')),
    url(r'^', include('myanmar_ipcc.urls')),
    url(r'^', include('myanmar_fra.urls')),
    url(r'^', include('myanmar_plantation.urls')),
    url(r'^', include('cms.urls')),
)

# This is only needed when using runserver.
if settings.DEBUG:
    urlpatterns = [
        url(r'^media/(?P<path>.*)$', serve,
            {'document_root': settings.MEDIA_ROOT, 'show_indexes': True}),
        ] + staticfiles_urlpatterns() + urlpatterns
