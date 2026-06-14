export default function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary dark:border-t-primary-dark rounded-full animate-spin" />
        <p className="text-sm text-slate-500 dark:text-slate-400">加载中...</p>
      </div>
    </div>
  );
}
