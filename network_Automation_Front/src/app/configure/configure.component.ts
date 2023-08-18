import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProtocolsControllerService } from '../shared/protocols-controller.service';
// import { ProtocolsControllerService } from '../shared/protocols-controller.service';
// import { InterfaceControllerService } from '../shared/interface-controller.service';

@Component({
  selector: 'app-configure',
  templateUrl: './configure.component.html',
  styleUrls: ['./configure.component.css']
})
export class ConfigureComponent implements OnInit {

  ips:string = "";
  protocols:string[] = ['ospf', 'eigrp', 'rip', 'bgp'];
  currProtocol:string = '';
  protocolsForm!: FormGroup;
  ripForm!: FormGroup;
  output: string = "";
  configuring: boolean = false;
  
  constructor(private route: ActivatedRoute,private formBuilder: FormBuilder, private protocolServ: ProtocolsControllerService) { 
    this.protocolsForm = this.formBuilder.group({
      process_id: ["", Validators.required],
      network_statements: [[''], Validators.required],
    });
    this.ripForm = this.formBuilder.group({
      network_statements: [[''], Validators.required],})
  }
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if(params['ips'])
      this.ips = params['ips'].split('$').join('\n');
    }); 
  }



  onChange(event:any){
    if(event.target.value === 'ospf'){
      this.currProtocol = 'ospf';
      this.output = '';
      
    }
    else if(event.target.value === 'eigrp'){
      this.currProtocol = 'eigrp'
      this.output = '';
    }
    else if(event.target.value === 'rip'){
      this.currProtocol = 'rip'
      this.output = '';
    }
    else if(event.target.value === 'bgp'){
      this.currProtocol = 'bgp'
      this.output = '';
    }
    else if (event.target.value === 'static'){
      this.currProtocol = 'static'
      this.output = '';
    }
    else {
      this.currProtocol = '';
      this.output = '';
    }
  }
  onSubmitOspf(){
    if(this.protocolsForm.valid){
      const request : {ip_address:string[], ospf_process_id:string, network_statements:string[], area_configs?:string[]} 
                    = {ip_address:this.ips.split('\n'), ospf_process_id: this.protocolsForm.value.process_id, network_statements: this.protocolsForm.value.  network_statements.split("\n")
      }; 
      console.log(this.protocolsForm.value);
      this.configuring = true;
      this.protocolServ.configOspf(request).subscribe(
        data => {
        this.output = data;
        this.configuring = false
        },
        error=> {
        console.log(error);
        this.configuring = false
        }
      );
      
    }    
  }
  onSubmitEigrp(){
    if(this.protocolsForm.valid){
      const request : {ip_address:string[], eigrp_process_id:string, network_statements:string[]} 
                    = {ip_address:this.ips.split('\n'), eigrp_process_id: this.protocolsForm.value.process_id, network_statements: this.protocolsForm.value.  network_statements.split("\n")
      }; 
      this.configuring = true;
      this.protocolServ.configEigrp(request).subscribe(
        data => {
          this.output = data;
          this.configuring = false
          },
          error=> {
          console.log(error);
          this.configuring = false
          }
        );
    }
  }
  onSubmitBgp(){
    if(this.protocolsForm.valid){
      const request : {ip_address:string[], bgp_process_id:string, network_statements:string[]}
                    = {ip_address:this.ips.split('\n'), bgp_process_id: this.protocolsForm.value.process_id, network_statements: this.protocolsForm.value.  network_statements.split("\n")
      };
      this.configuring = true;
      this.protocolServ.configBgp(request).subscribe(
        data => {
          this.output = data;
          this.configuring = false
          },
          error=> {
          console.log(error);
          this.configuring = false
          }
        );
    }
  }
  onSubmitRip(){
    if(this.ripForm.valid){
      const request : {ip_address:string[], network_statements:string[]}
                    = {ip_address:this.ips.split('\n'), network_statements: this.ripForm.value. network_statements.split("\n")
      };
      this.configuring = true;
      this.protocolServ.configRip(request).subscribe(
        data => {
          this.output = data;
          this.configuring = false
          },
          error=> {
          console.log(error);
          this.configuring = false
          }
        );
    }
  }
  onSubmitStatic(){
    if(this.ripForm.valid){
      const request : {ip_address:string[], network_statements:string[]}
                    = {ip_address:this.ips.split('\n'), network_statements: this.ripForm.value. network_statements.split("\n")
      };
      this.configuring = true;
      this.protocolServ.configStatic(request).subscribe(
        data => {
          this.output = data;
          this.configuring = false
          },
          error=> {
          console.log(error);
          this.configuring = false
          }
        );
    }
  }
}
