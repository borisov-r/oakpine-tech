<script lang="ts">
  import { Canvas } from '@threlte/core';
  import CncSceneContent from './CncSceneContent.svelte';

  type Unit = 'mm' | 'in';

  // Scale factor: mm → Three.js scene units (25 mm per unit keeps the original visual scale)
  const SCENE_SCALE = 1 / 25;
  const IN_PER_MM = 1 / 25.4;

  // Available step sizes in mm
  const STEP_OPTIONS = [0.1, 1.0, 2.5, 5, 10] as const;

  // Internal state stored in mm
  let dimX = $state(100); // 100 mm ≈ 4 in
  let dimY = $state(12);  //  12 mm ≈ 0.5 in
  let dimZ = $state(150); // 150 mm ≈ 6 in

  let unit = $state<Unit>('mm');
  let step = $state<number>(0.1); // mm

  // Scaled Three.js dimensions
  let s3X = $derived(dimX * SCENE_SCALE);
  let s3Y = $derived(dimY * SCENE_SCALE);
  let s3Z = $derived(dimZ * SCENE_SCALE);

  // Format a mm value for display in the currently selected unit
  function fmt(mm: number): string {
    return unit === 'in' ? (mm * IN_PER_MM).toFixed(3) : mm.toFixed(1);
  }

  function clamp(v: number, lo: number, hi: number): number {
    return Math.max(lo, Math.min(hi, v));
  }

  function adjustX(dir: 1 | -1) { dimX = clamp(dimX + step * dir, 10, 500); }
  function adjustY(dir: 1 | -1) { dimY = clamp(dimY + step * dir, 1, 200); }
  function adjustZ(dir: 1 | -1) { dimZ = clamp(dimZ + step * dir, 10, 500); }
</script>

<div class="flex flex-col gap-6 w-full">
  <!-- Controls row: unit toggle + step selector -->
  <div class="flex flex-wrap items-center gap-6">
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

    <!-- Step selector -->
    <div class="flex items-center gap-3">
      <span class="text-sm font-medium text-gray-400">Step (mm):</span>
      <div class="flex rounded-lg overflow-hidden border border-gray-600">
        {#each STEP_OPTIONS as s}
          <button
            onclick={() => (step = s)}
            class="px-3 py-1.5 text-sm font-semibold transition-colors {step === s ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}"
          >{s}</button>
        {/each}
      </div>
    </div>
  </div>

  <!-- 3D Canvas with overlays -->
  <div class="relative w-full rounded-xl overflow-hidden border border-gray-700" style="height: 480px;">
    <Canvas>
      <CncSceneContent
        dimX={s3X}
        dimY={s3Y}
        dimZ={s3Z}
        onAdjustX={adjustX}
        onAdjustY={adjustY}
        onAdjustZ={adjustZ}
      />
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
</div>
