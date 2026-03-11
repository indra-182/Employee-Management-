import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { Subject, debounceTime } from 'rxjs';
import { Employee } from '@app/shared/models/employee';
import { EmployeeService } from '@app/core/services/employee/employee.service';
import { StatusBadge } from '@app/shared/components/status-badge/status-badge';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employee-list',
  imports: [RouterLink, StatusBadge],
  templateUrl: './employee-list.html',
})
export class EmployeeList implements OnInit {
  private employeeService = inject(EmployeeService);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private searchSubject$ = new Subject<string>();

  searchInput = signal(this.employeeService.filterSearchState().name);

  filters = signal({
    searchName: this.employeeService.filterSearchState().name,
    searchStatus: this.employeeService.filterSearchState().status,
    sortColumn: this.employeeService.filterSearchState().sortColumn,
    sortDirection: this.employeeService.filterSearchState().sortDirection,
    currentPage: this.employeeService.filterSearchState().currentPage,
    pageSize: this.employeeService.filterSearchState().pageSize,
  });

  filtered = computed(() => {
    let list = this.employeeService.getAll();
    const { searchName, searchStatus, sortColumn, sortDirection } = this.filters();
    const query = searchName.toLowerCase().trim();

    if (query) {
      list = list.filter(
        (e) =>
          e.firstName.toLowerCase().includes(query) ||
          e.lastName.toLowerCase().includes(query) ||
          e.username.toLowerCase().includes(query),
      );
    }

    if (searchStatus) {
      list = list.filter((e) => e.status === searchStatus);
    }

    const col = sortColumn as keyof Employee;
    return [...list].sort((a, b) => {
      const aVal = a[col];
      const bVal = b[col];
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  });

  totalItems = computed(() => this.filtered().length);
  totalPages = computed(() => Math.ceil(this.totalItems() / this.filters().pageSize) || 1);

  paged = computed(() => {
    const { currentPage, pageSize } = this.filters();
    const start = (currentPage - 1) * pageSize;
    return this.filtered().slice(start, start + pageSize);
  });

  visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.filters().currentPage;
    const maxVisible = 5;

    if (total <= maxVisible) return Array.from({ length: total }, (_, i) => i + 1);

    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    const end = Math.min(total, start + maxVisible - 1);
    start = Math.max(1, end - maxVisible + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });

  from = computed(() => {
    const { currentPage, pageSize } = this.filters();
    return this.totalItems() === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  });

  to = computed(() =>
    Math.min(this.filters().currentPage * this.filters().pageSize, this.totalItems()),
  );

  ngOnInit(): void {
    this.searchSubject$
      .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.filters.update((f) => ({ ...f, searchName: value }));
        this.persistFilters();
      });
  }

  onSearchName(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchInput.set(value);
    this.filters.update((f) => ({ ...f, currentPage: 1 }));
    this.searchSubject$.next(value);
  }

  onSearchStatus(event: Event): void {
    this.filters.update((f) => ({
      ...f,
      searchStatus: (event.target as HTMLSelectElement).value,
      currentPage: 1,
    }));
    this.persistFilters();
  }

  onPageSize(event: Event): void {
    this.filters.update((f) => ({
      ...f,
      pageSize: +(event.target as HTMLSelectElement).value,
      currentPage: 1,
    }));
    this.persistFilters();
  }

  toggleSort(column: string): void {
    this.filters.update((f) => ({
      ...f,
      sortColumn: column,
      sortDirection: f.sortColumn === column ? (f.sortDirection === 'asc' ? 'desc' : 'asc') : 'asc',
    }));
    this.persistFilters();
  }

  sortIcon(column: string): string {
    const { sortColumn, sortDirection } = this.filters();
    if (sortColumn !== column) return '↕';
    return sortDirection === 'asc' ? '↑' : '↓';
  }

  goToPage(page: number): void {
    this.filters.update((f) => ({ ...f, currentPage: page }));
    this.persistFilters();
  }

  viewDetail(employee: Employee): void {
    this.router.navigate(['/employees', employee.username]);
  }

  onEdit(event: Event, employee: Employee): void {
    event.stopPropagation();
    this.toastr.warning(`Edit action for ${employee.firstName} ${employee.lastName}`);
  }

  onDelete(event: Event, employee: Employee): void {
    event.stopPropagation();
    this.toastr.error(`Delete action for ${employee.firstName} ${employee.lastName}`);
  }

  private persistFilters(): void {
    const { searchName, searchStatus, sortColumn, sortDirection, currentPage, pageSize } =
      this.filters();

    this.employeeService.saveFilterSearch({
      name: searchName,
      status: searchStatus,
      sortColumn,
      sortDirection,
      currentPage,
      pageSize,
    });
  }
}
