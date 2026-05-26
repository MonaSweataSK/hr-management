import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import DesignSystemPage from "./pages/DesignSystemPage";
import DashboardPage from "./pages/DashboardPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-dvh bg-slate-50 text-slate-900 flex flex-col font-sans">
        {/* Sticky Header Navigation */}
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-6">
              <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                <span className="h-6 w-6 rounded bg-slate-900 flex items-center justify-center text-white text-xs font-black">HR</span>
                HR Management
              </span>
              <nav className="hidden md:flex items-center gap-4">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `text-sm font-semibold transition-colors hover:text-slate-900 ${isActive ? "text-slate-900" : "text-slate-500"
                    }`
                  }
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/design-system"
                  className={({ isActive }) =>
                    `text-sm font-semibold transition-colors hover:text-slate-900 ${isActive ? "text-slate-900" : "text-slate-500"
                    }`
                  }
                >
                  Design System
                </NavLink>
              </nav>
            </div>

            {/* Mobile / Small Screen Navigation Links */}
            <div className="flex items-center gap-3 md:hidden">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-xs font-semibold px-2.5 py-1.5 rounded transition-colors ${isActive ? "bg-slate-100 text-slate-900" : "text-slate-500"
                  }`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/design-system"
                className={({ isActive }) =>
                  `text-xs font-semibold px-2.5 py-1.5 rounded transition-colors ${isActive ? "bg-slate-100 text-slate-900" : "text-slate-500"
                  }`
                }
              >
                Design System
              </NavLink>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/design-system" element={<DesignSystemPage />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white py-6 mt-12">
          <div className="mx-auto max-w-6xl px-4 text-center text-xs text-slate-450 sm:px-6">
            &copy; {new Date().getFullYear()} HR Management. Built with a clean, minimal design system.
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
