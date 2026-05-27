import { useState, useEffect, useMemo } from 'react';
import { List } from 'react-window';
import { Search, SlidersHorizontal, RefreshCw, Users, Activity, AlertCircle } from 'lucide-react';
import { getEmployees, getJobTitles, getCountries } from '../features/employees/api/getEmployees';
import type { Employee, JobTitle, Country } from '../features/employees/types/employee.types';

export default function EmployeesPage() {
  // State for reference data
  const [countries, setCountries] = useState<Country[]>([]);
  const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);

  // State for fetched employee list
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters State
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedJobTitle, setSelectedJobTitle] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');

  // Window height tracking for dynamic list size
  const [listHeight, setListHeight] = useState(550);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Handle screen resize to dynamically size the virtual list height
  useEffect(() => {
    const handleResize = () => {
      // Calculate height based on remaining space (leaving space for header, filters, pagination metadata)
      const calculated = window.innerHeight - 360;
      setListHeight(Math.max(calculated, 400)); // Minimum height of 400px
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch filter options (Countries and Job Titles) on mount
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [countriesData, jobTitlesData] = await Promise.all([
          getCountries(),
          getJobTitles(),
        ]);
        setCountries(countriesData);
        setJobTitles(jobTitlesData);

        // Extract unique departments from job titles
        const depts = Array.from(
          new Set(
            jobTitlesData
              .map((j) => j.department)
              .filter((d): d is string => !!d)
          )
        ).sort();
        setDepartments(depts);
      } catch (err) {
        console.error('Failed to load filter metadata:', err);
      }
    };
    loadFilters();
  }, []);

  // Reset employees and page count when search or filters change
  useEffect(() => {
    setEmployees([]);
    setPage(1);
    setHasMore(true);
  }, [debouncedSearch, selectedDept, selectedStatus, selectedJobTitle, selectedCountry]);

  // Fetch employees data whenever filters or page changes
  useEffect(() => {
    let isMounted = true;

    const fetchList = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getEmployees({
          search: debouncedSearch,
          department: selectedDept,
          status: selectedStatus,
          jobTitleId: selectedJobTitle,
          countryId: selectedCountry,
          page,
          limit: 100, // Performance optimization: fetch 100 items per page
        });

        if (isMounted) {
          setEmployees((prev) => {
            if (page === 1) return response.data;

            // Avoid double appending/duplicate IDs if fetches overlap
            const existingIds = new Set(prev.map((e) => e.id));
            const freshItems = response.data.filter((e) => !existingIds.has(e.id));
            return [...prev, ...freshItems];
          });
          setTotalCount(response.meta.total);
          setHasMore(page < response.meta.totalPages);
        }
      } catch (err) {
        if (isMounted) {
          setError('Could not retrieve employee directory. Please check server connections.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchList();

    return () => {
      isMounted = false;
    };
  }, [page, debouncedSearch, selectedDept, selectedStatus, selectedJobTitle, selectedCountry]);

  // Trigger loading next page when scrolling approaches the bottom
  const handleRowsRendered = (visibleRows: { startIndex: number; stopIndex: number }) => {
    // If the last visible item is close to the end of the loaded list, fetch next page
    if (visibleRows.stopIndex >= employees.length - 20 && hasMore && !isLoading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  // Helper to format currency
  const formatCurrency = (val: number, currencyCode: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 0,
    }).format(Number(val));
  };

  // Active employees count for dashboard-style header badge
  const activeCount = useMemo(() => {
    return employees.filter((e) => e.status === 'ACTIVE').length;
  }, [employees]);

  // Reset all filters
  const resetFilters = () => {
    setSearch('');
    setSelectedDept('');
    setSelectedStatus('');
    setSelectedJobTitle('');
    setSelectedCountry('');
  };

  // Virtual Row Renderer
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    // If this is the loader row at the end of the list
    if (index === employees.length) {
      return (
        <div
          style={style}
          className="flex items-center justify-center border-b border-slate-100 bg-slate-50/50 py-4 text-xs font-semibold tracking-wide text-slate-500"
        >
          <span className="mr-2.5 h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          Fetching additional staff records...
        </div>
      );
    }

    const employee = employees[index];
    if (!employee) return null;

    return (
      <div
        style={style}
        className="flex items-center border-b border-slate-100 px-6 text-sm text-slate-700 transition-colors hover:bg-slate-50/70"
      >
        {/* Emp No Column */}
        <div className="w-[10%] flex items-center pr-4">
          <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-xs font-semibold text-slate-600 border border-slate-200">
            {employee.employeeNo}
          </span>
        </div>

        {/* Full Name Column */}
        <div className="w-[18%] font-semibold text-slate-900 pr-4 truncate">
          {employee.fullName}
        </div>

        {/* Email Column */}
        <div className="w-[20%] text-slate-500 pr-4 truncate">
          {employee.email}
        </div>

        {/* Department Column */}
        <div className="w-[13%] pr-4 truncate">
          {employee.department ? (
            <span className="inline-flex rounded-full bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
              {employee.department}
            </span>
          ) : (
            <span className="text-slate-400 font-light">-</span>
          )}
        </div>

        {/* Job Title Column */}
        <div className="w-[14%] text-slate-600 pr-4 truncate">
          {employee.jobTitle?.title || <span className="text-slate-400 font-light">-</span>}
        </div>

        {/* Country Column */}
        <div className="w-[10%] pr-4 truncate text-slate-600 font-medium">
          {employee.country?.name || <span className="text-slate-400 font-light">-</span>}
        </div>

        {/* Salary Column */}
        <div className="w-[10%] text-right font-medium text-emerald-700 pr-4">
          {formatCurrency(employee.salary, employee.currency)}
        </div>

        {/* Status Column */}
        <div className="w-[5%] flex justify-center">
          {employee.status === 'ACTIVE' ? (
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" title="Active"></span>
            </span>
          ) : (
            <span className="h-2.5 w-2.5 rounded-full bg-slate-300" title="Inactive"></span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Info Panel */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-gradient-to-r from-indigo-900 to-violet-950 p-6 text-white shadow-md shadow-indigo-900/10">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Staff Directory</h1>
          <p className="mt-1.5 text-sm text-indigo-200/90 font-medium">
            Manage, filter, and review corporate records. Virtualized to handle large-scale database loads.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="rounded-xl bg-white/10 backdrop-blur-md px-4 py-2.5 border border-white/10 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-indigo-500/25 flex items-center justify-center text-indigo-300">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-indigo-200 font-semibold uppercase tracking-wider">Total records</div>
              <div className="text-lg font-bold font-mono">{totalCount.toLocaleString()}</div>
            </div>
          </div>
          <div className="rounded-xl bg-white/10 backdrop-blur-md px-4 py-2.5 border border-white/10 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-emerald-500/25 flex items-center justify-center text-emerald-300">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-indigo-200 font-semibold uppercase tracking-wider">Loaded Active</div>
              <div className="text-lg font-bold font-mono">{activeCount.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <SlidersHorizontal className="h-4.5 w-4.5 text-slate-500" />
            <span>Search Filters</span>
          </div>
          {(search || selectedDept || selectedStatus || selectedJobTitle || selectedCountry) && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <RefreshCw className="h-3 w-3" />
              Reset Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {/* Search text input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-9.5 pr-4 text-sm font-medium outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* Department filter */}
          <div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm font-medium outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Job Title filter */}
          <div>
            <select
              value={selectedJobTitle}
              onChange={(e) => setSelectedJobTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm font-medium outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">All Job Titles</option>
              {jobTitles.map((title) => (
                <option key={title.id} value={title.id}>
                  {title.title}
                </option>
              ))}
            </select>
          </div>

          {/* Country filter */}
          <div>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm font-medium outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">All Countries</option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm font-medium outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active Only</option>
              <option value="INACTIVE">Inactive Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Sticky Table Header */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 select-none">
          <div className="w-[10%]">Emp No</div>
          <div className="w-[18%]">Full Name</div>
          <div className="w-[20%]">Email Address</div>
          <div className="w-[13%]">Department</div>
          <div className="w-[14%]">Job Title</div>
          <div className="w-[10%]">Country</div>
          <div className="w-[10%] text-right">Salary</div>
          <div className="w-[5%] text-center">Status</div>
        </div>

        {/* List Content */}
        {error ? (
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <AlertCircle className="h-10 w-10 text-red-500 mb-3" />
            <p className="text-sm font-bold text-slate-800">{error}</p>
            <button
              onClick={() => setPage(page)}
              className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        ) : employees.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Users className="h-12 w-12 text-slate-300 mb-3" />
            <h3 className="text-sm font-bold text-slate-700">No staff matches found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              Try adjusting search keywords or clearing active filters to search the directory again.
            </p>
          </div>
        ) : (
          <div className="w-full">
            <List<{}>
              rowCount={employees.length + (hasMore ? 1 : 0)}
              rowHeight={52}
              rowComponent={Row}
              rowProps={{}}
              onRowsRendered={handleRowsRendered}
              style={{ height: listHeight, width: '100%' }}
              className="scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent"
            />
          </div>
        )}
      </div>

      {/* Footer Info Summary Row */}
      {!error && employees.length > 0 && (
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-2 select-none">
          <div>
            Showing <span className="text-slate-800 font-bold">{employees.length.toLocaleString()}</span> of{' '}
            <span className="text-slate-800 font-bold">{totalCount.toLocaleString()}</span> employees
          </div>
          {isLoading && (
            <div className="flex items-center gap-1.5 text-indigo-600">
              <span className="h-3.5 w-3.5 animate-spin rounded-full border border-indigo-600 border-t-transparent" />
              Loading batch...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
