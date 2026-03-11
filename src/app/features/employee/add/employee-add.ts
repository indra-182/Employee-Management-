import { Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { GROUPS } from '@app/utils/constants';
import { EmployeeService } from '@app/services/employee/employee.service';
import { ToastrService } from '@app/services/toastr/toastr.service';
import { pastDateValidator } from '@/app/utils/functions';

@Component({
  selector: 'app-employee-add',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './employee-add.html',
})
export class EmployeeAdd {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private employeeService = inject(EmployeeService);
  private toastr = inject(ToastrService);

  form = this.fb.group({
    username: ['', Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    birthDate: ['', [Validators.required, pastDateValidator]],
    basicSalary: [null as number | null, [Validators.required, Validators.min(0)]],
    status: ['', Validators.required],
    group: ['', Validators.required],
    description: ['', Validators.required],
  });

  groupSearch = signal('');
  groupDropdownOpen = signal(false);

  filteredGroups = computed(() => {
    const query = this.groupSearch().toLowerCase();
    return query ? GROUPS.filter((g) => g.toLowerCase().includes(query)) : GROUPS;
  });

  today = new Date().toISOString().split('T')[0];

  onGroupSearch(event: Event): void {
    this.groupSearch.set((event.target as HTMLInputElement).value);
  }

  selectGroup(group: string): void {
    this.form.patchValue({ group });
    this.groupDropdownOpen.set(false);
    this.groupSearch.set('');
  }

  toggleGroupDropdown(): void {
    this.groupDropdownOpen.update((v) => !v);
  }

  onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const confirmed = confirm('Are you sure you want to add this employee?');
    if (!confirmed) return;
    const v = this.form.value;
    this.employeeService.add({
      username: v.username!,
      firstName: v.firstName!,
      lastName: v.lastName!,
      email: v.email!,
      birthDate: new Date(v.birthDate!),
      basicSalary: v.basicSalary!,
      status: v.status!,
      group: v.group!,
      description: v.description!,
    });
    this.toastr.success('Employee added successfully');
    this.router.navigate(['/employees']);
  }
}
