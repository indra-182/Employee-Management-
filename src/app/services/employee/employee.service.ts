import { Injectable, signal } from '@angular/core';
import { Employees } from '@app/shared/models/employees';
import { FIRST_NAMES, GROUPS, LAST_NAMES } from '@app/utils/constants';

function generateEmployees(): Employees[] {
  const employees: Employees[] = [];
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

export interface SearchState {
  name: string;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private readonly employees = signal<Employees[]>(generateEmployees());
  readonly searchState = signal<SearchState>({ name: '', status: '' });

  getAll(): Employees[] {
    return this.employees();
  }

  getByUsername(username: string): Employees | undefined {
    return this.employees().find((e) => e.username === username);
  }

  add(employee: Employees): void {
    this.employees.update((list) => [...list, employee]);
  }

  saveSearchState(state: SearchState): void {
    this.searchState.set(state);
  }
}
