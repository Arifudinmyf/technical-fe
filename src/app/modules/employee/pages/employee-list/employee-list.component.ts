import { Component, OnInit, ViewChild } from '@angular/core';
import { Employee, EmployeeQueryParams } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  displayedColumns: string[] = [
    'username', 'firstName', 'lastName', 'email', 'birthDate',
    'basicSalary', 'status', 'group', 'description', 'action'
  ];
  employees: Employee[] = [];
  searchUsername = '';
  searchgroup = '';

  pageOptions = [10, 25, 50];
  pageIndex = 0;
  pageSize = 10;
  totalData = 0;

  queryParams: EmployeeQueryParams = {
    pageIndex: 0,
    pageSize: 10,
    searchUsername: '',
    searchgroup: '',
    sort: '',
    sortDirection: 'asc'
  };

  dataSource = new MatTableDataSource<Employee>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    const storedUsername = localStorage.getItem('searchUsername');
    const storedGroup = localStorage.getItem('searchgroup');
    if (storedUsername) this.searchUsername = storedUsername;
    if (storedGroup) this.searchgroup = storedGroup;
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.queryParams.pageIndex = this.pageIndex;
    this.queryParams.pageSize = this.pageSize;
    this.queryParams.searchUsername = this.searchUsername;
    this.queryParams.searchgroup = this.searchgroup;

    this.employeeService.getEmployees(this.queryParams).subscribe(response => {
      this.employees = response.employees;
      this.totalData = response.total || 0;
      this.dataSource.data = this.employees;
    });

    this.applyFilter();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.sort.sortChange.subscribe(sort => {
      this.applySort(sort);
    });
  }

  // ngOnDestroy() {
  //   localStorage.removeItem('searchUsername');
  //   localStorage.removeItem('searchgroup');
  // }

  applyUsernameFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchUsername = filterValue.trim().toLowerCase();
    localStorage.setItem('searchUsername', this.searchUsername);
    this.applyFilter();
  }

  applyGroupFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchgroup = filterValue.trim().toLowerCase();
    localStorage.setItem('searchgroup', this.searchgroup);
    this.applyFilter();
  }

  applyFilter() {
    localStorage.setItem('searchUsername', this.searchUsername);
    localStorage.setItem('searchgroup', this.searchgroup);
    if (this.searchUsername) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { searchUsername: this.searchUsername },
        queryParamsHandling: 'merge'
      })
      this.dataSource.filter = this.searchUsername.toLowerCase();
    } else if (this.searchgroup) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { searchgroup: this.searchgroup },
        queryParamsHandling: 'merge'
      })
      this.dataSource.filter = this.searchgroup.toLowerCase();
    } else {
      Object.keys(this.route.snapshot.queryParams).forEach(key => {
        if (key.startsWith('search')) {
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { [key]: null },
            queryParamsHandling: 'merge'
          });
        }
      }
      );
    }
  }

  applySort(sort: Sort) {
    const queryParams = {
      ...this.route.snapshot.queryParams,
      // search: this.searchUsername,
      sort: sort.active,
      direction: sort.direction,
    };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });
  }

  onPageChange(event: PageEvent): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        pageIndex: event.pageIndex,
        pageSize: event.pageSize
      },
      queryParamsHandling: 'merge'
    });
  }

  onEdit(emp: Employee) {
    this.router.navigate(['edit-employee', emp.username], { relativeTo: this.route });
  }
  onDelete(emp: Employee) {
    this.snackBar.open(`Deleted ${emp.username}`, 'Close', {
      duration: 3000,
      panelClass: ['delete-snackbar']
    });
  }

  navigateToAdd() {
    this.router.navigate(['add-employee'], { relativeTo: this.route });
  }

  onDetail(emp: Employee) {
    this.router.navigate(['detail-employee', emp.username], { relativeTo: this.route });
  }

}
