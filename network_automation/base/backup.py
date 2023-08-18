from base.netmiko_command import connect_to_device

def backup(router):
    try:
        connection = connect_to_device(device_type=router['device_type'], ip=router['ip_address'], username=router['username'], password=router['password'], port=router['port'])
        connection.enable()
        output = connection.send_command('show run')
        connection.disconnect()
        return output
    except Exception as e:
        connection.disconnect()
        return e

# Example router dictionary
# device = {
#     'device_type': 'cisco_ios',
#     'ip': '192.168.3.70',
#     'username': 'u1',
#     'password': 'cisco',
#     'port': 22,
# }
# print(backup(device))