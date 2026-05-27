export type EmployeeStatus = 'ACTIVE' | 'INACTIVE';

export interface Country {
  id: number;
  name: string;
  code: string;
  currency: string;
}

export interface JobTitle {
  id: number;
  title: string;
  department: string | null;
}

export interface Employee {
  id: number;
  employeeNo: string;
  fullName: string;
  email: string;
  phone: string | null;
  department: string | null;
  salary: number;
  currency: string;
  status: EmployeeStatus;
  hiredAt: string | null;
  createdAt: string;
  updatedAt: string;
  countryId: number;
  country: Pick<Country, 'id' | 'name' | 'code'>;
  jobTitleId: number;
  jobTitle: Pick<JobTitle, 'id' | 'title' | 'department'>;
}

export interface EmployeeFilters {
  search?: string;
  department?: string;
  status?: string;
  countryId?: string;
  jobTitleId?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
