export default function Footer() {
    return (
        <footer className="border-t border-slate-200 bg-white py-6 mt-12">
            <div className="mx-auto max-w-6xl px-4 text-center text-xs text-slate-450 sm:px-6">
                &copy; {new Date().getFullYear()} HR Management. Built with a clean, minimal design system.
            </div>
        </footer>
    );
}