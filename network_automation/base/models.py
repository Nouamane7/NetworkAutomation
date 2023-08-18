from django.db import models


# Create your models here.

class Device(models.Model):
    hostname = models.CharField(max_length=100, unique=True)
    device_type = models.CharField(max_length=100) #router/switch
    vendor = models.CharField(max_length=100) #cisco
    added = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    num_interfaces = models.IntegerField(default=0)

    def __str__(self):
        return self.hostname
    
class Interface(models.Model):
    ip_address = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100)
    status = models.CharField(max_length=10, default='down')
    username = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    port = models.CharField(max_length=10)
    connected_to = models.ForeignKey(Device, on_delete=models.SET_NULL, related_name='device_interface', null=True, blank=True)
    update = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.ip_address