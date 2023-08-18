import { Component } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'network_Automation_Front';
  connected: boolean = false;
  constructor(private localStorage: LocalStorageService) { }
  ngOnInit() {
    this.connected = this.localStorage.retrieve('username') ? true : false;
  }
}
