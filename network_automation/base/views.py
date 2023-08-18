import os
import queue
import zipfile
from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from base.sterialisation import DeviceSerializer, InterfaceSerializer
from wsgiref.handlers import FileWrapper
from .models import Device, Interface
from base.netmiko_command import *
from base.backup import *
from django.conf import settings
import threading


@api_view(['GET', "POST"])
def getRoutes(request):
    routes = [
        "GET /api/devices/",
        "GET /api/device/:id/",
        "GET /api/interfaces/",
        "GET /api/interface/:id/",
    ]
    if(request.method == "POST"):
        return Response(request.data)
    return Response(routes)


@api_view(['GET'])
def getDevices(request):
    devices = Device.objects.all()
    steralizer = DeviceSerializer(devices, many=True)
    return Response(steralizer.data)

@api_view(['GET'])
def getDevice(request, pk):
    device = Device.objects.get(id=pk)
    steralizer = DeviceSerializer(device, many=False)
    return Response(steralizer.data)


@api_view(['GET'])
def getInerfaces(request):
        status = []
        interfaces = Interface.objects.all()
        serializer = InterfaceSerializer(interfaces, many=True)             
        for idx, data in enumerate(serializer.data):
            data['status'] = getStatus(data['ip_address'])
        return Response(serializer.data)

@api_view(['GET'])
def getInterface(request, pk):
    interface = Interface.objects.get(id=pk)
    serializer = InterfaceSerializer(interface, many=False)
    return Response(serializer.data)

@api_view(['POST'])
def authenticate(request):
    if(request.data["username"] == "admin" and request.data["password"] == "admin"):
        return Response(True)
    else:
        return Response(False)

@api_view(['GET'])
def totalDevices(request):
    routers = Device.objects.filter(device_type="router").count()
    switches = Device.objects.filter(device_type="switch").count()
    return Response({"routers": routers, "switches": switches})

@api_view(['GET'])
def totalInterfaces(request):
    up = 0
    down = 0
    totalInterfaces = 0
    interfaces = Interface.objects.all()
    for i in interfaces:
        if(getStatus(i.ip_address) == 'up'):
            up += 1
    devices = Device.objects.all()
    for device in devices:
        totalInterfaces += device.num_interfaces
    down = totalInterfaces - up
    return Response({"up": up, "down": down})

@api_view(['POST'])
def addDevice(request):
    try:
        device = Device(**request.data)
        device.save()
        return Response(True)
    except: return Response(False)

@api_view(['POST'])
def addInterface(request):
    try:
        interface = Interface(ip_address = request.data["ip_address"], name = request.data["name"],  username = request.data["username"], password = request.data["password"], port = request.data["port"], connected_to = Device.objects.get(hostname=request.data["connected_to"]))
        interface.save()
        return Response(True)
    except Exception as e:
        return Response({"error": str(e)}, status=400)

@api_view(['POST'])
def removeDevice(request):
    try:
        device = Device.objects.get(id=request.data["ip_address"])
        device.delete()
        return Response(True)
    except: return Response(False)

@api_view(['GET'])
def getDevicesnames(request):
    devices = Device.objects.all()
    names = []
    for device in devices:
        names.append(device.hostname)
    return Response(names)

@api_view(['GET'])
def getInterfacesIps(request):
    interfaces = Interface.objects.all()
    ips = []
    for interface in interfaces:
        ips.append(interface.ip_address)
    return Response(ips)

@api_view(['POST'])
def deleteInterfaces(request):
    try:
        num_deleted_items, _ = Interface.objects.filter(ip_address__in = request.data).delete()
        # Return the number of deleted items as a response
        return Response({"deleted_items_countsss": num_deleted_items})
    except Exception as e:
        return Response({"error": str(e)}, status=400)
    
@api_view(['POST'])
def interfaceInfo(request):
    try:
        interface = Interface.objects.get(ip_address=request.data[0])
        # serializer = InterfaceSerializer(interface, many=False)
        device = connect_to_device(interface.ip_address, interface.username, interface.password, interface.port, "cisco_ios")
        response = show_info(device, interface.name)
        response["ip_address"] = request.data[0]
        response['subnet_mask'] = '255.255.255.0'
        response["hostname"] = interface.connected_to.hostname
        response["updated"] = interface.update
        response["created"] = interface.created
        return Response(response)
    except Exception as e:
        return Response({"error": str(e)}, status=400)
    
@api_view(['POST'])
def configOSPF(request):
    try:
        routers = []
        threads = []
        result = []
        result_queue = queue.Queue()
        for i in range(len(request.data['ip_address'])):
            # return Response(request.data['ip_address'][0])
            # return Response(request.data['ip_address'][I])
            interface = Interface.objects.get(ip_address=request.data["ip_address"][i])
            device = connect_to_device(interface.ip_address, interface.username, interface.password, interface.port, "cisco_ios")
            routers.append(device)
        for router in routers:
            t = threading.Thread(target=lambda: result_queue.put(configure_ospf(router, request.data["ospf_process_id"], request.data["network_statements"])))
            threads.append(t)
            t.start()
        for thread in threads:
            thread.join()
        while not result_queue.empty():
            result.append(result_queue.get())
        return Response(result ,status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=400)

@api_view(['POST'])
def configEigrp(request):
    try:
        routers = []
        threads = []
        result = []
        result_queue = queue.Queue()
        for i in range(len(request.data['ip_address'])):
            # return Response(request.data['ip_address'][0])
            # return Response(request.data['ip_address'][I])
            interface = Interface.objects.get(ip_address=request.data["ip_address"][i])
            device = connect_to_device(interface.ip_address, interface.username, interface.password, interface.port, "cisco_ios")
            routers.append(device)
        for router in routers:
            t = threading.Thread(target=lambda: result_queue.put(configure_eigrp(router, request.data["eigrp_process_id"], request.data["network_statements"])))
            threads.append(t)
            t.start()
        for thread in threads:
            thread.join()
        while not result_queue.empty():
            result.append(result_queue.get())
        return Response(result ,status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=400)
@api_view(['POST'])
def configBgp(request):
    try:
        routers = []
        threads = []
        result = []
        result_queue = queue.Queue()
        for i in range(len(request.data['ip_address'])):
            # return Response(request.data['ip_address'][0])
            # return Response(request.data['ip_address'][I])
            interface = Interface.objects.get(ip_address=request.data["ip_address"][i])
            device = connect_to_device(interface.ip_address, interface.username, interface.password, interface.port, "cisco_ios")
            routers.append(device)
        for router in routers:
            t = threading.Thread(target=lambda: result_queue.put(configure_bgp(router, request.data["bgp_process_id"], request.data["network_statements"])))
            threads.append(t)
            t.start()
        for thread in threads:
            thread.join()
        while not result_queue.empty():
            result.append(result_queue.get())
        return Response(result ,status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=400)
@api_view(['POST'])
def configStatic(request):
    try:
        routers = []
        threads = []
        result = []
        result_queue = queue.Queue()
        for i in range(len(request.data['ip_address'])):
            # return Response(request.data['ip_address'][0])
            # return Response(request.data['ip_address'][I])
            interface = Interface.objects.get(ip_address=request.data["ip_address"][i])
            device = connect_to_device(interface.ip_address, interface.username, interface.password, interface.port, "cisco_ios")
            routers.append(device)
        for router in routers:
            t = threading.Thread(target=lambda: result_queue.put(configure_static_routing(router, request.data["network_statements"])))
            threads.append(t)
            t.start()
        for thread in threads:
            thread.join()
        while not result_queue.empty():
            result.append(result_queue.get())
        return Response(result ,status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=400)
@api_view(['POST'])
def configRip(request):
    try:
        routers = []
        threads = []
        result = []
        result_queue = queue.Queue()
        for i in range(len(request.data['ip_address'])):
            # return Response(request.data['ip_address'][0])
            # return Response(request.data['ip_address'][I])
            interface = Interface.objects.get(ip_address=request.data["ip_address"][i])
            device = connect_to_device(interface.ip_address, interface.username, interface.password, interface.port, "cisco_ios")
            routers.append(device)
        for router in routers:
            t = threading.Thread(target=lambda: result_queue.put(configure_rip(router, request.data["network_statements"])))
            threads.append(t)
            t.start()
        for thread in threads:
            thread.join()
        while not result_queue.empty():
            result.append(result_queue.get())
        return Response(result ,status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=400)
    
@api_view(['POST'])   
def backup_file(request):
    try:
        routers = []
        hostnames = []
        files = []
        for i in range(len(request.data)):
            # return Response(request.data["ip_address"])
            device = Device.objects.get(hostname=request.data[i])
            interface = Interface.objects.filter(connected_to=device)[0]
            router = {"ip_address":interface.ip_address, "port": interface.port, "username": interface.username, "password": interface.password, "device_type": "cisco_ios"}
            hostnames.append(request.data[i])
            routers.append(router)
        for i in range(len(routers)):
            # return Response(routers[i])
            # return Response([backup(routers[i])])
            files.append({"hostname": hostnames[i], "file": backup(routers[i])})
        return Response(files)
    except Exception as e:
        return Response({"error": str(e)}, status=400)
    
# @api_view('GET')
# def devicesHostname(request):
#     response = []
#     devices = Device.objects.all()
#     for device in devices:
#         hostname = device.hostname
#         response.append(hostname)
#     return Response[hostname]

@api_view(['POST'])
def cpuInfo(request):
    # return Response(request.data)
    try:
        device =Device.objects.get(hostname=request.data[0])
        interface = Interface.objects.filter(connected_to=device)[0]
        connect = connect_to_device(interface.ip_address, interface.username, interface.password, interface.port, "cisco_ios")
        cpu = monitorCpu(connect)
        return Response(cpu)
    except Exception as e:
        return Response({"error": str(e)}, status=400)
@api_view(['GET'])
def cpuAverage(request):
    interface = Interface.objects.get(ip_address='192.168.3.1')
    connect = connect_to_device(interface.ip_address, interface.username, interface.password, interface.port, "cisco_ios")
    output = connect.send_command('sh process cpu')
    pattern = r'one minute: +(\d+)%'
    match = re.search(pattern, output)

    # Extract the CPU utilization value
    cpu_utilization_one_minute = match.group(1)
    return Response(cpu_utilization_one_minute)