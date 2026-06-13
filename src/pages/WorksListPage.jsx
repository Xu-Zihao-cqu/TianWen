import { useParams } from 'react-router-dom';

export default function WorksListPage() {
  const { category } = useParams();

  const categoryNames = {
    hardware: '硬件项目',
    software: '软件项目',
    resources: '资源分享',
    assignments: '在校作业',
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="text-center">
        <h1 className="text-4xl font-heading font-bold gradient-text mb-4">
          {categoryNames[category] || category} 作品列表
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          URL 参数: <code className="font-mono text-primary">/works/{category}</code>
        </p>
      </div>
    </div>
  );
}
