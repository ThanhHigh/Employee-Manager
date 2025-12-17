import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Employee {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  department?: string;
  keycloakUserId?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEmployeeDTO {
  name: string;
  email: string;
  phone?: string;
  department?: string;
  keycloakUserId?: string;
}

export interface UpdateEmployeeDTO {
  name?: string;
  email?: string;
  phone?: string;
  department?: string;
}

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  constructor(private http: HttpClient) {}

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(environment.apiUrl);
  }

  getEmployee(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${environment.apiUrl}/${id}`);
  }

  getOwnProfile(): Observable<Employee> {
    return this.http.get<Employee>(`${environment.apiUrl}/profile`);
  }

  createEmployee(employee: CreateEmployeeDTO): Observable<Employee> {
    return this.http.post<Employee>(environment.apiUrl, employee);
  }

  updateEmployee(id: number, employee: UpdateEmployeeDTO): Observable<Employee> {
    return this.http.put<Employee>(`${environment.apiUrl}/${id}`, employee);
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/${id}`);
  }
}