import { Component, OnDestroy, OnInit } from '@angular/core';
import {faSitemap,  faHardDrive } from '@fortawesome/free-solid-svg-icons';
import { DevicesControllerService } from '../shared/devices-controller.service';
import { DeviceCountResponse } from '../shared/deviceCountResponse';
import { animate, state, keyframes, style, transition, trigger } from '@angular/animations';
import { InterfaceControllerService } from '../shared/interface-controller.service';
import { InterfaceCountResponse } from '../shared/interfaceCountResponse';
import { Chart } from 'angular-highcharts';
import { LocalStorageService } from 'ngx-webstorage';
import { error } from 'highcharts';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  // animations: [
  //   trigger('slideAnimation', [
  //     state('visible', style({ transform: 'translateX(180px)', opacity: 0})),
  //     transition('hidden => visible', animate('2000ms ease-in-out'))
  //   ])
  // ]
})
export class DashboardComponent implements OnInit, OnDestroy {

  constructor(private deviceServ: DevicesControllerService, private interfaceServ: InterfaceControllerService, private localStorage: LocalStorageService){}
  devices_hostname:string[] = []
  interval: any;
  average:number = 0
  ip_input = ''
  faHardDrive = faHardDrive;
  faSiteMap = faSitemap;
  devices: any[] = [{value: 0, text: 'Total Devices', info:'visible'},{value: 0, text: 'Switches', info:'hidden'},{value: 0, text: 'Routers', info:'hidden'}];
  interfaces: any[] = [{value: 0, text: 'Total Interfaces', info:'visible'},{value: 0, text: 'Up', info:'hidden'},{value: 0, text: 'Down', info:'hidden'}];
  myData = Array.from({length: 60}, () => 0)
  chart = new Chart({
    chart: {
      type: 'line'
    },
    title: {
      text: 'Cpu Usage',
      style: {
        color: '#FFFFFF' // Title text color
      }
    },
    credits: {
      enabled: false
    },
    xAxis: {
      title: {
        text: 'Last 60 minutes'
      },
      min: 0,
      max: 60,
      tickInterval: 2,
    },
    yAxis: {
      categories: Array.from({ length: 100 }, (_, i) => i +''),
      title: {
        text: 'usage %'
      },
      labels: {
        format: '{value}%'
      },
      min: 0,
      max: 100,
      tickInterval: 20,
      
    },
    
    plotOptions: {
      line: {
        marker: {
          enabled: false // Remove data points
        }
      }
    },
    
    series: [
      { 
        type: 'line',
        name: 'Line1',
        data: this.myData
      }
    ]
  });
  // onMouseEnter() {
  //  // Change the content when hovering
  //   this.devices[0].info = 'visible';
  // }
  
  // onMouseLeave() {
  //   this.devices[0].info = 'hidden';
  //   this.devices[1].info = 'hidden';
  //   this.devices[2].info = 'hidden';
  // }
  // onAnimationDone() {
  //   if(this.devices[0].info == 'visible') {
  //     this.devices[0].info = 'hidden'
  //     this.devices[1].info = 'visible';
  //   }
  //   else if(this.devices[1].info == 'visible') {
  //     this.devices[1].info= 'hidden';
  //     this.devices[2].info = 'visible';
  //   }
  //   else{
  //     this.devices[2].info = 'hidden';
  //     this.devices[0].info = 'visible';
  //   }
  // }


  
  ngOnInit() {
    
    if(this.localStorage.retrieve('username') == null) window.location.href = '/login'
    this.deviceServ.deviceCount().subscribe((data : DeviceCountResponse) => {
      this.devices[0].value = data.routers + data.switches;
      this.devices[1].value = data.switches;
      this.devices[2].value = data.routers;
    })
    this.interfaceServ.interfaceCount().subscribe((data : InterfaceCountResponse) => {
      this.interfaces[0].value = data.up + data.down;
      this.interfaces[1].value = data.up;
      this.interfaces[2].value = data.down;
    })
    this.deviceServ.devicesNames().subscribe(data => {
      this.devices_hostname = data
      console.log(data)
    })
    this.deviceServ.getCpuAverage().subscribe(data => {
      console.log(data)
      this.average = data
    });
  }
  onChange(event:any){
    clearInterval(this.interval);
    let request = [event.target.value]
    console.log(request)
    this.deviceServ.getCpuUsage(request).subscribe(response => { console.log(response)
      for(let i = 0; i < 10; i++){
          if(response[i].length > 0){
            for(let j = 0; j < response[i].length; j++){
              let index = (response[i][j])-3
              if(this.myData[j+index] == 0){
                this.myData[j+index] = (10-i)*10
              }
            }
          }  
      }
    console.log("dsa")
    console.log(this.myData)
    this.chart.ref$.subscribe(chart => {
      for(let i = 60 - 1; i >= 1; i--){
        chart.series[0].data[i].y = chart.series[0].data[i-1].y
      }
      for(let i = 0; i < 60; i++){
        chart.series[0].data[i].update(this.myData[i])
      }
    });
    this.interval = setInterval(() => {
      this.deviceServ.getCpuUsage(request).subscribe(response => { console.log(response)
        for(let i=0; i < 10; i++){
          if(response[i].length>0  && response[i][0] == 4){
            this.myData[0] = (10-i)*10;
            this.chart.ref$.subscribe(chart => {
            for(let i = 60 - 1; i >= 1; i--){
              chart.series[0].data[i].y = chart.series[0].data[i-1].y
            }
            chart.series[0].data[0].update(this.myData[0])
          
          });
          break;
        }
        this.myData[0] = 0;
      }
    })
      
    }, 55000);
  });
  }
  ngOnDestroy(){
    clearInterval(this.interval);
  }
}

