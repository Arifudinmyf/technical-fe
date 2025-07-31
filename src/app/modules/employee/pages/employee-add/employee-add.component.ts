import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-employee-add',
  templateUrl: './employee-add.component.html',
  styleUrls: ['./employee-add.component.scss']
})
export class EmployeeAddComponent implements OnInit {

  form!: FormGroup;

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      birthDate: ['', Validators.required],
      basicSalary: ['', [Validators.required, Validators.min(0)]],
      status: ['', Validators.required],
      group: ['', Validators.required],
      description: ['', Validators.maxLength(500)]
    });
  }

  // Additional methods for handling employee addition can be added here
  onSubmit() {
    this.employeeService.addEmployee(this.form.value).subscribe({
      next: (employee) => {
        console.log('Employee added successfully:', employee);
        this.snackBar.open('Employee added successfully!', 'Close', {
          duration: 2000,
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['../'], { relativeTo: this.route });
      }
      , error: (error) => {   
        this.snackBar.open('Failed to add employee: ' + error.message, 'Close', {
          duration: 2000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

}
