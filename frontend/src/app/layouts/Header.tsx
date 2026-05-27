import { NavLink } from "react-router-dom";

export default function Header() {
    const isDev = import.meta.env.DEV;

    return (
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md">
            <div className="w-full flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                <NavLink 
                    to="/" 
                    className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-slate-900 transition-opacity hover:opacity-90"
                >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 font-extrabold text-white text-base shadow-sm shadow-indigo-100">
                        W
                    </span>
                    <span>Workly</span>
                </NavLink>

                <nav className="hidden md:flex items-center gap-6">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `text-sm font-semibold transition-colors hover:text-slate-900 ${isActive ? "text-slate-900" : "text-slate-500"}`
                        }
                    >
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/employees"
                        className={({ isActive }) =>
                            `text-sm font-semibold transition-colors hover:text-slate-900 ${isActive ? "text-slate-900" : "text-slate-500"}`
                        }
                    >
                        Employees
                    </NavLink>
                    <NavLink
                        to="/insights"
                        className={({ isActive }) =>
                            `text-sm font-semibold transition-colors hover:text-slate-900 ${isActive ? "text-slate-900" : "text-slate-500"}`
                        }
                    >
                        Insights
                    </NavLink>
                    {isDev && (
                        <NavLink
                            to="/design-system"
                            className={({ isActive }) =>
                                `text-sm font-semibold transition-colors hover:text-slate-900 ${isActive ? "text-slate-900" : "text-slate-500"}`
                            }
                        >
                            Design System
                        </NavLink>
                    )}
                </nav>

                <div className="flex items-center gap-3 md:hidden">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `text-xs font-semibold px-2.5 py-1.5 rounded transition-colors ${isActive ? "bg-slate-100 text-slate-900" : "text-slate-500"}`
                        }
                    >
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/employees"
                        className={({ isActive }) =>
                            `text-xs font-semibold px-2.5 py-1.5 rounded transition-colors ${isActive ? "bg-slate-100 text-slate-900" : "text-slate-500"}`
                        }
                    >
                        Employees
                    </NavLink>
                    <NavLink
                        to="/insights"
                        className={({ isActive }) =>
                            `text-xs font-semibold px-2.5 py-1.5 rounded transition-colors ${isActive ? "bg-slate-100 text-slate-900" : "text-slate-500"}`
                        }
                    >
                        Insights
                    </NavLink>
                    {isDev && (
                        <NavLink
                            to="/design-system"
                            className={({ isActive }) =>
                                `text-xs font-semibold px-2.5 py-1.5 rounded transition-colors ${isActive ? "bg-slate-100 text-slate-900" : "text-slate-500"}`
                            }
                        >
                            Design System
                        </NavLink>
                    )}
                </div>
            </div>
        </header>
    );
}
