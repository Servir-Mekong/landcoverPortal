from django.conf.urls import include, url
from . import views

urlpatterns = [
    url(r'^landcover/$', views.landcover),
    url(r'^landcover/v1/$', views.landcover_v1),
    url(r'^landcover/v2/$', views.landcover_v2),
    url(r'^side-by-side-map/$', views.side_by_side_map),
    url(r'^side-by-side-map/v1/$', views.side_by_side_map_v1),
    url(r'^side-by-side-map/v2/$', views.side_by_side_map_v2),
]
