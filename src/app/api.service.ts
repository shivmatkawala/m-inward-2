import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl='http://192.168.1.8:9191/trainingapidev'

  constructor(private http: HttpClient) {}

  getMaterialNames(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/materials`);
  }

  getSupplierNames(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/suppliers`);
  }

  
}
