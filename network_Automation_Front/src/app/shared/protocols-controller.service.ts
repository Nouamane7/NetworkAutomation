import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProtocolsControllerService {

  constructor(private http: HttpClient) { }
  configOspf(request:any): Observable<any> {
    return this.http.post<any>('http://localhost:8000/api/configure/ospf/', request);
  }
  configEigrp(request:any): Observable<any> {
    return this.http.post<any>('http://localhost:8000/api/configure/eigrp/', request);
  }
  configBgp(request:any): Observable<any> {
    return this.http.post<any>('http://localhost:8000/api/configure/bgp/', request);
  }
  configRip(request:any): Observable<any> {
    return this.http.post<any>('http://localhost:8000/api/configure/rip/', request);
  }
  configStatic(request:any): Observable<any> {
    return this.http.post<any>('http://localhost:8000/api/configure/static-routing/', request);
  }
  
}
