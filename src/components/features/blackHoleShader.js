// Original stylized ray-bending study. Artistic visualization, not a GR solver.
export const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`;

export const fragmentShader = `
precision highp float;
varying vec2 vUv;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uTime;
uniform float uTilt;
uniform float uIntensity;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1,0)), f.x), mix(hash(i + vec2(0,1)), hash(i + 1.0), f.x), f.y);
}
vec3 disk(vec3 p) {
  float r = length(p.xz);
  float a = atan(p.z, p.x);
  float spin = uTime * .23 / pow(max(r,1.0), 1.5);
  vec2 flow = vec2(cos(a - spin), sin(a - spin)) * 5.0 + r * vec2(1.7, 4.0);
  float turbulence = noise(flow) * .6 + noise(flow * 2.3) * .25 + noise(flow * 5.1) * .15;
  float bands = .72 + .28 * sin(r * 85.0 + turbulence * 15.0);
  float radial = smoothstep(1.48, 1.8, r) * (1.0 - smoothstep(2.0, 4.3, r));
  float doppler = .6 + .8 * smoothstep(-3.0, 3.0, p.x);
  vec3 hot = mix(vec3(1.0,.24,.055), vec3(1.0,.79,.44), smoothstep(.1, .95, turbulence));
  hot = mix(hot, vec3(1.0,.93,.79), pow(1.5 / max(r,1.5), 4.0) * .7);
  return hot * radial * (.5 + turbulence) * bands * doppler * uIntensity;
}
void main() {
  vec2 uv = (vUv - .5) * vec2(uResolution.x / uResolution.y, 1.0);
  float roll = -.18 + uPointer.x * .035;
  uv = mat2(cos(roll), -sin(roll), sin(roll), cos(roll)) * uv;
  float elevation = uTilt + uPointer.y * .06;
  vec3 origin = vec3(0.0, sin(elevation), cos(elevation)) * 8.0;
  vec3 forward = normalize(-origin);
  vec3 right = normalize(cross(forward, vec3(0,1,0)));
  vec3 up = cross(right, forward);
  vec3 ray = normalize(forward * 1.25 + right * uv.x * 2.0 + up * uv.y * 2.0);
  vec3 p = origin;
  vec3 light = vec3(0);
  float transmission = 1.0;
  float nearest = 20.0;
  bool captured = false;
  for (int i=0; i<110; i++) {
    float r = length(p);
    nearest = min(nearest, r);
    if (r < .84) { captured = true; break; }
    if (r > 13.0) break;
    float stepSize = clamp(r * .085, .06, .38);
    vec3 previous = p;
    ray = normalize(ray - p * (1.35 * stepSize / (r*r*r)));
    p += ray * stepSize;
    if (previous.y * p.y < 0.0) {
      float t = previous.y / (previous.y - p.y);
      vec3 hit = mix(previous, p, t);
      float radius = length(hit.xz);
      if (radius > 1.48 && radius < 4.3) {
        light += disk(hit) * transmission;
        transmission *= .38;
      }
    }
    // A thin emissive atmosphere gives the accretion disk a soft, volumetric edge.
    float plane = exp(-abs(p.y) * 24.0);
    float ring = exp(-pow((length(p.xz)-2.25)/.85, 2.0));
    light += vec3(.8,.30,.075) * plane * ring * stepSize * .22 * transmission * uIntensity;
  }
  float halo = exp(-abs(nearest - 1.04) * 14.0);
  if (!captured) light += vec3(1.0,.65,.30) * halo * .3 * uIntensity;
  vec3 background = vec3(.03137,.03922,.06275);
  vec2 stars = uv * 220.0 + uPointer * .4;
  vec2 cell = floor(stars);
  float point = pow(max(0.0, 1.0 - length(fract(stars)-.5)*2.0), 12.0);
  float star = step(.993, hash(cell)) * point;
  background += vec3(.7,.76,.86) * star * (captured ? 0.0 : transmission);
  background += vec3(.065,.030,.012) * exp(-dot(uv,uv)*3.0);
  if (captured) background = vec3(.004,.005,.009);
  vec3 color = background + (1.0 - exp(-light * 1.5));
  gl_FragColor = vec4(color, 1.0);
}`;
