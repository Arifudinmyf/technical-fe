import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Employee } from '../../models/employee.model';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.scss']
})
export class EmployeeEditComponent implements OnInit {
  form!: FormGroup;
  employeeId!: string;
  employeeData: Employee = {
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    birthDate: new Date(),
    basicSalary: 0,
    status: 'Active',
    group: '',
    description: ''
  };;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initForm()

    const username = this.route.snapshot.paramMap.get('username');
    if (username) {
      this.employeeService.getEmployeeByUsername(username).subscribe(employee => {
        if (employee) {
          this.form.patchValue(employee);
        }
      });
    }
  }

  initForm(): void {
    this.form = this.fb.group({
      username: [this.employeeData.username, Validators.required],
      firstName: [this.employeeData.firstName, Validators.required],
      lastName: [this.employeeData.lastName, Validators.required],
      email: [this.employeeData.email, [Validators.required, Validators.email]],
      birthDate: [new Date(this.employeeData.birthDate), Validators.required],
      basicSalary: [this.employeeData.basicSalary, [Validators.required, Validators.min(0)]],
      status: [this.employeeData.status, Validators.required],
      group: [this.employeeData.group, Validators.required],
      description: [this.employeeData.description]
    });
  }

  // Additional methods for handling employee editing can be added here
  updateEmployee(): void {
    if (this.form.invalid) return;

    const updatedEmployee: Employee = {
      ...this.form.value
    };

    this.employeeService.updateEmployee(this.employeeId, updatedEmployee).subscribe({
      next: () => {
        console.log('====================================');
        console.log('Employee updated successfully:', updatedEmployee);
        console.log('====================================');
        this.snackBar.open('Employee updated successfully!', 'Close', { duration: 2000 });
        this.router.navigate(['../../'], { relativeTo: this.route });
      },
      error: () => {
        this.snackBar.open('Failed to update employee.', 'Close', { duration: 3000 });
      }
    });
  }

  cancel(): void {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }

}
