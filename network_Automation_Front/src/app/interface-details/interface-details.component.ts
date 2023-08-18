import { Component, OnInit } from '@angular/core';
import { InterfaceControllerService } from '../shared/interface-controller.service';
import { ActivatedRoute } from '@angular/router';

 // Declare Highcharts

@Component({
  selector: 'app-interface-details',
  templateUrl: './interface-details.component.html',
  styleUrls: ['./interface-details.component.css']
})
export class InterfaceDetailsComponent implements OnInit {
  interfaceDetails: { id: string, label: string, value: string }[] = [];
  constructor(private interServ: InterfaceControllerService, private route: ActivatedRoute) { }

  ngOnInit() {
    const ip = this.route.snapshot.paramMap.get('interface_info') as string;
    console.log(ip);
    
    this.interServ.getInterfaceDetails([ip]).subscribe(data => {
      this.interfaceDetails = Object.keys(data).map((key: string) => {
        return {
          id: key,
          label: key,
          value: data[key]
        };
      });

      // Format date values
      const date1 = new Date(this.interfaceDetails[17].value);
      this.interfaceDetails[17].value = date1.toLocaleString();
      
      const date2 = new Date(this.interfaceDetails[18].value);
      this.interfaceDetails[18].value = date2.toLocaleString();
    });
  }
}