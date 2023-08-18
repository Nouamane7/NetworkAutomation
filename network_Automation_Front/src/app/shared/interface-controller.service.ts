import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InterfaceInfoResponse } from './interfaceInfoResponse';
import { InterfaceCountResponse } from './interfaceCountResponse';
import { AddInterfaceRequest } from './addInterfaceReuest';
import { InterfaceDetailsResponse } from './interface-details-response';

@Injectable({
  providedIn: 'root'
})
export class InterfaceControllerService {
  

  constructor(private http: HttpClient) { }

  getInterfaces(): Observable<InterfaceInfoResponse[]>{
    return this.http.get<InterfaceInfoResponse[]>('http://localhost:8000/api/interfaces/');
  }
  interfaceCount(): Observable<InterfaceCountResponse> {
    return this.http.get<InterfaceCountResponse>('http://localhost:8000/api/totalInterfaces/');
  }
  interfaceDelete(ip_address: number): Observable<boolean> {
    return this.http.post<boolean>('http://localhost:8000/api/delete-interface/', ip_address);
  }
  addInterface(request: AddInterfaceRequest): Observable<boolean> {
    return this.http.post<boolean>('http://localhost:8000/api/add-interface/', request);
  }
  interfacesIps(): Observable<string[]> {
    return this.http.get<string[]>('http://localhost:8000/api/interfaces-ips/');
  }
  deleteInterfaces(ips: string[]): Observable<boolean> {
    return this.http.post<any>('http://localhost:8000/api/delete-interfaces/', ips);
  }
  getInterfaceDetails(ip: string[]):Observable<any> {
    return this.http.post<any>('http://localhost:8000/api/interfaces-info/', ip);
  }
  
  
}
