import * as React from "react";
import { User, Shield, Activity, Mail, Lock, Settings, MapPin } from "lucide-react";
import {
  Button,
  Input,
  Dropdown,
  Loader,
  ToastProvider,
  Tooltip,
  useToast,
} from "../design-system";

function ToastDemoDashboard() {
  const { toast } = useToast();

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="secondary"
        onClick={() =>
          toast({
            title: "Top Right Success",
            description: "This toast is positioned at top-right.",
            variant: "success",
            position: "top-right",
          })
        }
      >
        Toast Top Right
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast({
            title: "Top Center Alert",
            description: "This toast is positioned at top-center.",
            variant: "default",
            position: "top-center",
          })
        }
      >
        Toast Top Center
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast({
            title: "Top Left Error",
            description: "This toast is positioned at top-left.",
            variant: "error",
            position: "top-left",
          })
        }
      >
        Toast Top Left
      </Button>
    </div>
  );
}

export default function DesignSystemPage() {
  const [selectedRole, setSelectedRole] = React.useState<string>("");
  const [selectedUser, setSelectedUser] = React.useState<string>("");
  const [selectedLocation, setSelectedLocation] = React.useState<string>("");

  const roleOptions = [
    { value: "hr", label: "HR Generalist" },
    { value: "manager", label: "Product Manager" },
    { value: "developer", label: "Software Engineer" },
    { value: "designer", label: "UX Designer" },
  ];

  const userOptions = [
    { value: "alex", label: "Alex Rivera", leftIcon: <User className="h-3.5 w-3.5" />, rightIcon: <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">Owner</span> },
    { value: "jordan", label: "Jordan Lee", leftIcon: <Shield className="h-3.5 w-3.5 text-indigo-500" />, rightIcon: <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded">Admin</span> },
    { value: "taylor", label: "Taylor Smith", leftIcon: <Activity className="h-3.5 w-3.5 text-emerald-500" />, rightIcon: <span className="text-[10px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded">User</span> },
  ];

  const locationOptions = [
    { value: "ny", label: "New York", leftIcon: <MapPin className="h-3.5 w-3.5 text-red-500" /> },
    { value: "sf", label: "San Francisco", leftIcon: <MapPin className="h-3.5 w-3.5 text-blue-500" /> },
    { value: "lon", label: "London", leftIcon: <MapPin className="h-3.5 w-3.5 text-amber-500" /> },
    { value: "tok", label: "Tokyo", leftIcon: <MapPin className="h-3.5 w-3.5 text-purple-500" /> },
    { value: "ber", label: "Berlin", leftIcon: <MapPin className="h-3.5 w-3.5 text-slate-500" /> },
  ];

  return (
    <ToastProvider>
      <div className="space-y-10 pb-16">
        {/* Intro */}
        <header className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Design System Guide</h1>
          <p className="text-sm text-slate-500 max-w-2xl">
            A comprehensive, clean showroom demonstrating the variations of our simplified components: Button variants, Input variations, Dropdown variations, Toast positions, and Tooltip placements.
          </p>
        </header>

        {/* Section 1: Buttons */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">1. Button Component Variations</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-800">Variant Types</h3>
              <div className="flex flex-wrap gap-2">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="danger">Danger</Button>
              </div>
              <p className="text-[11px] text-slate-400">Three core variants for different action intentions.</p>
            </div>

            <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-800">With Icons</h3>
              <div className="flex flex-wrap gap-2">
                <Button variant="primary" leftIcon={<User className="h-4 w-4" />}>Profile</Button>
                <Button variant="secondary" rightIcon={<Mail className="h-4 w-4" />}>Invite</Button>
                <Button variant="danger" leftIcon={<Shield className="h-4 w-4" />} rightIcon={<Activity className="h-4 w-4" />}>Revoke</Button>
              </div>
              <p className="text-[11px] text-slate-400">Supports leftIcon, rightIcon, or both simultaneously.</p>
            </div>

            <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-800">Sizes</h3>
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
              <p className="text-[11px] text-slate-400">Available in sm, md, and lg sizing.</p>
            </div>
          </div>
        </section>

        {/* Section 2: Inputs */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">2. Input Component Variations</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-800">Standard Text Input</h3>
              <Input type="text" placeholder="Enter full name..." />
              <p className="text-[11px] text-slate-400">Default variation for plain text fields.</p>
            </div>

            <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-800">Password Input</h3>
              <div className="relative">
                <Input type="password" placeholder="••••••••" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock className="h-4 w-4" />
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Hides characters securely.</p>
            </div>

            <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-800">Text Area Input</h3>
              <Input type="textarea" placeholder="Describe biography details..." rows={3} />
              <p className="text-[11px] text-slate-400">For multi-line descriptions and notes.</p>
            </div>
          </div>
        </section>

        {/* Section 3: Dropdowns */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">3. Dropdown Component Variations</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-800">Standard Dropdown</h3>
              <Dropdown
                options={roleOptions}
                value={selectedRole}
                onChange={setSelectedRole}
                placeholder="Choose role"
              />
              <p className="text-[11px] text-slate-400">A clean, standard selection menu.</p>
            </div>

            <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-800">Searchable Dropdown</h3>
              <Dropdown
                options={locationOptions}
                value={selectedLocation}
                onChange={setSelectedLocation}
                placeholder="Select city"
                searchable={true}
                searchPlaceholder="Search locations..."
              />
              <p className="text-[11px] text-slate-400">Includes inline search input filtering.</p>
            </div>

            <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-800">Icon Options & Custom Search Icons</h3>
              <Dropdown
                options={userOptions}
                value={selectedUser}
                onChange={setSelectedUser}
                placeholder="Select member"
                searchable={true}
                leftIcon={<Settings className="h-4 w-4" />}
                searchLeftIcon={<Mail className="h-3.5 w-3.5 text-indigo-500" />}
              />
              <p className="text-[11px] text-slate-400">Supports custom trigger icons, option badges/icons, and search bar prefix icons.</p>
            </div>
          </div>
        </section>

        {/* Section 4: Tooltips */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">4. Tooltip Placement Variations</h2>
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500 mb-6">Hover over the labels below to view tooltips anchored in each of the six requested placement variations.</p>
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6 text-center">
              <div className="p-3 border border-slate-100 rounded-lg bg-slate-50 flex items-center justify-center">
                <Tooltip variation="above-center" content="An anchored tooltip above center">
                  <span className="cursor-help text-xs font-semibold text-slate-700 underline decoration-slate-300 decoration-dashed">Above Center</span>
                </Tooltip>
              </div>

              <div className="p-3 border border-slate-100 rounded-lg bg-slate-50 flex items-center justify-center">
                <Tooltip variation="below-center" content="An anchored tooltip below center">
                  <span className="cursor-help text-xs font-semibold text-slate-700 underline decoration-slate-300 decoration-dashed">Below Center</span>
                </Tooltip>
              </div>

              <div className="p-3 border border-slate-100 rounded-lg bg-slate-50 flex items-center justify-center">
                <Tooltip variation="top-right" content="Anchored top right of target">
                  <span className="cursor-help text-xs font-semibold text-slate-700 underline decoration-slate-300 decoration-dashed">Top Right</span>
                </Tooltip>
              </div>

              <div className="p-3 border border-slate-100 rounded-lg bg-slate-50 flex items-center justify-center">
                <Tooltip variation="bottom-right" content="Anchored bottom right of target">
                  <span className="cursor-help text-xs font-semibold text-slate-700 underline decoration-slate-300 decoration-dashed">Bottom Right</span>
                </Tooltip>
              </div>

              <div className="p-3 border border-slate-100 rounded-lg bg-slate-50 flex items-center justify-center">
                <Tooltip variation="top-left" content="Anchored top left of target">
                  <span className="cursor-help text-xs font-semibold text-slate-700 underline decoration-slate-300 decoration-dashed">Top Left</span>
                </Tooltip>
              </div>

              <div className="p-3 border border-slate-100 rounded-lg bg-slate-50 flex items-center justify-center">
                <Tooltip variation="bottom-left" content="Anchored bottom left of target">
                  <span className="cursor-help text-xs font-semibold text-slate-700 underline decoration-slate-300 decoration-dashed">Bottom Left</span>
                </Tooltip>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Toasts */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">5. Toast Position Variations</h2>
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <p className="text-sm text-slate-500">Click the triggers below to fire toast alerts at different screen alignment points.</p>
            <ToastDemoDashboard />
          </div>
        </section>

        {/* Section 6: Loader */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">6. Loader Indicator</h2>
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Loader size="sm" />
              <span className="text-xs text-slate-500 font-medium">Small (sm)</span>
            </div>
            <div className="flex items-center gap-2">
              <Loader size="md" />
              <span className="text-xs text-slate-500 font-medium">Medium (md)</span>
            </div>
            <div className="flex items-center gap-2">
              <Loader size="lg" />
              <span className="text-xs text-slate-500 font-medium">Large (lg)</span>
            </div>
          </div>
        </section>
      </div>
    </ToastProvider>
  );
}
