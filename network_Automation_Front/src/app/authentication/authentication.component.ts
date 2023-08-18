import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../shared/authentication.service';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {
  username = ''
  password = ''
  constructor(private authSercive: AuthenticationService, private route:Router, private local:LocalStorageService) { } 
  ngOnInit() {
    if(this.local.retrieve('username')) this.route.navigate(['/dashboard']);
  }
  onClick(){
    this.authSercive.authenticate(this.username, this.password).subscribe(data=>{
      if(data){
        //refresh windo
        window.location.reload();

      }
  });
  }
}
