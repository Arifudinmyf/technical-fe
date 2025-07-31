export interface Employee {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: Date;
  basicSalary: number;
  status: string;
  group: string;
  description: string;
}

// export interface EmployeeQueryParams {
//   search?: string;
//   group?: string;
//   sort?: string;
//   direction?: string;
// }

export interface EmployeeQueryParams {
  pageIndex: number;
  pageSize: number;
  searchUsername?: string;
  searchgroup?: string;
  sort?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface EmployeeResponse {
  employees: Employee[];
  total?: number;
}
