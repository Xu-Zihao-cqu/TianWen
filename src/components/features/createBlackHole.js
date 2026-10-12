import {
  WebGLRenderer,
  Scene,
  OrthographicCamera,
  PlaneGeometry,
  ShaderMaterial,
  Mesh,
  Vector2,
} from 'three';
import { vertexShader, fragmentShader } from './blackHoleShader.js';

// Isolated renderer: no global animation loop, and every GPU resource has an owner.
export function createBlackHole(host, { quality = 'auto', onError }) {
  const compact = matchMedia('(max-width: 767px)').matches;
  const economical =
    quality === 'eco' ||
    (quality === 'auto' &&
      (compact ||
        navigator.connection?.saveData ||
        navigator.hardwareConcurrency <= 4));
  const renderer = new WebGLRenderer({
    alpha: false,
    antialias: false,
    powerPreference: 'low-power',
  });
  renderer.setPixelRatio(
    Math.min(devicePixelRatio || 1, economical ? 0.85 : 1.35),
  );
  renderer.domElement.setAttribute('aria-hidden', 'true');
  renderer.domElement.dataset.blackHoleCanvas = '';
  host.appendChild(renderer.domElement);
  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const geometry = new PlaneGeometry(2, 2);
  const uniforms = {
    uResolution: { value: new Vector2(1, 1) },
    uPointer: { value: new Vector2() },
    uTime: { value: 0 },
    uTilt: { value: 0.28 },
    uIntensity: { value: 1.1 },
  };
  const material = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    depthTest: false,
    depthWrite: false,
  });
  scene.add(new Mesh(geometry, material));
  let frame = 0,
    disposed = false,
    visible = true,
    paused = false,
    failed = false;
  let lastTime = 0,
    lastDraw = 0,
    speed = 1;
  const pointerTarget = new Vector2();
  const frameInterval = 1000 / (economical ? 24 : 40);
  const interactionTarget = host.closest('.event-horizon');
  const render = () => {
    if (disposed || failed) return;
    try {
      renderer.render(scene, camera);
    } catch {
      failed = true;
      stop();
      onError();
    }
  };
  const stop = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
  };
  const tick = (time) => {
    frame = 0;
    if (disposed || failed || paused || !visible || document.hidden) return;
    if (time - lastDraw >= frameInterval) {
      const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.1) : 0;
      uniforms.uTime.value += delta * speed;
      uniforms.uPointer.value.lerp(pointerTarget, 0.065);
      lastTime = time;
      lastDraw = time;
      render();
    }
    if (!failed) frame = requestAnimationFrame(tick);
  };
  const sync = () => {
    stop();
    if (!paused && visible && !document.hidden && !failed && !disposed)
      frame = requestAnimationFrame(tick);
  };
  const resize = () => {
    if (disposed || failed) return;
    const { width, height } = host.getBoundingClientRect();
    // Hard pixel ceiling keeps large monitors from multiplying fragment work.
    const scale = Math.min(
      1,
      1500 / (Math.max(width, 1) * renderer.getPixelRatio()),
    );
    renderer.setSize(
      Math.max(1, width * scale),
      Math.max(1, height * scale),
      false,
    );
    uniforms.uResolution.value.set(Math.max(width, 1), Math.max(height, 1));
    render();
  };
  const observer = new ResizeObserver(resize);
  const intersection = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      sync();
    },
    { threshold: 0 },
  );
  const pointer = (event) => {
    if (event.pointerType !== 'mouse' || paused) return;
    const rect = interactionTarget.getBoundingClientRect();
    pointerTarget.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      ((event.clientY - rect.top) / rect.height) * 2 - 1,
    );
  };
  const leave = () => pointerTarget.set(0, 0);
  const contextLost = (event) => {
    event.preventDefault();
    failed = true;
    stop();
    onError();
  };
  renderer.debug.onShaderError = () => {
    failed = true;
    stop();
    onError();
  };
  renderer.domElement.addEventListener('webglcontextlost', contextLost);
  observer.observe(host);
  intersection.observe(host);
  interactionTarget.addEventListener('pointermove', pointer, { passive: true });
  interactionTarget.addEventListener('pointerleave', leave);
  document.addEventListener('visibilitychange', sync);
  resize();
  sync();
  return {
    update(settings) {
      uniforms.uTilt.value = settings.tilt;
      uniforms.uIntensity.value = settings.intensity;
      speed = settings.speed;
      paused = settings.paused;
      render();
      sync();
    },
    dispose() {
      disposed = true;
      stop();
      observer.disconnect();
      intersection.disconnect();
      interactionTarget.removeEventListener('pointermove', pointer);
      interactionTarget.removeEventListener('pointerleave', leave);
      document.removeEventListener('visibilitychange', sync);
      renderer.domElement.removeEventListener('webglcontextlost', contextLost);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    },
  };
}
