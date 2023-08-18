import { Component, OnInit } from '@angular/core';
import { DevicesControllerService } from '../shared/devices-controller.service';
import {faChartSimple, faArrowRightFromBracket ,faGears, faCloud, faServer, faCode} from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  constructor() { }
  faServer = faServer;
  faCloud = faCloud;
  faSettings = faGears;
  faExit = faArrowRightFromBracket;
  faChart = faChartSimple;
  faPython = faCode;
  exit(){
    localStorage.clear();
    window.location.reload();
  }
}

