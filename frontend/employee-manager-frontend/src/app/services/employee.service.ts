import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import Keycloak from 'keycloak-js';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  constructor(private http: HttpClient, private keycloak: Keycloak) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': 'Bearer ' + this.keycloak.token,
      'Content-Type': 'application/json'
    });
  }

  getEmployees(): Observable<any> {
    return this.http.get(environment.apiUrl, { headers: this.getHeaders() });
  }

  createEmployee(employee: any): Observable<any> {
    return this.http.post(environment.apiUrl, employee, { headers: this.getHeaders() });
  }

  deleteEmployee(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}