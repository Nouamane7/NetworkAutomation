from django.urls import path
from . import views

urlpatterns = [
    path("", views.getRoutes),
    path('devices/', views.getDevices),
    path('device/<str:pk>/', views.getDevice),
    path("interfaces/", views.getInerfaces),
    path("interface/<str:pk>/", views.getInterface),
    path("authenticate/", views.authenticate),
    path('totalDevices/', views.totalDevices),
    path('totalInterfaces/', views.totalInterfaces),
    path('devices-names/', views.getDevicesnames),
    path('interfaces-ips/', views.getInterfacesIps),
    path('add-device/', views.addDevice),
    path('add-interface/', views.addInterface),
    path('delete-interfaces/', views.deleteInterfaces),
    path('interfaces-info/', views.interfaceInfo),
    path('configure/ospf/', views.configOSPF),
    path('configure/rip/', views.configRip),
    path('configure/bgp/', views.configBgp),
    path('configure/static-routing/', views.configStatic),
    path('configure/eigrp/', views.configEigrp),
    path('generate-files/', views.backup_file),
    path("cpu-usage/", views.cpuInfo),
    path('average-cpu/', views.cpuAverage)
]

