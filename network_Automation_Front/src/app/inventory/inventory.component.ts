import { Component, OnInit } from '@angular/core';
import { InterfaceControllerService } from '../shared/interface-controller.service';
import { InterfaceInfoResponse } from '../shared/interfaceInfoResponse';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as faStarSolid, faArrowsRotate} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { query } from '@angular/animations';
@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit{
  interfaces :InterfaceInfoResponse[] = [];
  faStar = faStar;
  faRefresh = faArrowsRotate;
  ischecked = 'not-checked';
  listChecked: string[] = [];
  constructor(private interfaceServ: InterfaceControllerService, private router: Router) {}
  
  ngOnInit() {
    this.interfaceServ.getInterfaces().subscribe((data:InterfaceInfoResponse[]) => {
      console.log("data")
      console.log(data)
      this.interfaces = data;
    })
    //check the fav interfaces
  }
  changeFavStatus() {
    if(this.faStar === faStar) {
      this.faStar = faStarSolid;
      this.ischecked = 'checked';
    }
    else {
      this.faStar = faStar;
      this.ischecked = 'not-checked';
    }
  }
  onCheckboxChange(e: any) {
    if(!e.target.checked) {
      this.listChecked = this.listChecked.filter((item) => item !== 'checkbox-'+e.target.id)  
    }
    else {;
      var pushItem = e.target.id.substring(9); 
      this.listChecked.push(pushItem);
      console.log(this.listChecked);
    }      
  }
  deleteInterfaces() {
    console.log(this.listChecked);
    this.interfaceServ.deleteInterfaces(this.listChecked).subscribe(()=>{
        this.interfaceServ.getInterfaces().subscribe((data:InterfaceInfoResponse[]) => {
          this.interfaces = data;
        });
      });
    this.listChecked = [];
    alert('Interfaces deleted!');
  }

  onRefresh() {
    this.interfaceServ.getInterfaces().subscribe((data:InterfaceInfoResponse[]) => {
      
      this.interfaces = data;
      });
  }
  onConfigure() {
    const params = this.listChecked.join('$');
    this.router.navigate(['/configure'], {queryParams: {ips: params}});
  }
}
