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

export interface FilterSearch {
  name: string;
  status: string;
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
  currentPage: number;
  pageSize: number;
}
