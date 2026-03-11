import { Injectable, signal } from '@angular/core';
import { Employee, FilterSearch } from '@app/shared/models/employee';
import { FIRST_NAMES, GROUPS, LAST_NAMES } from '@app/shared/utils/constants';

function generateEmployees(): Employee[] {
  const employees: Employee[] = [];

  for (let i = 0; i < 100; i++) {
    const firstName = FIRST_NAMES[i % 20];
    const lastName = LAST_NAMES[Math.floor(i / 20)];

    employees.push({
      username: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}`,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@company.com`,
      birthDate: new Date(1970 + (i % 30), i % 12, (i % 28) + 1),
      basicSalary: 5_000_000 + i * 150_000,
      status: i % 3 === 0 ? 'Inactive' : 'Active',
      group: GROUPS[i % GROUPS.length],
      description: `Employee ${firstName} ${lastName} in the ${GROUPS[i % GROUPS.length]} department.`,
    });
  }

  return employees;
}

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private readonly employees = signal<Employee[]>(generateEmployees());

  readonly filterSearchState = signal<FilterSearch>({
    name: '',
    status: '',
    sortColumn: 'firstName',
    sortDirection: 'asc',
    currentPage: 1,
    pageSize: 10,
  });

  getAll(): Employee[] {
    return this.employees();
  }

  getByUsername(username: string): Employee | undefined {
    return this.employees().find((e) => e.username === username);
  }

  add(employee: Employee): void {
    this.employees.update((list) => [...list, employee]);
  }

  saveFilterSearch(state: FilterSearch): void {
    this.filterSearchState.set(state);
  }
}
