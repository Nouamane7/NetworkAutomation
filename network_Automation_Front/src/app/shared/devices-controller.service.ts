import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeviceRequest } from './deviceRequest';
import { DeviceCountResponse } from './deviceCountResponse';

@Injectable({
  providedIn: 'root'
})
export class DevicesControllerService {

  constructor(private http: HttpClient) { }

  getDevices(): Observable<any> {
    return this.http.get<any>('http://127.0.0.1:8000/api/devices');
  }

  deviceCount(): Observable<DeviceCountResponse> {
    return this.http.get<DeviceCountResponse>('http://localhost:8000/api/totalDevices/');
  }
  devicesNames(): Observable<string[]>{
    return this.http.get<string[]>('http://localhost:8000/api/devices-names/');
  }
  addDevice(request: DeviceRequest): Observable<boolean> {
    return this.http.post<boolean>('http://localhost:8000/api/add-device/', request);
  }
  getCpuUsage(hostname:string[]):Observable<any> {
    return this.http.post<any>("http://localhost:8000/api/cpu-usage/", hostname);
  }
  getCpuAverage():Observable<any> {
    return this.http.get<any>("http://localhost:8000/api/average-cpu/");
  }
}
