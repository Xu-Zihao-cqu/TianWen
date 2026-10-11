import { useEffect, useState } from 'react';
import { getAllWorks } from '../data/works/index.js';
import { listUploadedWorks } from '../services/works.js';
const localWorks = getAllWorks();
export function useWorks() {
  const [works, setWorks] = useState(localWorks);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    listUploadedWorks()
      .then((rows) => {
        if (active)
          setWorks([
            ...rows.filter((row) => !localWorks.some((w) => w.id === row.id)),
            ...localWorks,
          ]);
      })
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [attempt]);
  return { works, loading, error, retry: () => setAttempt((n) => n + 1) };
}
