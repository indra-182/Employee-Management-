import { Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { GROUPS } from '@app/shared/utils/constants';
import { EmployeeService } from '@app/core/services/employee/employee.service';
import { ToastrService } from 'ngx-toastr';
import { pastDateValidator } from '@app/shared/utils/functions';
import { ConfirmDialog } from '@app/shared/components/confirm-dialog/confirm-dialog';
import { FormField } from '@app/shared/components/form-field/form-field';

@Component({
  selector: 'app-employee-add',
  imports: [ReactiveFormsModule, RouterLink, ConfirmDialog, FormField],
  templateUrl: './employee-add.html',
})
export class EmployeeAdd {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private employeeService = inject(EmployeeService);
  private toastr = inject(ToastrService);

  form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    birthDate: ['', [Validators.required, pastDateValidator]],
    basicSalary: [0, [Validators.required, Validators.min(1)]],
    status: ['', Validators.required],
    group: ['', Validators.required],
    description: ['', Validators.required],
  });

  groupSearch = signal('');
  groupDropdownOpen = signal(false);
  showConfirm = signal(false);
  salaryDisplay = signal('');
  today = new Date().toISOString().split('T')[0];

  filteredGroups = computed(() => {
    const query = this.groupSearch().toLowerCase();
    return query ? GROUPS.filter((g) => g.toLowerCase().includes(query)) : GROUPS;
  });

  onSalaryInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value.replace(/\D/g, '');
    const num = raw ? parseInt(raw, 10) : 0;
    this.form.patchValue({ basicSalary: num });
    this.form.controls.basicSalary.markAsTouched();
    this.salaryDisplay.set(num ? new Intl.NumberFormat('id-ID').format(num) : '');
  }

  onGroupSearch(event: Event): void {
    this.groupSearch.set((event.target as HTMLInputElement).value);
  }

  selectGroup(group: string): void {
    this.form.patchValue({ group });
    this.groupDropdownOpen.set(false);
    this.groupSearch.set('');
  }

  toggleGroupDropdown(): void {
    this.groupDropdownOpen.update((open) => !open);
  }

  onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.showConfirm.set(true);
  }

  confirmSave(): void {
    this.showConfirm.set(false);

    const formValue = this.form.getRawValue();
    this.employeeService.add({ ...formValue, birthDate: new Date(formValue.birthDate) });

    this.toastr.success('Employee added successfully');
    this.router.navigate(['/employees']);
  }

  cancelSave(): void {
    this.showConfirm.set(false);
  }
}
