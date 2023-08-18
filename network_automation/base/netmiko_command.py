import subprocess
from netmiko import ConnectHandler
import re
from ping3 import ping, verbose_ping

def connect_to_device(ip, username, password, port, device_type):
    try:
        device = {
            'device_type': device_type,
            'ip': ip,
            'username': username,
            'password': password,
            'port': port,
            'secret': password,
            'verbose': True
        }
        connection = ConnectHandler(**device)
        return connection
    except:
        return None

def show_info(connection, name):
    
    if connection:
        output = connection.send_command(f'show interface {name}')
        result = {} 
        result['hostname'] = ''
        result['ip_address'] = ''
        result['subnet_mask'] = ''
        status_pattern = r"line protocol is (\w+)"
        status_match = re.search(status_pattern, output)
        if status_match:
            interface_status = status_match.group(1)
            result["status"] = interface_status
        
        # Extract interface speed using regex
        speed_pattern = r"MTU (\d+) bytes, BW (\d+) Kbit/sec"
        speed_match = re.search(speed_pattern, output)
        if speed_match:
            mtu = speed_match.group(1)
            bandwidth_kbps = speed_match.group(2)
            result["mtu"] = mtu
            result["bandwidth_kbps"] = bandwidth_kbps
        address_pattern = r", address is (\w+\.\w+\.\w)"
        address_match = re.search(address_pattern, output)
        if address_match:
            mac_address = address_match.group(1)
            result["mac_address"] = mac_address

        reliability_pattern = r"reliability (\d+/+\d+)"
        reliability_match = re.search(reliability_pattern, output)
        if reliability_match:
            reliability = reliability_match.group(1)
            result["reliability"] = reliability
        
        txload_pattern = r"txload (\d+/+\d+)"
        txload_match = re.search(txload_pattern, output)
        if txload_match:
            txload = txload_match.group(1)
            result["txload"] = txload

        rxload_pattern = r"rxload (\d+/+\d+)"
        rxload_match = re.search(rxload_pattern, output)
        if rxload_match:
            rxload = rxload_match.group(1)
            result["rxload"] = rxload
        queueing_pattern = r"Queueing strategy: (\w+)"
        queueing_match = re.search(queueing_pattern, output)
        if queueing_match:
            queueing_strategy = queueing_match.group(1)
            result["queuing_strategy"] = queueing_strategy
        
        # Extract input and output rates
        input_rate_pattern = r"5 minute input rate (\d+) bits/sec, (\d+) packets/sec"
        input_rate_match = re.search(input_rate_pattern, output)
        if input_rate_match:
            input_bits_per_sec = input_rate_match.group(1)
            input_packets_per_sec = input_rate_match.group(2)
            result["input_Bits/sec"] = input_bits_per_sec
            result["input_Packets/sec"] = input_packets_per_sec
        
        output_rate_pattern = r"5 minute output rate (\d+) bits/sec, (\d+) packets/sec"
        output_rate_match = re.search(output_rate_pattern, output)
        if output_rate_match:
            output_bits_per_sec = output_rate_match.group(1)
            output_packets_per_sec = output_rate_match.group(2)
            result["output_Bits_sec"] = output_bits_per_sec
            result["output_Packets_sec"] = output_packets_per_sec
        
        # Extract packet statistics
        packets_input_pattern = r"(\d+) packets input, \d+ bytes"
        packets_input_match = re.search(packets_input_pattern, output)
        if packets_input_match:
            packets_input = packets_input_match.group(1)
            result["packets_input"] = packets_input
        
        packets_output_pattern = r"(\d+) packets output, \d+ bytes"
        packets_output_match = re.search(packets_output_pattern, output)
        if packets_output_match:
            packets_output = packets_output_match.group(1)
            result["packets_output"] = packets_output
        
        connection.disconnect()
        return result
    else:
        connection.disconnect()
        return None       


def configure_ospf(connect, ospf_process_id, network_statements,):
    try:
        # Establish SSH connection to the device

        # Configure OSPF process and related settings
        ospf_config = [
            f"router ospf {ospf_process_id}",
            *network_statements,
            "end",
            "write memory" # Save the configuration to startup-config
        ]
        if not connect.check_enable_mode():
            connect.enable()
        output = connect.send_config_set(ospf_config)
        connect.disconnect()
        return output
    except Exception as e:
        connect.disconnect()
        return e

def configure_eigrp(connect, as_number, network_statements): #no area 
    try:
        # Establish SSH connection to the device

        # Configure EIGRP process and related settings
        eigrp_config = [
            f"router eigrp {as_number}",
            *network_statements,
            "end",
            "write memory"  # Save the configuration to startup-config
        ]
        if not connect.check_enable_mode():
            connect.enable()
        output = connect.send_config_set(eigrp_config)
        connect.disconnect()
        return output
    except Exception as e:
        connect.disconnect()
        return False

def configure_rip(connect, network_statements):
    try:
        # Establish SSH connection to the device

        # Configure RIP process and related settings
        rip_config = [
            "router rip",
            *network_statements,
            "end",
            "write memory"  # Save the configuration to startup-config
        ]
        if not connect.check_enable_mode():
            connect.enable()
        output = connect.send_config_set(rip_config)
        connect.disconnect()
        return output
    except Exception as e:
        connect.disconnect()
        return False

def configure_bgp(connect, as_number, network_statements): #.0 i think
    try:
        # Establish SSH connection to the device

        # Configure BGP process and related settings
        bgp_config = [
            f"router bgp {as_number}",
            *network_statements,
            "end",
            "write memory"  # Save the configuration to startup-config
        ]
        if not connect.check_enable_mode():
            connect.enable()
        output = connect.send_config_set(bgp_config)
        connect.disconnect()
        return output
    except Exception as e:
        connect.disconnect()
        return False

def configure_static_routing(connect, network_statements):
    try:
        # Establish SSH connection to the device

        # Configure static routing process and related settings
        static_routing_config = [
            "ip route",
            *network_statements,
            "end",
            "write memory"  # Save the configuration to startup-config
        ]
        if not connect.check_enable_mode():
            connect.enable()
        output = connect.send_config_set(static_routing_config)
        connect.disconnect()
        return output
    except Exception as e:
        connect.disconnect()
        return False

def monitorCpu(connect):
    try:
        result = []
        output = connect.send_command("show processes cpu history")
        my_output = output.split("\n")[23:33]
        my_output[0] = my_output[0][1:]
        # for i in range(len(my_output)):
        #     my_output[i].pop(0)
        for i in range(len(my_output)):
            var = find_all_indexes(my_output[i], '*')
            result.append(var)
        connect.disconnect()
        return result
    except Exception as e:
        connect.disconnect()
        return False

def find_all_indexes(input_string, char_to_find):
    indexes = []
    for index, char in enumerate(input_string):
        if char == char_to_find:
            indexes.append(index)
    return indexes
# connect = {
#     'ip': "192.168.3.1",
#     'username': 'u1',
#     'password': 'cisco',
#     'port': 22,
#     'device_type': 'cisco_ios',
# }

# device = connect_to_device("192.168.3.70", "u1", "cisco", 22, "cisco_ios")
# print(monitorCpu(device))
# print(show_info(device, 'ethernet0/0'))
def getStatus(interface):
    try:
        response = subprocess.check_output(['ping', interface, '-n', '1'], text=True)
        if "TTL expired" in response or 'Destination host unreachable' in response:
            return 'down'
        else:
            print(interface)
            return 'up'
    except subprocess.CalledProcessError:
        return 'down'

# print(getStatus('192.168.3.14'))