<script lang="ts">
  import { Canvas } from '@threlte/core';
  import CncSceneContent from './CncSceneContent.svelte';

  type Unit = 'mm' | 'in';

  // Scale factor: mm → Three.js scene units (25 mm per unit keeps the original visual scale)
  const SCENE_SCALE = 1 / 25;
  const IN_PER_MM = 1 / 25.4;

  // Internal state stored in mm
  let dimX = $state(100); // 100 mm ≈ 4 in
  let dimY = $state(12);  //  12 mm ≈ 0.5 in
  let dimZ = $state(150); // 150 mm ≈ 6 in

  let unit = $state<Unit>('mm');

  // Scaled Three.js dimensions
  let s3X = $derived(dimX * SCENE_SCALE);
  let s3Y = $derived(dimY * SCENE_SCALE);
  let s3Z = $derived(dimZ * SCENE_SCALE);

  // Format a mm value for display in the currently selected unit
  function fmt(mm: number): string {
    return unit === 'in' ? (mm * IN_PER_MM).toFixed(3) : mm.toFixed(1);
  }

  // Step size for arrow buttons: 10 mm or ~0.5 in (12.7 mm)
  function stepMm(): number {
    return unit === 'in' ? 12.7 : 10;
  }

  function clamp(v: number, lo: number, hi: number): number {
    return Math.max(lo, Math.min(hi, v));
  }

  function adjustX(dir: 1 | -1) { dimX = clamp(dimX + stepMm() * dir, 10, 500); }
  function adjustY(dir: 1 | -1) { dimY = clamp(dimY + stepMm() * dir, 1, 200); }
  function adjustZ(dir: 1 | -1) { dimZ = clamp(dimZ + stepMm() * dir, 10, 500); }

  // Slider/number-input helpers: display in the selected unit, convert back to mm on input
  function toDisp(mm: number): number { return unit === 'in' ? +(mm * IN_PER_MM).toFixed(4) : mm; }
  function fromDisp(val: string): number { return unit === 'in' ? +val * 25.4 : +val; }

  // Per-axis slider limits in the currently selected unit
  let limX = $derived(unit === 'in'
    ? { min: +(10 * IN_PER_MM).toFixed(3), max: +(500 * IN_PER_MM).toFixed(3), step: +(10 * IN_PER_MM).toFixed(3) }
    : { min: 10, max: 500, step: 10 });
  let limY = $derived(unit === 'in'
    ? { min: +(1 * IN_PER_MM).toFixed(3), max: +(200 * IN_PER_MM).toFixed(3), step: +(1 * IN_PER_MM).toFixed(3) }
    : { min: 1, max: 200, step: 1 });
  let limZ = $derived(unit === 'in'
    ? { min: +(10 * IN_PER_MM).toFixed(3), max: +(500 * IN_PER_MM).toFixed(3), step: +(10 * IN_PER_MM).toFixed(3) }
    : { min: 10, max: 500, step: 10 });
</script>

<div class="flex flex-col gap-6 w-full">
  <!-- Unit toggle -->
  <div class="flex items-center gap-3">
    <span class="text-sm font-medium text-gray-400">Units:</span>
    <div class="flex rounded-lg overflow-hidden border border-gray-600">
      <button
        onclick={() => (unit = 'mm')}
        class="px-4 py-1.5 text-sm font-semibold transition-colors {unit === 'mm' ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}"
      >mm</button>
      <button
        onclick={() => (unit = 'in')}
        class="px-4 py-1.5 text-sm font-semibold transition-colors {unit === 'in' ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}"
      >in</button>
    </div>
  </div>

  <!-- 3D Canvas with overlays -->
  <div class="relative w-full rounded-xl overflow-hidden border border-gray-700" style="height: 480px;">
    <Canvas>
      <CncSceneContent dimX={s3X} dimY={s3Y} dimZ={s3Z} />
    </Canvas>

    <!-- Arrow controls — bottom-left overlay -->
    <div class="absolute bottom-4 left-4 z-10 bg-gray-900/80 backdrop-blur-sm rounded-xl p-3 border border-gray-700 select-none">
      <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Adjust</p>
      <div class="flex flex-col gap-2">
        <!-- X -->
        <div class="flex items-center gap-2">
          <span class="w-20 text-xs text-gray-300">Width (X)</span>
          <button
            onclick={() => adjustX(-1)}
            class="w-7 h-7 flex items-center justify-center rounded bg-gray-700 hover:bg-green-600 text-white transition-colors"
            aria-label="Decrease width"
          >←</button>
          <button
            onclick={() => adjustX(1)}
            class="w-7 h-7 flex items-center justify-center rounded bg-gray-700 hover:bg-green-600 text-white transition-colors"
            aria-label="Increase width"
          >→</button>
        </div>
        <!-- Y -->
        <div class="flex items-center gap-2">
          <span class="w-20 text-xs text-gray-300">Height (Y)</span>
          <button
            onclick={() => adjustY(-1)}
            class="w-7 h-7 flex items-center justify-center rounded bg-gray-700 hover:bg-green-600 text-white transition-colors"
            aria-label="Decrease height"
          >↓</button>
          <button
            onclick={() => adjustY(1)}
            class="w-7 h-7 flex items-center justify-center rounded bg-gray-700 hover:bg-green-600 text-white transition-colors"
            aria-label="Increase height"
          >↑</button>
        </div>
        <!-- Z -->
        <div class="flex items-center gap-2">
          <span class="w-20 text-xs text-gray-300">Depth (Z)</span>
          <button
            onclick={() => adjustZ(-1)}
            class="w-7 h-7 flex items-center justify-center rounded bg-gray-700 hover:bg-green-600 text-white transition-colors"
            aria-label="Decrease depth"
          >←</button>
          <button
            onclick={() => adjustZ(1)}
            class="w-7 h-7 flex items-center justify-center rounded bg-gray-700 hover:bg-green-600 text-white transition-colors"
            aria-label="Increase depth"
          >→</button>
        </div>
      </div>
    </div>

    <!-- Dimensions HUD — bottom-right overlay -->
    <div class="absolute bottom-4 right-4 z-10 bg-gray-900/80 backdrop-blur-sm rounded-xl px-4 py-3 border border-gray-700">
      <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Dimensions</p>
      <div class="flex flex-col gap-1 font-mono text-sm">
        <div class="flex gap-3">
          <span class="text-gray-500 w-4">W</span>
          <span class="text-green-400">{fmt(dimX)} {unit}</span>
        </div>
        <div class="flex gap-3">
          <span class="text-gray-500 w-4">H</span>
          <span class="text-green-400">{fmt(dimY)} {unit}</span>
        </div>
        <div class="flex gap-3">
          <span class="text-gray-500 w-4">D</span>
          <span class="text-green-400">{fmt(dimZ)} {unit}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Dimension Controls -->
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-gray-800 rounded-xl p-6 border border-gray-700">
    <!-- X dimension -->
    <div class="flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <label class="text-sm font-semibold text-gray-200">Width (X)</label>
        <span class="text-sm font-mono text-green-400">{fmt(dimX)} {unit}</span>
      </div>
      <input
        type="range"
        min={limX.min}
        max={limX.max}
        step={limX.step}
        value={toDisp(dimX)}
        oninput={e => { dimX = clamp(fromDisp(e.currentTarget.value), 10, 500); }}
        class="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700 accent-green-500"
      />
      <input
        type="number"
        min={limX.min}
        max={limX.max}
        step={limX.step}
        value={toDisp(dimX)}
        oninput={e => { dimX = clamp(fromDisp(e.currentTarget.value), 10, 500); }}
        class="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-green-500"
      />
    </div>

    <!-- Y dimension -->
    <div class="flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <label class="text-sm font-semibold text-gray-200">Height (Y)</label>
        <span class="text-sm font-mono text-green-400">{fmt(dimY)} {unit}</span>
      </div>
      <input
        type="range"
        min={limY.min}
        max={limY.max}
        step={limY.step}
        value={toDisp(dimY)}
        oninput={e => { dimY = clamp(fromDisp(e.currentTarget.value), 1, 200); }}
        class="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700 accent-green-500"
      />
      <input
        type="number"
        min={limY.min}
        max={limY.max}
        step={limY.step}
        value={toDisp(dimY)}
        oninput={e => { dimY = clamp(fromDisp(e.currentTarget.value), 1, 200); }}
        class="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-green-500"
      />
    </div>

    <!-- Z dimension -->
    <div class="flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <label class="text-sm font-semibold text-gray-200">Depth (Z)</label>
        <span class="text-sm font-mono text-green-400">{fmt(dimZ)} {unit}</span>
      </div>
      <input
        type="range"
        min={limZ.min}
        max={limZ.max}
        step={limZ.step}
        value={toDisp(dimZ)}
        oninput={e => { dimZ = clamp(fromDisp(e.currentTarget.value), 10, 500); }}
        class="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700 accent-green-500"
      />
      <input
        type="number"
        min={limZ.min}
        max={limZ.max}
        step={limZ.step}
        value={toDisp(dimZ)}
        oninput={e => { dimZ = clamp(fromDisp(e.currentTarget.value), 10, 500); }}
        class="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-green-500"
      />
    </div>
  </div>
</div>
