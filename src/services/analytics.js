/**
 * 访问统计分析
 * - Google Analytics 4 (react-ga4)
 * - 百度统计 (动态注入 script)
 * 仅生产环境加载，受环境变量控制
 */
import { GA_ID, BAIDU_ID } from '../utils/constants.js';

function initGA() {
  if (!GA_ID || !import.meta.env.PROD) return;
  import('react-ga4').then((ReactGA) => {
    ReactGA.default.initialize(GA_ID);
  });
}

function initBaidu() {
  if (!BAIDU_ID || !import.meta.env.PROD) return;
  const script = document.createElement('script');
  script.src = `https://hm.baidu.com/hm.js?${BAIDU_ID}`;
  script.async = true;
  document.head.appendChild(script);
}

initGA();
initBaidu();
