<script lang="ts">
  import { Canvas } from '@threlte/core';
  import CncSceneContent from './CncSceneContent.svelte';

  let dimX = $state(4);
  let dimY = $state(0.5);
  let dimZ = $state(6);
</script>

<div class="flex flex-col gap-6 w-full">
  <!-- 3D Canvas -->
  <div class="w-full rounded-xl overflow-hidden border border-gray-700" style="height: 480px;">
    <Canvas>
      <CncSceneContent {dimX} {dimY} {dimZ} />
    </Canvas>
  </div>

  <!-- Dimension Controls -->
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-gray-800 rounded-xl p-6 border border-gray-700">
    <!-- X dimension -->
    <div class="flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <label class="text-sm font-semibold text-gray-200">Width (X)</label>
        <span class="text-sm font-mono text-green-400">{dimX.toFixed(1)} units</span>
      </div>
      <input
        type="range"
        min="0.1"
        max="10"
        step="0.1"
        bind:value={dimX}
        class="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700 accent-green-500"
      />
      <input
        type="number"
        min="0.1"
        max="10"
        step="0.1"
        bind:value={dimX}
        class="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-green-500"
      />
    </div>

    <!-- Y dimension -->
    <div class="flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <label class="text-sm font-semibold text-gray-200">Height (Y)</label>
        <span class="text-sm font-mono text-green-400">{dimY.toFixed(1)} units</span>
      </div>
      <input
        type="range"
        min="0.1"
        max="5"
        step="0.1"
        bind:value={dimY}
        class="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700 accent-green-500"
      />
      <input
        type="number"
        min="0.1"
        max="5"
        step="0.1"
        bind:value={dimY}
        class="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-green-500"
      />
    </div>

    <!-- Z dimension -->
    <div class="flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <label class="text-sm font-semibold text-gray-200">Depth (Z)</label>
        <span class="text-sm font-mono text-green-400">{dimZ.toFixed(1)} units</span>
      </div>
      <input
        type="range"
        min="0.1"
        max="10"
        step="0.1"
        bind:value={dimZ}
        class="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700 accent-green-500"
      />
      <input
        type="number"
        min="0.1"
        max="10"
        step="0.1"
        bind:value={dimZ}
        class="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-green-500"
      />
    </div>
  </div>
</div>
