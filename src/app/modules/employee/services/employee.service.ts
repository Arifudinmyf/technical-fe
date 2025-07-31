import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Employee, EmployeeQueryParams, EmployeeResponse } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private employees: Employee[] = [];

  constructor() {
    for (let i = 1; i <= 100; i++) {
      this.employees.push({
        username: `user${i}`,
        firstName: `First${i}`,
        lastName: `Last${i}`,
        email: `user${i}@example.com`,
        birthDate: new Date(1990, i % 12, i % 28 + 1),
        basicSalary: 5000 + i * 10,
        status: i % 2 === 0 ? 'Active' : 'Inactive',
        group: `Group ${i % 4 + 1}`,
        description: `Employee description ${i}`
      });
    }
  }

  getEmployees(params: EmployeeQueryParams) {
    return of({
      employees: this.employees,
      total: this.employees.length
    } as EmployeeResponse);
  }

  addEmployee(employee: Employee): Observable<Employee> {
    this.employees.push(employee);
    return of(employee);
  }

  updateEmployee(username: string, updatedEmployee: Employee): Observable<Employee> {
    const index = this.employees.findIndex(e => e.username === username);
    if (index !== -1) {
      this.employees[index] = { ...updatedEmployee };
    }
    return of(this.employees[index]);
  }

  getEmployeeByUsername(username: string): Observable<Employee | undefined> {
    const employee = this.employees.find(e => e.username === username);
    return of(employee);
  }

  onDetail(employee: Employee): Observable<Employee> {
    return of(employee);
  }


}
