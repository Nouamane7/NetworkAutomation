import { Component } from '@angular/core';
import { faSearch, faEthernet, faBell } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
  faEthernet = faEthernet;
  faBell = faBell;
  faSearch = faSearch;
}
