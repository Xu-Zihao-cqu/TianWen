import { hardwareWorks } from './hardware.js';
import { softwareWorks } from './software.js';
import { resourcesWorks } from './resources.js';
import { assignmentsWorks } from './assignments.js';
import { MAX_FEATURED } from '../../utils/constants.js';

/**
 * 所有作品合并列表
 */
export const allWorks = [
  ...hardwareWorks,
  ...softwareWorks,
  ...resourcesWorks,
  ...assignmentsWorks,
];

/**
 * 获取全部作品（按 createdAt 倒序）
 * @returns {Array}
 */
export function getAllWorks() {
  return [...allWorks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

/**
 * 按板块 ID 获取作品
 * @param {string} categoryId
 * @returns {Array}
 */
export function getWorksByCategory(categoryId) {
  return allWorks.filter((w) => w.category === categoryId);
}

/**
 * 按作品 ID 获取单个作品
 * @param {string} id
 * @returns {Object|undefined}
 */
export function getWorkById(id) {
  return allWorks.find((w) => w.id === id);
}

/**
 * 获取精选作品（最多 MAX_FEATURED 个）
 * @returns {Array}
 */
export function getFeaturedWorks() {
  return allWorks
    .filter((w) => w.featured)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, MAX_FEATURED);
}

/**
 * 获取所有标签
 * @param {string} [categoryId] — 可选，按板块过滤
 * @returns {string[]} 去重排序的标签列表
 */
export function getAllTags(categoryId) {
  const works = categoryId ? getWorksByCategory(categoryId) : allWorks;
  const tagSet = new Set(works.flatMap((w) => w.tags));
  return [...tagSet].sort();
}
