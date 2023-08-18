from django.contrib import admin

# Register your models here.

from .models import Device, Interface

admin.site.register(Device)
admin.site.register(Interface)