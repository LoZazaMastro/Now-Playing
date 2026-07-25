/**
 * D-pad control for rotating the current fullscreen 3D effect.
 *
 * The analog sticks are not reliably readable inside Steam's Gamepad UI, so the
 * effect is rotated with D-pad up/down. Each press advances a rotation target by
 * a fixed step; the displayed rotation eases toward that target every frame, so
 * holding the D-pad (auto-repeat) produces a smooth continuous turn instead of
 * visible steps, while there is no momentum — once presses stop, the rotation
 * settles on the target and stays put. Only the 3D particle effects read this.
 */

// Radians the target advances per D-pad press (small = gentle while held).
const STEP = 0.02;
// Higher = the rotation catches up to the target faster (per second).
const SMOOTHING = 7;

let users = 0;
let raf = 0;
let lastTime = 0;
let yaw = 0;
let targetYaw = 0;

function loop(now: number) {
  const delta = lastTime ? Math.min(0.05, (now - lastTime) / 1000) : 0;
  lastTime = now;
  yaw += (targetYaw - yaw) * Math.min(1, SMOOTHING * delta);
  raf = window.requestAnimationFrame(loop);
}

/** Mount-scoped retain of the smoothing loop. Returns the release callback. */
export function retainVisualizerControl(): () => void {
  users += 1;
  if (users === 1) {
    lastTime = 0;
    raf = window.requestAnimationFrame(loop);
  }
  return () => {
    users = Math.max(0, users - 1);
    if (!users && raf) {
      window.cancelAnimationFrame(raf);
      raf = 0;
    }
  };
}

/** Advance the rotation target by one step. `direction` is +1 (down) or -1 (up). */
export function nudgeManualRotation(direction: number): void {
  targetYaw += Math.sign(direction) * STEP;
}

/** Current (smoothed) manual rotation offset (radians) driven by the D-pad. */
export function getManualRotation(): { yaw: number; pitch: number } {
  return { yaw, pitch: 0 };
}
