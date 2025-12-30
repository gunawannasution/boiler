export default function Footer() {
    return (
        <footer className="mt-auto border-t border-slate-200 bg-white py-8 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col items-center justify-between gap-4 px-8 md:flex-row">
                <p className="text-sm font-medium text-slate-500">
                    &copy; 2025 <span className="font-bold text-slate-900 dark:text-white">ProDash.</span> All rights reserved.
                </p>
                <div className="flex gap-6 text-sm font-semibold text-slate-400">
                    {/* <Link href="#" className="hover:text-indigo-600">Privacy</Link> */}
                    {/* <Link href="#" className="hover:text-indigo-600">Terms</Link> */}
                    {/* <Link href="#" className="hover:text-indigo-600">Contact</Link> */}
                </div>
            </div>
        </footer>
    );
}
