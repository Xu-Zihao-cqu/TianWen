export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          &copy; {new Date().getFullYear()} 天问 TianWen. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          {/* Step 6: Social icons + Back to top */}
          <span className="text-xs text-slate-400">社交链接 (Step 6)</span>
        </div>
      </div>
    </footer>
  );
}
