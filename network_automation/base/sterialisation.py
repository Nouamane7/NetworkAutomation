from .models import Device, Interface
from rest_framework.serializers import ModelSerializer


class DeviceSerializer(ModelSerializer):
    class Meta:
        model = Device
        fields = '__all__'

class InterfaceSerializer(ModelSerializer):
    class Meta:
        model = Interface
        exclude = ['status']