export interface Employees {
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

export const GROUPS = [
  'Engineering',
  'Marketing',
  'Finance',
  'Human Resources',
  'Sales',
  'Operations',
  'Legal',
  'Customer Support',
  'Product',
  'Design',
];
