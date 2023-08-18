import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DevicesControllerService } from '../shared/devices-controller.service';
import { InterfaceControllerService } from '../shared/interface-controller.service';
import { InterfaceInfoResponse } from '../shared/interfaceInfoResponse';
@Component({
  selector: 'app-interface-form',
  templateUrl: './interface-form.component.html',
  styleUrls: ['./interface-form.component.css']
})
export class InterfaceFormComponent implements OnInit{
  interfaceForm: FormGroup;
  devices: string[]=[];
  interfaces: string[]=[]
  // selectedOption: string = "";
  constructor(private formBuilder: FormBuilder,  private deviceServ: DevicesControllerService, private interfaceServ: InterfaceControllerService) {
    this.interfaceForm = this.formBuilder.group({
      name: ['', Validators.required],
      ip_address: ['', [Validators.required, Validators.pattern('^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}$')]],
      username: ['', Validators.required],
      password: ['', Validators.required],
      port: ['', Validators.required],
      connected_to: [null],
    });
  }

  ngOnInit(): void {
    this.deviceServ.devicesNames().subscribe((data: any) => {
      console.log(data);
      this.devices = data;
    });
    this.interfaceServ.interfacesIps().subscribe((data) => { 
      this.interfaces = data;
    });
  }

  onSubmit() {
    if (this.interfaceForm.valid) {
      console.log(this.interfaceForm.value);
      this.interfaceServ.addInterface(this.interfaceForm.value).subscribe(res=>{
        alert('Form Submitted!');
        }, err => {
          alert('Form Not Submitted!');
        } 
        );
      
    } else {
      alert('Form Not Submitted!');
      // Form is invalid, handle the validation errors.
    }
  }

  // resetInput() {
  //   this.selectedOption = ''
  // }
  //  onInputChange() {
  //   if (!this.interfaces.includes(this.selectedOption) || this.devices.includes(this.selectedOption)) {
  //     this.resetInput();
  //   }
  //  }
}
