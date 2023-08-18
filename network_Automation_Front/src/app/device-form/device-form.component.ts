import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DevicesControllerService } from '../shared/devices-controller.service';

@Component({
  selector: 'app-device-form',
  templateUrl: './device-form.component.html',
  styleUrls: ['./device-form.component.css']
})
export class DeviceFormComponent {

deviceForm: FormGroup;

constructor(private formBuilder: FormBuilder, private deviceServ: DevicesControllerService) {
  this.deviceForm = this.formBuilder.group({
    hostname: ['', Validators.required],
    vendor: ['', Validators.required],
    device_type: ['', Validators.required],
  });
  }
  onSubmit(){
    if (this.deviceForm.valid) {
      this.deviceServ.addDevice(this.deviceForm.value).subscribe(data=> console.log(data));
      alert('Form Submitted!');

      // Process the form data and submit it to the backend (you can use HttpClient to make API calls).
      // For simplicity, we'll leave this part out in this example.
    } else {
      alert('Form Not Submitted!');
      // Form is invalid, handle the validation errors.
    }
  }

}
