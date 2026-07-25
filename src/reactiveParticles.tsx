import { useCallback, useEffect, useRef, useState } from "react";
import type { MutableRefObject } from "react";
import * as THREE from "three";
import { readVisualizerLevels, retainVisualizerAudio } from "./visualizerAudio";
import { getManualRotation } from "./visualizerControl";

export const PARTICLE_RESOLUTION_KEY = "nowPlaying.particleResolution";
export const PARTICLE_RESOLUTION_EVENT = "npParticleResolutionChanged";

// Chosen supersampling multiplier for the 3D particle effects (relative to CSS
// pixels). Higher = sharper but heavier. Default 2.
export function particlePixelRatio(): number {
  const dpr = typeof window !== "undefined" ? (window.devicePixelRatio || 1) : 1;
  try {
    const value = window.localStorage.getItem(PARTICLE_RESOLUTION_KEY);
    if (value === "native") return dpr;
    const numeric = Number(value);
    if (Number.isFinite(numeric) && numeric > 0) return numeric;
  } catch {
    // Storage can be unavailable in restricted contexts.
  }
  return 2;
}

let webglSupport: boolean | null = null;

function supportsWebgl(): boolean {
  if (webglSupport !== null) return webglSupport;
  try {
    const probe = document.createElement("canvas");
    webglSupport = Boolean(probe.getContext("webgl2") || probe.getContext("webgl"));
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}

type ParticleMode = "field" | "tunnel" | "sphere" | "wave" | "ring" | "knot" | "cone";
type Rgb = { red: number; green: number; blue: number };

const vertexShader = `
varying float vDistance;
uniform float time;
uniform float offsetSize;
uniform float size;
uniform float offsetGain;
uniform float amplitude;
uniform float frequency;
uniform float maxDistance;

vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}

float noise(vec2 v){
  const vec4 C=vec4(.211324865405187,.366025403784439,-.577350269189626,.024390243902439);
  vec2 i=floor(v+dot(v,C.yy));
  vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
  vec4 x12=x0.xyxy+C.xxzz;
  x12.xy-=i1;
  i=mod289(i);
  vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
  vec3 m=max(.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
  m=m*m;
  m=m*m;
  vec3 x=2.0*fract(p*C.www)-1.0;
  vec3 h=abs(x)-.5;
  vec3 ox=floor(x+.5);
  vec3 a0=x-ox;
  m*=1.79284291400159-.85373472095314*(a0*a0+h*h);
  vec3 g;
  g.x=a0.x*x0.x+h.x*x0.y;
  g.yz=a0.yz*x12.xz+h.yz*x12.yw;
  return 130.0*dot(m,g);
}

vec3 curl(float x,float y,float z){
  float eps=1.0;
  float eps2=2.0*eps;
  float n1,n2,a,b;
  x+=time*.05;
  y+=time*.05;
  z+=time*.05;
  vec3 result=vec3(0.0);
  n1=noise(vec2(x,y+eps)); n2=noise(vec2(x,y-eps)); a=(n1-n2)/eps2;
  n1=noise(vec2(x,z+eps)); n2=noise(vec2(x,z-eps)); b=(n1-n2)/eps2;
  result.x=a-b;
  n1=noise(vec2(y,z+eps)); n2=noise(vec2(y,z-eps)); a=(n1-n2)/eps2;
  n1=noise(vec2(x+eps,z)); n2=noise(vec2(x-eps,z)); b=(n1-n2)/eps2;
  result.y=a-b;
  n1=noise(vec2(x+eps,y)); n2=noise(vec2(x-eps,y)); a=(n1-n2)/eps2;
  n1=noise(vec2(y+eps,z)); n2=noise(vec2(y-eps,z)); b=(n1-n2)/eps2;
  result.z=a-b;
  return result;
}

void main(){
  vec3 target=position+(normal*.1)+curl(position.x*frequency,position.y*frequency,position.z*frequency)*amplitude;
  float d=length(position-target)/maxDistance;
  vec3 newPosition=mix(position,target,pow(clamp(d,0.0,1.0),4.0));
  newPosition.z+=sin(time+position.x)*(.12*offsetGain);
  vec4 mvPosition=modelViewMatrix*vec4(newPosition,1.0);
  gl_PointSize=max(1.0,size+(pow(d,3.0)*offsetSize)*(1.0/max(.32,-mvPosition.z)));
  gl_Position=projectionMatrix*mvPosition;
  vDistance=clamp(d,0.0,1.0);
}`;

const fragmentShader = `
varying float vDistance;
uniform vec3 startColor;
uniform vec3 endColor;
uniform float opacity;

void main(){
  vec2 centered=gl_PointCoord-vec2(.5);
  float circle=1.0-smoothstep(.42,.5,length(centered));
  vec3 color=mix(startColor,endColor,clamp(vDistance*1.25,0.0,1.0));
  float alpha=circle*(.28+vDistance*.72)*opacity;
  if(alpha<.01) discard;
  gl_FragColor=vec4(color,alpha);
}`;

function fallbackPalette(accent: string): Rgb[] {
  const parsed = Number.parseInt(accent.replace("#", "").padEnd(6, "0").slice(0, 6), 16) || 0x66c0f4;
  const base = { red: (parsed >> 16) & 255, green: (parsed >> 8) & 255, blue: parsed & 255 };
  const lift = (value: number, amount: number) => Math.round(value + (255 - value) * amount);
  return [base, { red: lift(base.red, .56), green: lift(base.green, .56), blue: lift(base.blue, .56) }];
}

function extractPalette(url: string, fallback: Rgb[]): Promise<Rgb[]> {
  if (!url.trim()) return Promise.resolve(fallback);
  return new Promise((resolve) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 36;
        canvas.height = 36;
        const context = canvas.getContext("2d", { willReadFrequently: true });
        if (!context) return resolve(fallback);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
        const candidates: { color: Rgb; score: number }[] = [];
        for (let index = 0; index < pixels.length; index += 20) {
          if (pixels[index + 3] < 180) continue;
          const red = pixels[index];
          const green = pixels[index + 1];
          const blue = pixels[index + 2];
          const max = Math.max(red, green, blue);
          const min = Math.min(red, green, blue);
          const saturation = max - min;
          const luminance = red * .2126 + green * .7152 + blue * .0722;
          if (luminance < 22 || luminance > 240) continue;
          candidates.push({ color: { red, green, blue }, score: saturation * 1.7 + luminance * .16 });
        }
        candidates.sort((left, right) => right.score - left.score);
        const selected: Rgb[] = [];
        for (const candidate of candidates) {
          if (selected.every((color) => Math.hypot(color.red - candidate.color.red, color.green - candidate.color.green, color.blue - candidate.color.blue) > 72)) {
            selected.push(candidate.color);
          }
          if (selected.length === 2) break;
        }
        resolve(selected.length === 2 ? selected : fallback);
      } catch {
        resolve(fallback);
      }
    };
    image.onerror = () => resolve(fallback);
    image.src = url;
  });
}

function toThreeColor(color: Rgb) {
  return new THREE.Color(color.red / 255, color.green / 255, color.blue / 255);
}

type SharedVisualRefs = {
  paletteRef: MutableRefObject<Rgb[]>;
  playingRef: MutableRefObject<boolean>;
  localAudioRef: MutableRefObject<boolean>;
};

function measureHost(canvas: HTMLCanvasElement) {
  const root = canvas.closest<HTMLElement>(".npFullscreenRoot");
  const rect = root?.getBoundingClientRect() || canvas.getBoundingClientRect();
  return {
    width: Math.max(1, Math.round(rect.width || window.innerWidth || 1920)),
    height: Math.max(1, Math.round(rect.height || window.innerHeight || 1080)),
    root,
  };
}

export function ReactiveParticlesLayer(props: {
  mode: ParticleMode;
  coverUrl?: string;
  accent: string;
  isPlaying: boolean;
  useLocalAudio: boolean;
}) {
  const { mode, coverUrl, accent, isPlaying, useLocalAudio } = props;
  const paletteRef = useRef<Rgb[]>(fallbackPalette(accent));
  const playingRef = useRef(isPlaying);
  const localAudioRef = useRef(useLocalAudio);
  playingRef.current = isPlaying;
  localAudioRef.current = useLocalAudio;
  const [webglFailed, setWebglFailed] = useState(() => !supportsWebgl());
  const failWebgl = useCallback(() => setWebglFailed(true), []);

  useEffect(() => retainVisualizerAudio(useLocalAudio), [useLocalAudio]);

  useEffect(() => {
    let cancelled = false;
    const fallback = fallbackPalette(accent);
    void extractPalette(String(coverUrl || ""), fallback).then((palette) => {
      if (!cancelled) paletteRef.current = palette;
    });
    return () => { cancelled = true; };
  }, [accent, coverUrl]);

  const shared: SharedVisualRefs = { paletteRef, playingRef, localAudioRef };
  return (
    <div className="npFullscreenEffectLayer npReactiveParticlesLayer" aria-hidden="true">
      {webglFailed
        ? <FallbackParticlesCanvas mode={mode} shared={shared} />
        : <ThreeParticlesCanvas mode={mode} shared={shared} onFailure={failWebgl} />}
    </div>
  );
}

function ThreeParticlesCanvas({ mode, shared, onFailure }: { mode: ParticleMode; shared: SharedVisualRefs; onFailure: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: false, antialias: false, powerPreference: "high-performance" });
    } catch {
      // Some Steam CEF surfaces refuse WebGL contexts; use the Canvas 2D path.
      onFailure();
      return;
    }
    let failed = false;
    let frame = 0;
    const failToFallback = () => {
      if (failed) return;
      failed = true;
      window.cancelAnimationFrame(frame);
      onFailure();
    };
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      failToFallback();
    };
    canvas.addEventListener("webglcontextlost", handleContextLost);
    renderer.setClearColor(0x000000, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(mode === "tunnel" ? 72 : 56, 1, .1, 80);
    if (mode === "wave") {
      camera.position.set(0, 2.35, 6.6);
      camera.lookAt(0, -.35, 0);
    } else {
      camera.position.set(0, 0, mode === "tunnel" ? .2 : 7.2);
    }
    let geometry: THREE.BufferGeometry;
    if (mode === "tunnel") {
      geometry = new THREE.CylinderGeometry(2.65, 2.65, 13, 144, 70, true);
      geometry.rotateX(Math.PI / 2);
    } else if (mode === "sphere") {
      geometry = new THREE.SphereGeometry(2.35, 172, 128);
    } else if (mode === "wave") {
      geometry = new THREE.PlaneGeometry(10.4, 6.4, 210, 126);
      geometry.rotateX(-Math.PI / 2.18);
    } else if (mode === "ring") {
      geometry = new THREE.TorusGeometry(2.35, .78, 40, 260);
    } else if (mode === "knot") {
      geometry = new THREE.TorusKnotGeometry(1.75, .56, 320, 40, 2, 3);
    } else if (mode === "cone") {
      geometry = new THREE.ConeGeometry(2.5, 4.4, 128, 80, true);
    } else {
      geometry = new THREE.BoxGeometry(4.2, 3.1, 3.1, 42, 32, 32);
    }
    const initialPalette = shared.paletteRef.current;
    const uniforms = {
      time: { value: 0 },
      offsetSize: { value: mode === "tunnel" ? 24 : mode === "sphere" ? 30 : mode === "wave" ? 26 : mode === "knot" ? 28 : 34 },
      size: { value: mode === "tunnel" ? 2.2 : mode === "wave" ? 2.4 : 2.6 },
      frequency: { value: 1.25 },
      amplitude: { value: .42 },
      offsetGain: { value: 0 },
      maxDistance: { value: 1.8 },
      startColor: { value: toThreeColor(initialPalette[0]) },
      endColor: { value: toThreeColor(initialPalette[1] || initialPalette[0]) },
      opacity: { value: .62 },
    };
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(geometry, material);
    if (mode === "tunnel") particles.position.z = -4.2;
    scene.add(particles);

    let last = performance.now();
    let smoothedEnergy = 0;
    let smoothedBass = 0;
    let smoothedMid = 0;
    let smoothedTreble = 0;
    let prevManualYaw = getManualRotation().yaw;
    let prevManualPitch = getManualRotation().pitch;

    const resize = () => {
      const { width, height } = measureHost(canvas);
      renderer.setPixelRatio(particlePixelRatio());
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const render = (now: number) => {
      if (failed) return;
      try {
        const delta = Math.min(.05, Math.max(.001, (now - last) / 1000));
        last = now;
        const measured = readVisualizerLevels(shared.localAudioRef.current, shared.playingRef.current, now / 1000);
        const response = measured.energy > smoothedEnergy ? .24 : .075;
        smoothedEnergy += (Math.min(1, measured.energy) - smoothedEnergy) * response;
        smoothedBass += (Math.min(1, measured.bass) - smoothedBass) * response;
        smoothedMid += (Math.min(1, measured.mid) - smoothedMid) * response;
        smoothedTreble += (Math.min(1, measured.treble) - smoothedTreble) * response;
        uniforms.time.value += delta * (.55 + smoothedBass * 3.2);
        uniforms.frequency.value = (mode === "tunnel" ? .78 : mode === "sphere" ? .92 : mode === "wave" ? .68 : 1.05) + smoothedBass * 1.9;
        uniforms.amplitude.value = (mode === "tunnel" ? .28 : mode === "wave" ? .5 : .38) + smoothedTreble * .95;
        uniforms.offsetGain.value = smoothedMid * (mode === "wave" ? 1.85 : 1.15);
        uniforms.opacity.value = .38 + smoothedEnergy * .52;
        const palette = shared.paletteRef.current;
        uniforms.startColor.value.lerp(toThreeColor(palette[0]), .08);
        uniforms.endColor.value.lerp(toThreeColor(palette[1] || palette[0]), .08);
        if (mode === "wave") {
          particles.rotation.z += delta * (.012 + smoothedTreble * .05);
        } else if (mode === "ring") {
          particles.rotation.x += delta * (.05 + smoothedMid * .22);
          particles.rotation.y += delta * (.02 + smoothedTreble * .16);
        } else if (mode === "knot") {
          particles.rotation.y += delta * (.11 + smoothedTreble * .42);
          particles.rotation.z += delta * (.03 + smoothedMid * .12);
        } else if (mode === "cone") {
          particles.rotation.y += delta * (.1 + smoothedTreble * .34);
        } else {
          particles.rotation.y += delta * (mode === "sphere" ? .085 + smoothedTreble * .3 : .045 + smoothedTreble * .2);
          particles.rotation.x += delta * (mode === "field" ? .024 + smoothedMid * .08 : mode === "sphere" ? .016 + smoothedMid * .05 : .004);
        }
        const pulse = 1 + smoothedBass * (mode === "tunnel" ? .045 : mode === "sphere" ? .19 : mode === "wave" ? .07 : mode === "ring" ? .16 : mode === "knot" ? .14 : mode === "cone" ? .12 : .13);
        particles.scale.setScalar(pulse);
        if (mode === "tunnel") {
          // Continuous forward motion comes from the noise field flowing along
          // the cylinder; translating the mesh with a modulo wrap caused a
          // visible camera-reset jump every cycle.
          particles.rotation.z += delta * (.03 + smoothedMid * .12);
        }
        if (mode === "wave") particles.position.y = -.55 + smoothedBass * .3;
        // Right-stick manual rotation: add the per-frame delta on top of the
        // automatic motion so the user can freely spin the 3D effect.
        const manual = getManualRotation();
        particles.rotation.y += manual.yaw - prevManualYaw;
        particles.rotation.x += manual.pitch - prevManualPitch;
        prevManualYaw = manual.yaw;
        prevManualPitch = manual.pitch;
        renderer.render(scene, camera);
      } catch {
        failToFallback();
        return;
      }
      frame = window.requestAnimationFrame(render);
    };

    try {
      resize();
    } catch {
      failToFallback();
    }
    window.addEventListener("resize", resize);
    window.addEventListener(PARTICLE_RESOLUTION_EVENT, resize);
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    const root = canvas.closest<HTMLElement>(".npFullscreenRoot");
    if (observer && root) observer.observe(root);
    if (!failed) frame = window.requestAnimationFrame(render);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener(PARTICLE_RESOLUTION_EVENT, resize);
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      observer?.disconnect();
      scene.remove(particles);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      try {
        renderer.forceContextLoss();
      } catch {
        // The context may already be lost; disposing above is sufficient.
      }
    };
  }, [mode, onFailure]);

  return <canvas ref={canvasRef} className="npReactiveParticlesCanvas" />;
}

type FallbackPoint = { x: number; y: number; z: number; seed: number };

function buildFallbackPoints(mode: ParticleMode): FallbackPoint[] {
  const points: FallbackPoint[] = [];
  const range = (from: number, to: number) => from + Math.random() * (to - from);
  if (mode === "tunnel") {
    for (let index = 0; index < 1050; index += 1) {
      const angle = range(0, Math.PI * 2);
      points.push({ x: Math.cos(angle) * 2.65, y: Math.sin(angle) * 2.65, z: range(-16, -1), seed: range(0, Math.PI * 2) });
    }
  } else if (mode === "sphere") {
    for (let index = 0; index < 950; index += 1) {
      const height = range(-1, 1);
      const angle = range(0, Math.PI * 2);
      const ring = Math.sqrt(Math.max(0, 1 - height * height));
      points.push({ x: Math.cos(angle) * ring * 2.35, y: height * 2.35, z: Math.sin(angle) * ring * 2.35, seed: range(0, Math.PI * 2) });
    }
  } else if (mode === "wave") {
    for (let column = 0; column < 46; column += 1) {
      for (let row = 0; row < 26; row += 1) {
        points.push({ x: -5.2 + (10.4 * column) / 45, y: 0, z: -1.2 - (7.6 * row) / 25, seed: ((column * 26 + row) % 17) * .37 });
      }
    }
  } else if (mode === "ring") {
    const majorRadius = 2.3;
    const minorRadius = .78;
    for (let index = 0; index < 1000; index += 1) {
      const major = range(0, Math.PI * 2);
      const minor = range(0, Math.PI * 2);
      const radial = majorRadius + minorRadius * Math.cos(minor);
      points.push({ x: radial * Math.cos(major), y: minorRadius * Math.sin(minor), z: radial * Math.sin(major), seed: range(0, Math.PI * 2) });
    }
  } else if (mode === "knot") {
    const p = 2;
    const q = 3;
    for (let index = 0; index < 1000; index += 1) {
      const t = range(0, Math.PI * 2);
      const base = 2 + Math.cos(q * t);
      points.push({ x: base * Math.cos(p * t) * .82, y: base * Math.sin(p * t) * .82, z: Math.sin(q * t) * .82, seed: range(0, Math.PI * 2) });
    }
  } else if (mode === "cone") {
    for (let index = 0; index < 1000; index += 1) {
      const height = range(0, 1);
      const angle = range(0, Math.PI * 2);
      const radius = (1 - height) * 2.5;
      points.push({ x: Math.cos(angle) * radius, y: height * 4.4 - 2.2, z: Math.sin(angle) * radius, seed: range(0, Math.PI * 2) });
    }
  } else {
    for (let index = 0; index < 950; index += 1) {
      points.push({ x: range(-2.1, 2.1), y: range(-1.55, 1.55), z: range(-1.55, 1.55), seed: range(0, Math.PI * 2) });
    }
  }
  return points;
}

/**
 * Canvas 2D approximation of the four particle modes, used when the Steam CEF
 * surface refuses a WebGL context so the themes keep working everywhere.
 */
function FallbackParticlesCanvas({ mode, shared }: { mode: ParticleMode; shared: SharedVisualRefs }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) return;
    const points = buildFallbackPoints(mode);
    let width = 1;
    let height = 1;
    let frame = 0;
    let last = performance.now();
    let rotationY = 0;
    let rotationX = 0;
    let spin = 0;
    let flow = 0;
    let smoothedEnergy = 0;
    let smoothedBass = 0;
    let smoothedMid = 0;
    let smoothedTreble = 0;
    let prevManualYaw = getManualRotation().yaw;
    let prevManualPitch = getManualRotation().pitch;

    const resize = () => {
      const ratio = particlePixelRatio();
      const host = measureHost(canvas);
      width = host.width;
      height = host.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const render = (now: number) => {
      const delta = Math.min(.05, Math.max(.001, (now - last) / 1000));
      last = now;
      const time = now / 1000;
      const measured = readVisualizerLevels(shared.localAudioRef.current, shared.playingRef.current, time);
      const response = measured.energy > smoothedEnergy ? .24 : .075;
      smoothedEnergy += (measured.energy - smoothedEnergy) * response;
      smoothedBass += (measured.bass - smoothedBass) * response;
      smoothedMid += (measured.mid - smoothedMid) * response;
      smoothedTreble += (measured.treble - smoothedTreble) * response;
      rotationY += delta * (.14 + smoothedTreble * .5);
      rotationX += delta * (mode === "field" ? .06 + smoothedMid * .18 : .028 + smoothedMid * .08);
      const manual = getManualRotation();
      rotationY += manual.yaw - prevManualYaw;
      rotationX += manual.pitch - prevManualPitch;
      prevManualYaw = manual.yaw;
      prevManualPitch = manual.pitch;
      spin += delta * (.22 + smoothedMid * .8);
      flow += delta * (1.7 + smoothedBass * 6.5);

      context.fillStyle = "#000";
      context.fillRect(0, 0, width, height);
      context.globalCompositeOperation = "lighter";
      const palette = shared.paletteRef.current;
      const paletteCss = palette.map((color) => `rgb(${color.red},${color.green},${color.blue})`);
      const focal = Math.min(width, height) * (mode === "tunnel" ? 1 : .92);
      const centerX = width / 2;
      const centerY = height / 2;
      const jitter = .1 + smoothedTreble * .5;
      const pulse = 1 + smoothedBass * (mode === "sphere" ? .2 : .09);
      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);
      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);
      const cosSpin = Math.cos(spin);
      const sinSpin = Math.sin(spin);
      const tilt = .55;
      const cosTilt = Math.cos(tilt);
      const sinTilt = Math.sin(tilt);

      let paletteIndex = 0;
      for (const point of points) {
        paletteIndex += 1;
        let projectedX = 0;
        let projectedY = 0;
        let depthFade = 0;
        if (mode === "tunnel") {
          const rotatedX = point.x * cosSpin - point.y * sinSpin;
          const rotatedY = point.x * sinSpin + point.y * cosSpin;
          let depth = point.z + (flow % 15);
          if (depth > -1) depth -= 15;
          const wobble = 1 + Math.sin(point.seed + time * (1.4 + smoothedBass * 3)) * jitter * .16;
          const distance = -depth;
          projectedX = centerX + (rotatedX * wobble * pulse * focal) / distance;
          projectedY = centerY + (rotatedY * wobble * pulse * focal) / distance;
          depthFade = Math.max(0, Math.min(1, 1 - distance / 16));
        } else {
          let x = point.x;
          let y = point.y;
          let z = point.z;
          if (mode === "wave") {
            y = (Math.sin(x * .75 + time * (1.5 + smoothedBass * 2.6)) * .45
              + Math.sin(z * .95 + time * 1.25 + point.seed) * .35)
              * (.4 + smoothedBass * 1.15 + smoothedMid * .5);
          } else {
            const wobble = Math.sin(point.seed + time * (1.5 + smoothedBass * 2.6)) * jitter * .3;
            const length = Math.hypot(x, y, z) || 1;
            x += (x / length) * wobble;
            y += (y / length) * wobble;
            z += (z / length) * wobble;
            const spunX = x * cosY - z * sinY;
            const spunZ = x * sinY + z * cosY;
            const liftedY = y * cosX - spunZ * sinX;
            z = y * sinX + spunZ * cosX;
            x = spunX;
            y = liftedY;
          }
          const tiltedY = mode === "wave" ? y * cosTilt - z * sinTilt : y;
          const tiltedZ = mode === "wave" ? y * sinTilt + z * cosTilt : z;
          const denominator = 6.6 - tiltedZ * pulse;
          if (denominator < .5) continue;
          projectedX = centerX + (x * pulse * focal) / denominator;
          projectedY = centerY - (tiltedY * pulse * focal) / denominator + (mode === "wave" ? height * .08 : 0);
          depthFade = Math.max(0, Math.min(1, 1 - denominator / 11));
        }
        if (projectedX < -20 || projectedX > width + 20 || projectedY < -20 || projectedY > height + 20) continue;
        const size = Math.max(.55, .8 + depthFade * 1.7 + smoothedEnergy * 1.7);
        context.globalAlpha = Math.max(.08, Math.min(.85, .13 + depthFade * .3 + smoothedEnergy * .38));
        context.fillStyle = paletteCss[paletteIndex % paletteCss.length];
        context.beginPath();
        context.arc(projectedX, projectedY, size, 0, Math.PI * 2);
        context.fill();
      }
      context.globalAlpha = 1;
      context.globalCompositeOperation = "source-over";
      frame = window.requestAnimationFrame(render);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener(PARTICLE_RESOLUTION_EVENT, resize);
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    const root = canvas.closest<HTMLElement>(".npFullscreenRoot");
    if (observer && root) observer.observe(root);
    frame = window.requestAnimationFrame(render);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener(PARTICLE_RESOLUTION_EVENT, resize);
      observer?.disconnect();
    };
  }, [mode]);

  return <canvas ref={canvasRef} className="npReactiveParticlesCanvas" />;
}
