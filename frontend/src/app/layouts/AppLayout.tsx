import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import DashboardPage from "../../pages/DashboardPage";
import EmployeesPage from "../../pages/EmployeesPage";
import InsightsPage from "../../pages/InsightsPage";
import DesignSystemPage from "../../pages/DesignSystemPage";

export default function AppLayout() {
    const location = useLocation();
    const isEmployeesPage = location.pathname === "/employees";

    return (
        <div className={`min-h-dvh ${isEmployeesPage ? "h-dvh overflow-hidden" : ""} bg-slate-50 text-slate-900 flex flex-col font-sans`}>
            <Header />

            <main className={`flex-1 mx-auto w-full max-w-6xl min-h-0 ${isEmployeesPage ? "px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 lg:pt-4 pb-3 flex flex-col" : "p-4 sm:p-6 lg:p-8"}`}>
                <Routes>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/employees" element={<EmployeesPage />} />
                    <Route path="/insights" element={<InsightsPage />} />
                    {import.meta.env.DEV && (
                        <Route path="/design-system" element={<DesignSystemPage />} />
                    )}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>

            {!isEmployeesPage && <Footer />}
        </div>
    );
}

