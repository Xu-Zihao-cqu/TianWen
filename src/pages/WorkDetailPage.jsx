import { useParams } from 'react-router-dom';

export default function WorkDetailPage() {
  const { category, workId } = useParams();

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="text-center">
        <h1 className="text-4xl font-heading font-bold gradient-text mb-4">
          作品详情
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          category: <code className="font-mono text-primary">{category}</code>
          {' | '}
          workId: <code className="font-mono text-primary">{workId}</code>
        </p>
      </div>
    </div>
  );
}
