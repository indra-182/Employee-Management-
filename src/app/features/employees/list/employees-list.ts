import { Component, computed, inject, signal, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Employees } from '@app/shared/models/employees';
import { EmployeeService } from '@app/services/employees/employees.service';
import { NotificationService } from '@app/services/notifications/notifications.service';

@Component({
  selector: 'app-employee-list',
  imports: [RouterLink],
  templateUrl: './employees-list.html',
})
export class EmployeeList implements OnDestroy {
  private employeeService = inject(EmployeeService);
  private notification = inject(NotificationService);
  private router = inject(Router);

  searchName = signal(this.employeeService.searchState().name);
  searchInput = signal(this.employeeService.searchState().name);
  searchStatus = signal(this.employeeService.searchState().status);
  private searchDebounceTimer: any = null;
  private debounceMs = 300; // ms
  sortColumn = signal('firstName');
  sortDirection = signal<'asc' | 'desc'>('asc');
  currentPage = signal(1);
  pageSize = signal(10);

  filtered = computed(() => {
    let list = this.employeeService.getAll();
    const name = this.searchName().toLowerCase().trim();
    const status = this.searchStatus();

    if (name) {
      list = list.filter(
        (e) =>
          e.firstName.toLowerCase().includes(name) ||
          e.lastName.toLowerCase().includes(name) ||
          e.username.toLowerCase().includes(name),
      );
    }
    if (status) {
      list = list.filter((e) => e.status === status);
    }

    const col = this.sortColumn() as keyof Employees;
    const dir = this.sortDirection();
    return [...list].sort((a, b) => {
      const aVal = a[col];
      const bVal = b[col];
      if (aVal < bVal) return dir === 'asc' ? -1 : 1;
      if (aVal > bVal) return dir === 'asc' ? 1 : -1;
      return 0;
    });
  });

  totalItems = computed(() => this.filtered().length);
  totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()) || 1);

  paged = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filtered().slice(start, start + this.pageSize());
  });

  visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const max = 5;
    if (total <= max) return Array.from({ length: total }, (_, i) => i + 1);
    let start = Math.max(1, current - Math.floor(max / 2));
    const end = Math.min(total, start + max - 1);
    start = Math.max(1, end - max + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });

  from = computed(() =>
    this.totalItems() === 0 ? 0 : (this.currentPage() - 1) * this.pageSize() + 1,
  );
  to = computed(() => Math.min(this.currentPage() * this.pageSize(), this.totalItems()));

  onSearchName(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.searchInput.set(val);
    this.currentPage.set(1);
    if (this.searchDebounceTimer) clearTimeout(this.searchDebounceTimer);
    this.searchDebounceTimer = setTimeout(() => {
      this.searchName.set(val);
      this.saveSearch();
      this.searchDebounceTimer = null;
    }, this.debounceMs);
  }

  ngOnDestroy(): void {
    if (this.searchDebounceTimer) clearTimeout(this.searchDebounceTimer);
  }

  onSearchStatus(event: Event): void {
    this.searchStatus.set((event.target as HTMLSelectElement).value);
    this.currentPage.set(1);
    this.saveSearch();
  }

  onPageSize(event: Event): void {
    this.pageSize.set(+(event.target as HTMLSelectElement).value);
    this.currentPage.set(1);
  }

  toggleSort(column: string): void {
    if (this.sortColumn() === column) {
      this.sortDirection.update((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
  }

  sortIcon(column: string): string {
    if (this.sortColumn() !== column) return '↕';
    return this.sortDirection() === 'asc' ? '↑' : '↓';
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
  }

  viewDetail(employee: Employees): void {
    this.router.navigate(['/employees', employee.username]);
  }

  onEdit(event: Event, employee: Employees): void {
    event.stopPropagation();
    this.notification.show(`Edit action for ${employee.firstName} ${employee.lastName}`, 'warning');
  }

  onDelete(event: Event, employee: Employees): void {
    event.stopPropagation();
    this.notification.show(
      `Delete action for ${employee.firstName} ${employee.lastName}`,
      'danger',
    );
  }

  private saveSearch(): void {
    this.employeeService.saveSearchState({
      name: this.searchName(),
      status: this.searchStatus(),
    });
  }
}
