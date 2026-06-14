import { useMemo } from 'react';

/**
 * 标签筛选 Hook
 * @param {Array} works - 全部作品
 * @param {string[]} selectedTags - 选中的标签
 * @returns {{ filteredWorks: Array, availableTags: string[] }}
 */
export function useTagFilter(works, selectedTags = []) {
  return useMemo(() => {
    if (!selectedTags.length) {
      const availableTags = [...new Set(works.flatMap((w) => w.tags || []))].sort();
      return { filteredWorks: works, availableTags };
    }

    // OR 逻辑：包含任一选中标签即保留
    const filteredWorks = works.filter((w) =>
      w.tags?.some((tag) => selectedTags.includes(tag)),
    );

    // 可用标签从过滤结果中提取
    const availableTags = [...new Set(filteredWorks.flatMap((w) => w.tags || []))].sort();

    return { filteredWorks, availableTags };
  }, [works, selectedTags]);
}
