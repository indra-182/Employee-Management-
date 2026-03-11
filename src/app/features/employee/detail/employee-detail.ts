import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Employee } from '@app/shared/models/employee';
import { EmployeeService } from '@app/core/services/employee/employee.service';
import { StatusBadge } from '@app/shared/components/status-badge/status-badge';
import { RupiahPipe } from '@app/shared/pipes/rupiah.pipe';

@Component({
  selector: 'app-employees-detail',
  imports: [RouterLink, RupiahPipe, DatePipe, StatusBadge],
  templateUrl: './employee-detail.html',
})
export class EmployeeDetail {
  private route = inject(ActivatedRoute);
  private employeeService = inject(EmployeeService);

  employee = signal<Employee | undefined>(undefined);

  constructor() {
    const username = this.route.snapshot.paramMap.get('username')!;
    this.employee.set(this.employeeService.getByUsername(username));
  }
}
