import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss']
})
export class EmployeeDetailComponent implements OnInit {
  employee?: Employee;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private employeeService: EmployeeService
  ) { }

  ngOnInit(): void {
    const username = this.route.snapshot.paramMap.get('username');
    if (username) {
      this.employeeService.getEmployeeByUsername(username).subscribe({
        next: (employee) => {
          this.employee = employee;
        },
        error: (err) => {
          console.error('Gagal ambil data:', err);
        }
      });
    }
  }

  onBack(): void {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }


}
