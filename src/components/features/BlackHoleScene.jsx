import { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n.js';

const defaults = { tilt: 0.28, intensity: 1.1, speed: 1, paused: false };
export default function BlackHoleScene() {
  const { locale } = useI18n();
  const zh = locale === 'zh';
  const mount = useRef(null);
  const engine = useRef(null);
  const settingsRef = useRef(defaults);
  const [settings, setSettings] = useState(defaults);
  const [quality, setQuality] = useState('auto');
  const [status, setStatus] = useState('loading');
  const [open, setOpen] = useState(false);
  const [reduced, setReduced] = useState(
    () => matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const changed = () => setReduced(media.matches);
    media.addEventListener('change', changed);
    return () => media.removeEventListener('change', changed);
  }, []);
  useEffect(() => {
    if (reduced) {
      setStatus('static');
      return;
    }
    let active = true;
    let instance;
    setStatus('loading');
    import('./createBlackHole.js')
      .then(({ createBlackHole }) => {
        if (!active) return;
        let failed = false;
        instance = createBlackHole(mount.current, {
          quality,
          onError: () => {
            failed = true;
            if (active) setStatus('fallback');
          },
        });
        engine.current = instance;
        instance.update(settingsRef.current);
        if (!failed) setStatus('ready');
      })
      .catch(() => {
        if (active) setStatus('fallback');
      });
    return () => {
      active = false;
      instance?.dispose();
      engine.current = null;
    };
  }, [quality, reduced]);
  useEffect(() => {
    settingsRef.current = settings;
    engine.current?.update(settings);
  }, [settings]);
  const ready = status === 'ready';
  const update = (patch) =>
    setSettings((previous) => ({ ...previous, ...patch }));
  return (
    <>
      <div
        className="singularity-stage"
        aria-hidden="true"
        data-scene-status={status}
      >
        {status !== 'ready' && (
          <div className="singularity-fallback">
            <i />
            <b />
            <span />
          </div>
        )}
        <div
          ref={mount}
          className={`black-hole-canvas ${ready ? 'is-ready' : ''}`}
        />
      </div>
      <div
        className="horizon-controls"
        role="group"
        aria-label={zh ? '黑洞场景控制' : 'Black hole scene controls'}
      >
        <div className="scene-toolbar">
          <span className="scene-status" role="status">
            <i />
            {ready
              ? settings.paused
                ? zh
                  ? '画面已暂停'
                  : 'PAUSED'
                : zh
                  ? '实时黑洞'
                  : 'LIVE SCENE'
              : status === 'loading'
                ? zh
                  ? '场景加载中'
                  : 'LOADING'
                : zh
                  ? '静态星空'
                  : 'STATIC SCENE'}
          </span>
          <button
            type="button"
            disabled={!ready}
            onClick={() => update({ paused: !settings.paused })}
            aria-label={
              settings.paused
                ? zh
                  ? '播放场景'
                  : 'Play scene'
                : zh
                  ? '暂停场景'
                  : 'Pause scene'
            }
          >
            {settings.paused ? <Play size={13} /> : <Pause size={13} />}
          </button>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="scene-settings"
            aria-label={zh ? '场景设置' : 'Scene settings'}
          >
            <SlidersHorizontal size={14} />
          </button>
        </div>
        {open && (
          <div className="scene-settings" id="scene-settings">
            <p>{zh ? '你的观测视角' : 'YOUR OBSERVATION POINT'}</p>
            {reduced ? (
              <p className="scene-note">
                {zh
                  ? '已遵循系统“减少动态效果”设置。'
                  : 'Following your reduced motion preference.'}
              </p>
            ) : status === 'fallback' ? (
              <p className="scene-note">
                {zh
                  ? '当前设备无法启动 3D，已切换静态画面。'
                  : '3D is unavailable on this device. Showing a static scene.'}
              </p>
            ) : null}
            <fieldset disabled={!ready}>
              <label>
                {zh ? '观测角度' : 'Viewing angle'}
                <span>{Math.round((settings.tilt * 180) / Math.PI)}°</span>
                <input
                  type="range"
                  min="0.12"
                  max="0.65"
                  step="0.01"
                  value={settings.tilt}
                  onChange={(e) => update({ tilt: Number(e.target.value) })}
                />
              </label>
              <label>
                {zh ? '光环亮度' : 'Glow'}
                <span>{settings.intensity.toFixed(1)}</span>
                <input
                  type="range"
                  min="0.5"
                  max="1.8"
                  step="0.1"
                  value={settings.intensity}
                  onChange={(e) =>
                    update({ intensity: Number(e.target.value) })
                  }
                />
              </label>
              <label>
                {zh ? '旋转速度' : 'Orbit speed'}
                <span>{settings.speed.toFixed(1)}×</span>
                <input
                  type="range"
                  min="0.2"
                  max="2"
                  step="0.1"
                  value={settings.speed}
                  onChange={(e) => update({ speed: Number(e.target.value) })}
                />
              </label>
            </fieldset>
            <label>
              {zh ? '画面质量' : 'Quality'}
              <select
                value={quality}
                disabled={reduced}
                onChange={(e) => setQuality(e.target.value)}
              >
                <option value="auto">{zh ? '自动' : 'Auto'}</option>
                <option value="eco">{zh ? '节能' : 'Eco'}</option>
                <option value="high">{zh ? '精细' : 'Detailed'}</option>
              </select>
            </label>
            <button
              type="button"
              className="scene-reset"
              disabled={!ready}
              onClick={() => setSettings(defaults)}
            >
              <RotateCcw size={12} />
              {zh ? '重置视角' : 'Reset view'}
            </button>
            <p className="scene-note">
              {zh
                ? '黑洞的艺术化演绎 · 移动鼠标探索'
                : 'An artistic black hole study · Move your pointer to explore'}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
