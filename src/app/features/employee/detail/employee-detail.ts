import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Employees } from '@app/shared/models/employees';
import { EmployeeService } from '@/app/services/employee/employee.service';
import { RupiahPipe } from '@app/shared/pipes/rupiah.pipe';

@Component({
  selector: 'app-employees-detail',
  imports: [RouterLink, RupiahPipe, DatePipe],
  templateUrl: './employee-detail.html',
})
export class EmployeeDetail {
  private route = inject(ActivatedRoute);
  private employeeService = inject(EmployeeService);

  employee = signal<Employees | undefined>(undefined);

  constructor() {
    const username = this.route.snapshot.paramMap.get('username')!;
    this.employee.set(this.employeeService.getByUsername(username));
  }
}
