import { useState, useEffect } from 'react';
import { Search, Filter, RefreshCw, Users, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { getEmployees, getJobTitles, getCountries } from '../features/employees/api/getEmployees';
import type { Employee, JobTitle, Country } from '../features/employees/types/employee.types';

const PAGE_SIZE = 100;

export default function EmployeesPage() {
  // Reference data for filter dropdowns
  const [countries, setCountries] = useState<Country[]>([]);
  const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);

  // Pending filter values (in sidebar, committed on Apply)
  const [pendingSearch, setPendingSearch] = useState('');
  const [pendingDept, setPendingDept] = useState('');
  const [pendingJobTitle, setPendingJobTitle] = useState('');
  const [pendingCountry, setPendingCountry] = useState('');
  const [pendingStatus, setPendingStatus] = useState('');

  // Applied filters (sent to the API)
  const [appliedSearch, setAppliedSearch] = useState('');
  const [appliedDept, setAppliedDept] = useState('');
  const [appliedJobTitle, setAppliedJobTitle] = useState('');
  const [appliedCountry, setAppliedCountry] = useState('');
  const [appliedStatus, setAppliedStatus] = useState('');

  // Data state
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Disable page-level scroll while on this page
  useEffect(() => {
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
    };
  }, []);

  // Load filter reference data (countries, job titles, departments)
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [countriesData, jobTitlesData] = await Promise.all([getCountries(), getJobTitles()]);
        setCountries(countriesData);
        setJobTitles(jobTitlesData);
        const depts = Array.from(
          new Set(jobTitlesData.map((j) => j.department).filter((d): d is string => !!d))
        ).sort();
        setDepartments(depts);
      } catch (err) {
        console.error('Failed to load filter metadata:', err);
      }
    };
    loadFilters();
  }, []);

  // Fetch employees on page or applied-filter change
  useEffect(() => {
    let isMounted = true;
    const fetchList = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getEmployees({
          search: appliedSearch,
          department: appliedDept,
          status: appliedStatus,
          jobTitleId: appliedJobTitle,
          countryId: appliedCountry,
          page,
          limit: PAGE_SIZE,
        });
        if (isMounted) {
          setEmployees(response.data);
          setTotalCount(response.meta.total);
          setTotalPages(response.meta.totalPages);
        }
      } catch {
        if (isMounted) setError('Could not retrieve employee directory. Please check server connections.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchList();
    return () => { isMounted = false; };
  }, [page, appliedSearch, appliedDept, appliedStatus, appliedJobTitle, appliedCountry]);

  // Commit pending filters → triggers refetch
  const applyFilters = () => {
    setPage(1);
    setAppliedSearch(pendingSearch);
    setAppliedDept(pendingDept);
    setAppliedJobTitle(pendingJobTitle);
    setAppliedCountry(pendingCountry);
    setAppliedStatus(pendingStatus);
  };

  // Reset everything
  const resetFilters = () => {
    setPendingSearch(''); setPendingDept(''); setPendingJobTitle('');
    setPendingCountry(''); setPendingStatus('');
    setPage(1);
    setAppliedSearch(''); setAppliedDept(''); setAppliedJobTitle('');
    setAppliedCountry(''); setAppliedStatus('');
  };

  const hasFilters = !!(pendingSearch || pendingDept || pendingJobTitle || pendingCountry || pendingStatus);

  // Format salary currency
  const formatCurrency = (val: number, currencyCode = 'USD') =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode, maximumFractionDigits: 0 }).format(Number(val));

  // Build paginator page numbers with ellipsis
  const getPageNumbers = (): (number | '...')[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | '...')[] = [1];
    if (page > 3) pages.push('...');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  };

  const selectClass =
    'w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-sm text-slate-700 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100';
  const labelClass = 'block text-xs font-semibold text-slate-600 mb-1.5';

  return (
    <div className="flex-1 flex min-h-0 gap-5">

      {/* ────────────────────── Left Sidebar Filters ────────────────────── */}
      <aside className="w-52 flex-shrink-0 rounded-xl border border-slate-200 bg-white shadow-sm p-4 flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 text-sm">
            <Filter className="h-4 w-4 text-slate-500" />
            Filters
          </div>
          <button
            onClick={resetFilters}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Clear all
          </button>
        </div>

        {/* Search */}
        <div>
          <label className={labelClass}>Search</label>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              id="sidebar-search"
              type="text"
              placeholder="Search by name, email..."
              value={pendingSearch}
              onChange={(e) => setPendingSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>

        {/* Department */}
        <div>
          <label className={labelClass}>Department</label>
          <select id="sidebar-dept" value={pendingDept} onChange={(e) => setPendingDept(e.target.value)} className={selectClass}>
            <option value="">All Departments</option>
            {departments.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {/* Job Title */}
        <div>
          <label className={labelClass}>Job Title</label>
          <select id="sidebar-jobtitle" value={pendingJobTitle} onChange={(e) => setPendingJobTitle(e.target.value)} className={selectClass}>
            <option value="">All Job Titles</option>
            {jobTitles.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
          </select>
        </div>

        {/* Country */}
        <div>
          <label className={labelClass}>Country</label>
          <select id="sidebar-country" value={pendingCountry} onChange={(e) => setPendingCountry(e.target.value)} className={selectClass}>
            <option value="">All Countries</option>
            {countries.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className={labelClass}>Status</label>
          <select id="sidebar-status" value={pendingStatus} onChange={(e) => setPendingStatus(e.target.value)} className={selectClass}>
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Inactive Only</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-1">
          <button
            id="apply-filters-btn"
            onClick={applyFilters}
            className="flex items-center justify-center gap-2 w-full rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-200 hover:bg-indigo-700 transition-colors"
          >
            <Filter className="h-3.5 w-3.5" />
            Apply Filters
          </button>
          <button
            id="reset-filters-btn"
            onClick={resetFilters}
            className="flex items-center justify-center gap-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reset Filters
          </button>
        </div>
      </aside>

      {/* ────────────────────── Right Table Column ────────────────────── */}
      <div className="flex-1 min-h-0 flex flex-col gap-3">

        {/* Header Banner */}
        <div className="flex-shrink-0 flex items-center justify-between rounded-xl bg-gradient-to-r from-indigo-900 to-violet-950 py-3 px-5 text-white shadow-sm">
          <h1 className="text-base font-bold tracking-tight">Staff Directory</h1>
          <div className="rounded-lg bg-white/10 backdrop-blur-md px-2.5 py-1 border border-white/10 flex items-center gap-1.5 text-xs">
            <Users className="h-3.5 w-3.5 text-indigo-300" />
            <span className="text-indigo-200 font-semibold">
              Total: <span className="text-white font-bold font-mono">{totalCount.toLocaleString()}</span>
            </span>
          </div>
        </div>

        {/* Table Card */}
        <div className="flex-1 min-h-0 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">

          {/* Sticky Column Headers */}
          <div className="flex-shrink-0 flex border-b border-slate-200 bg-slate-50/80 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-400 select-none">
            <div className="w-[10%]">Emp No</div>
            <div className="w-[16%]">Full Name</div>
            <div className="w-[21%]">Email Address</div>
            <div className="w-[13%]">Department</div>
            <div className="w-[17%]">Job Title</div>
            <div className="w-[9%]">Country</div>
            <div className="w-[9%] text-right">Salary</div>
            <div className="w-[5%] text-center">Status</div>
          </div>

          {/* Scrollable Rows */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center gap-3 py-20 text-sm text-slate-500">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                Loading records...
              </div>
            ) : error ? (
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
            ) : employees.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <Users className="h-12 w-12 text-slate-300 mb-3" />
                <h3 className="text-sm font-bold text-slate-700">No staff matches found</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Try adjusting the filters or click Reset Filters to clear all active criteria.
                </p>
              </div>
            ) : (
              employees.map((employee) => (
                <div
                  key={employee.id}
                  className="flex items-center border-b border-slate-100 px-5 py-3 text-sm text-slate-700 transition-colors hover:bg-slate-50/60 last:border-b-0"
                >
                  {/* Emp No */}
                  <div className="w-[10%] pr-3">
                    <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-xs font-semibold text-slate-600 border border-slate-200">
                      {employee.employeeNo}
                    </span>
                  </div>
                  {/* Full Name */}
                  <div className="w-[16%] font-semibold text-slate-900 pr-3 truncate">{employee.fullName}</div>
                  {/* Email */}
                  <div className="w-[21%] text-slate-500 pr-3 truncate">{employee.email}</div>
                  {/* Department */}
                  <div className="w-[13%] pr-3 truncate">
                    {employee.department ? (
                      <span className="inline-flex rounded-full bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                        {employee.department}
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </div>
                  {/* Job Title */}
                  <div className="w-[17%] text-slate-600 pr-3 truncate">
                    {employee.jobTitle?.title || <span className="text-slate-400">—</span>}
                  </div>
                  {/* Country */}
                  <div className="w-[9%] text-slate-700 font-medium pr-3 truncate">
                    {employee.country?.name || <span className="text-slate-400">—</span>}
                  </div>
                  {/* Salary */}
                  <div className="w-[9%] text-right font-semibold text-emerald-600 pr-3">
                    {formatCurrency(employee.salary, employee.currency)}
                  </div>
                  {/* Status */}
                  <div className="w-[5%] flex justify-center">
                    {employee.status === 'ACTIVE' ? (
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" title="Active" />
                      </span>
                    ) : (
                      <span className="h-2.5 w-2.5 rounded-full bg-slate-300" title="Inactive" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination Footer */}
          {!error && totalCount > 0 && (
            <div className="flex-shrink-0 flex items-center justify-between border-t border-slate-100 bg-white px-5 py-3">
              {/* Row count summary */}
              <p className="text-xs text-slate-500 select-none">
                Showing{' '}
                <span className="font-bold text-slate-800">
                  {employees.length > 0 ? ((page - 1) * PAGE_SIZE + 1) : 0}–{Math.min(page * PAGE_SIZE, totalCount)}
                </span>{' '}
                of{' '}
                <span className="font-bold text-slate-800">{totalCount.toLocaleString()}</span> employees
              </p>

              {/* Page number controls */}
              <div className="flex items-center gap-1">
                {/* Previous */}
                <button
                  id="page-prev"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex h-7 w-7 items-center justify-center rounded border border-slate-200 text-slate-500 transition-colors hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>

                {/* Numbered pages */}
                {getPageNumbers().map((p, i) =>
                  p === '...' ? (
                    <span key={`ell-${i}`} className="flex h-7 w-7 items-center justify-center text-xs text-slate-400 select-none">
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      id={`page-${p}`}
                      onClick={() => setPage(p as number)}
                      className={`flex h-7 w-7 items-center justify-center rounded text-xs font-semibold transition-colors ${
                        page === p
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}

                {/* Next */}
                <button
                  id="page-next"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="flex h-7 w-7 items-center justify-center rounded border border-slate-200 text-slate-500 transition-colors hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
