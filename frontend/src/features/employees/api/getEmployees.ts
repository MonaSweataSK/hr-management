import type { Employee, EmployeeFilters, PaginatedResponse, Country, JobTitle } from '../types/employee.types';

export async function getEmployees(filters: EmployeeFilters = {}): Promise<PaginatedResponse<Employee>> {
  const params = new URLSearchParams();
  
  if (filters.search) params.append('search', filters.search);
  if (filters.department) params.append('department', filters.department);
  if (filters.status) params.append('status', filters.status);
  if (filters.countryId) params.append('countryId', filters.countryId);
  if (filters.jobTitleId) params.append('jobTitleId', filters.jobTitleId);
  if (filters.page) params.append('page', String(filters.page));
  if (filters.limit) params.append('limit', String(filters.limit));

  const response = await fetch(`/api/employees?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch employees');
  }
  return response.json();
}

export async function getCountries(): Promise<Country[]> {
  const response = await fetch('/api/countries');
  if (!response.ok) {
    throw new Error('Failed to fetch countries');
  }
  return response.json();
}

export async function getJobTitles(): Promise<JobTitle[]> {
  const response = await fetch('/api/job-titles');
  if (!response.ok) {
    throw new Error('Failed to fetch job titles');
  }
  return response.json();
}
