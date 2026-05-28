import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, User, Mail, Phone, Building2, Briefcase,
  Globe, DollarSign, Calendar, Hash, AlertCircle, Loader2,
} from 'lucide-react';
import { getEmployee } from '../features/employees/api/getEmployees';
import type { Employee } from '../features/employees/types/employee.types';

export default function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;
    setIsLoading(true);
    setError(null);
    getEmployee(Number(id))
      .then((data) => { if (isMounted) { setEmployee(data); setIsLoading(false); } })
      .catch(() => { if (isMounted) { setError('Employee not found or server error.'); setIsLoading(false); } });
    return () => { isMounted = false; };
  }, [id]);

  const formatCurrency = (val: number, currencyCode = 'USD') =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode, maximumFractionDigits: 0 }).format(Number(val));

  const formatDate = (iso: string | null) =>
    iso ? new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4 text-slate-500">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <span className="text-sm font-medium">Loading employee record…</span>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────────
  if (error || !employee) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
        <AlertCircle className="h-10 w-10 text-red-500" />
        <p className="text-sm font-bold text-slate-800">{error ?? 'Unknown error'}</p>
        <button
          onClick={() => navigate('/employees')}
          className="mt-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors"
        >
          Back to Directory
        </button>
      </div>
    );
  }

  // ── Detail View ───────────────────────────────────────────────────────────────
  const isActive = employee.status === 'ACTIVE';

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Back button */}
      <button
        onClick={() => navigate('/employees')}
        className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Staff Directory
      </button>

      {/* Profile Hero Card */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-900 to-violet-950 px-8 py-7 text-white shadow-lg flex flex-col sm:flex-row sm:items-center gap-5">
        {/* Avatar */}
        <div className="h-20 w-20 flex-shrink-0 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-3xl font-bold text-white shadow-inner select-none">
          {employee.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
        </div>

        {/* Name + meta */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight truncate">{employee.fullName}</h1>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-semibold ${
                isActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-500/20 text-slate-300 border border-slate-500/30'
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-emerald-400' : 'bg-slate-400'}`} />
              {isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          <p className="mt-1 text-sm text-indigo-200 truncate">{employee.jobTitle?.title ?? '—'}</p>
          <p className="text-xs text-indigo-300 mt-0.5">{employee.department ?? '—'} · {employee.country?.name ?? '—'}</p>
        </div>

        {/* Emp No badge */}
        <div className="text-right flex-shrink-0">
          <div className="rounded-xl bg-white/10 border border-white/15 px-4 py-2.5 text-center">
            <div className="text-[10px] text-indigo-300 font-semibold uppercase tracking-widest">Employee No</div>
            <div className="font-mono text-lg font-bold mt-0.5">{employee.employeeNo}</div>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Contact */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Contact Information</h2>

          <InfoRow icon={<Mail className="h-4 w-4 text-indigo-500" />} label="Email" value={employee.email} />
          <InfoRow icon={<Phone className="h-4 w-4 text-indigo-500" />} label="Phone" value={employee.phone ?? '—'} />
          <InfoRow icon={<Globe className="h-4 w-4 text-indigo-500" />} label="Country" value={employee.country?.name ?? '—'} />
        </div>

        {/* Role */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Role & Department</h2>
          <InfoRow icon={<Briefcase className="h-4 w-4 text-violet-500" />} label="Job Title" value={employee.jobTitle?.title ?? '—'} />
          <InfoRow icon={<Building2 className="h-4 w-4 text-violet-500" />} label="Department" value={employee.department ?? '—'} />
          <InfoRow icon={<User className="h-4 w-4 text-violet-500" />} label="Status" value={isActive ? 'Active' : 'Inactive'} />
        </div>

        {/* Compensation */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Compensation</h2>
          <InfoRow
            icon={<DollarSign className="h-4 w-4 text-emerald-500" />}
            label="Salary"
            value={formatCurrency(employee.salary, employee.currency)}
            valueClass="text-emerald-600 font-bold"
          />
          <InfoRow icon={<Hash className="h-4 w-4 text-emerald-500" />} label="Currency" value={employee.currency} />
        </div>

        {/* Dates */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Timeline</h2>
          <InfoRow icon={<Calendar className="h-4 w-4 text-amber-500" />} label="Record Created" value={formatDate(employee.createdAt)} />
          <InfoRow icon={<Calendar className="h-4 w-4 text-amber-500" />} label="Last Updated" value={formatDate(employee.updatedAt)} />
        </div>
      </div>
    </div>
  );
}

// ── Small helper component ────────────────────────────────────────────────────
function InfoRow({
  icon, label, value, valueClass = '',
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex-shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
        <p className={`text-sm font-medium text-slate-800 truncate mt-0.5 ${valueClass}`}>{value}</p>
      </div>
    </div>
  );
}
