import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import DashboardPage from "../../pages/DashboardPage";
import DesignSystemPage from "../../pages/DesignSystemPage";

export default function AppLayout() {
    return (
        <div className="min-h-dvh bg-slate-50 text-slate-900 flex flex-col font-sans">
            <Header />

            <main className="flex-1 mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-8">
                <Routes>
                    <Route path="/" element={<DashboardPage />} />
                    {import.meta.env.DEV && (
                        <Route path="/design-system" element={<DesignSystemPage />} />
                    )}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>

            <Footer />
        </div>
    );
}

