<script lang="ts">
  import { Canvas } from '@threlte/core';
  import CncSceneContent from './CncSceneContent.svelte';
  import * as THREE from 'three';
  import { STLExporter } from 'three/examples/jsm/exporters/STLExporter.js';

  interface Props {
    nextcloudServer?: string;
    cncUser?: string;
    cncPassword?: string;
  }

  let { nextcloudServer = '', cncUser = '', cncPassword = '' }: Props = $props();

  type Unit = 'mm' | 'in';

  // Scale factor: mm → Three.js scene units (25 mm per unit keeps the original visual scale)
  const SCENE_SCALE = 1 / 25;
  const IN_PER_MM = 1 / 25.4;

  // Available step sizes in mm
  const STEP_OPTIONS = [0.1, 1.0, 2.5, 5, 10] as const;

  // Dimension limits in mm (width × length × height)
  const MIN_W = 100,  MAX_W = 950;
  const MIN_L = 100,  MAX_L = 1200;
  const MIN_H = 10,   MAX_H = 150;

  // Internal state stored in mm – X = width, Z = length, Y = height
  let dimX = $state(310); // width  = 310 mm
  let dimZ = $state(405); // length = 405 mm
  let dimY = $state(120); // height = 120 mm

  let unit = $state<Unit>('mm');
  let step = $state<number>(1.0); // mm

  // Upload state
  type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';
  let uploadStatus = $state<UploadStatus>('idle');
  let uploadMessage = $state('');

  // CSS classes for the upload status banner
  const STATUS_CLASSES: Record<UploadStatus, string> = {
    idle:      '',
    uploading: 'bg-blue-900/40 border-blue-700 text-blue-300',
    success:   'bg-green-900/40 border-green-700 text-green-300',
    error:     'bg-red-900/40 border-red-700 text-red-300',
  };
  let uploadBannerClass = $derived(STATUS_CLASSES[uploadStatus]);

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

  function adjustX(dir: 1 | -1) { dimX = clamp(dimX + step * dir, MIN_W, MAX_W); }
  function adjustY(dir: 1 | -1) { dimY = clamp(dimY + step * dir, MIN_H, MAX_H); }
  function adjustZ(dir: 1 | -1) { dimZ = clamp(dimZ + step * dir, MIN_L, MAX_L); }

  // ── STL export ──────────────────────────────────────────────────────────────────
  function buildSTL(): DataView {
    // Build the STL with real mm dimensions so the exported file is to scale.
    const geometry = new THREE.BoxGeometry(dimX, dimY, dimZ);
    const mesh = new THREE.Mesh(geometry);
    const exporter = new STLExporter();
    return exporter.parse(mesh, { binary: true }) as DataView;
  }

  function downloadSTL() {
    const data = buildSTL();
    const blob = new Blob([data.buffer], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'model.stl';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ── Preview capture ─────────────────────────────────────────────────────────────
  function capturePreview(): Promise<Blob | null> {
    return new Promise((resolve) => {
      const canvas = document.querySelector('canvas');
      if (!canvas) { resolve(null); return; }
      canvas.toBlob((blob) => resolve(blob), 'image/png');
    });
  }

  // ── Nextcloud WebDAV helpers ─────────────────────────────────────────────────────
  async function webdavMkdir(url: string, auth: string): Promise<void> {
    const res = await fetch(url, { method: 'MKCOL', headers: { Authorization: auth } });
    // 201 = created, 405 = already exists – both are acceptable
    if (!res.ok && res.status !== 405) {
      throw new Error(`MKCOL ${url} → ${res.status} ${res.statusText}`);
    }
  }

  async function webdavPut(url: string, body: BodyInit, auth: string, contentType: string): Promise<void> {
    const res = await fetch(url, {
      method: 'PUT',
      headers: { Authorization: auth, 'Content-Type': contentType },
      body,
    });
    if (!res.ok) {
      throw new Error(`PUT ${url} → ${res.status} ${res.statusText}`);
    }
  }

  // ── Manufacture (upload to Nextcloud) ───────────────────────────────────────────
  async function manufacture() {
    if (!nextcloudServer || !cncUser || !cncPassword) {
      uploadStatus = 'error';
      uploadMessage = 'Nextcloud credentials are not configured (NEXTCLOUD_WEBDAV_SERVER, CNC_APP_USER, CNC_APP_PASSWORD).';
      return;
    }

    uploadStatus = 'uploading';
    uploadMessage = 'Uploading to Nextcloud…';

    try {
      // Derive a stable user ID from localStorage; fall back to a timestamped value
      let userId = localStorage.getItem('oakpine_user_id');
      if (!userId) {
        userId = 'USER_' + Date.now();
        localStorage.setItem('oakpine_user_id', userId);
      }
      const projectId = 'Project_' + crypto.randomUUID();
      const auth = 'Basic ' + btoa(`${cncUser}:${cncPassword}`);

      // Nextcloud WebDAV path: <server>/remote.php/dav/files/<user>
      const davBase = nextcloudServer.replace(/\/$/, '') + '/remote.php/dav/files/' + cncUser;

      const cncPath     = `${davBase}/CNC-Projects`;
      const userPath    = `${cncPath}/${userId}`;
      const projectPath = `${userPath}/${projectId}`;

      // Create directory hierarchy
      await webdavMkdir(cncPath, auth);
      await webdavMkdir(userPath, auth);
      await webdavMkdir(projectPath, auth);

      // Upload model.stl
      const stlData = buildSTL();
      await webdavPut(`${projectPath}/model.stl`, stlData.buffer, auth, 'application/octet-stream');

      // Upload metadata.json
      const metadata = {
        created_at: new Date().toISOString(),
        dimensions: {
          width_mm:  dimX,
          length_mm: dimZ,
          height_mm: dimY,
        },
        limits: {
          min: { width_mm: MIN_W, length_mm: MIN_L, height_mm: MIN_H },
          max: { width_mm: MAX_W, length_mm: MAX_L, height_mm: MAX_H },
        },
        unit,
      };
      await webdavPut(
        `${projectPath}/metadata.json`,
        JSON.stringify(metadata, null, 2),
        auth,
        'application/json',
      );

      // Upload preview.png (canvas screenshot)
      const previewBlob = await capturePreview();
      if (previewBlob) {
        await webdavPut(`${projectPath}/preview.png`, previewBlob, auth, 'image/png');
      }

      uploadStatus = 'success';
      uploadMessage = `Uploaded to /CNC-Projects/${userId}/${projectId}`;
    } catch (err) {
      uploadStatus = 'error';
      uploadMessage = err instanceof Error ? err.message : 'Upload failed';
    }
  }
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

    <!-- Action buttons -->
    <div class="flex items-center gap-3 ml-auto">
      <button
        onclick={downloadSTL}
        class="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
        title="Export 3D model as STL file"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
        Download STL
      </button>
      <button
        onclick={manufacture}
        disabled={uploadStatus === 'uploading'}
        class="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
        title="Upload STL, metadata and preview to Nextcloud"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clip-rule="evenodd" />
        </svg>
        {uploadStatus === 'uploading' ? 'Uploading…' : 'Manufacture'}
      </button>
    </div>
  </div>

  <!-- Upload status banner -->
  {#if uploadStatus !== 'idle'}
    <div class="rounded-lg px-4 py-3 text-sm font-medium border {uploadBannerClass}">
      {uploadMessage}
      {#if uploadStatus !== 'uploading'}
        <button onclick={() => { uploadStatus = 'idle'; uploadMessage = ''; }} class="ml-3 underline opacity-70 hover:opacity-100">Dismiss</button>
      {/if}
    </div>
  {/if}

  <!-- Manufacturing limits info -->
  <div class="flex flex-wrap gap-4 text-xs font-mono text-gray-500">
    <span>
      Min: {MIN_W} × {MIN_L} × {MIN_H} mm &nbsp;(W × L × H)
    </span>
    <span>|</span>
    <span>
      Max: {MAX_W} × {MAX_L} × {MAX_H} mm &nbsp;(W × L × H)
    </span>
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
        <!-- X / Width -->
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
        <!-- Y / Height -->
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
        <!-- Z / Length -->
        <div class="flex items-center gap-2">
          <span class="w-20 text-xs text-gray-300">Length (Z)</span>
          <button
            onclick={() => adjustZ(-1)}
            class="w-7 h-7 flex items-center justify-center rounded bg-gray-700 hover:bg-green-600 text-white transition-colors"
            aria-label="Decrease length"
          >←</button>
          <button
            onclick={() => adjustZ(1)}
            class="w-7 h-7 flex items-center justify-center rounded bg-gray-700 hover:bg-green-600 text-white transition-colors"
            aria-label="Increase length"
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
          <span class="text-gray-500 w-4">L</span>
          <span class="text-green-400">{fmt(dimZ)} {unit}</span>
        </div>
        <div class="flex gap-3">
          <span class="text-gray-500 w-4">H</span>
          <span class="text-green-400">{fmt(dimY)} {unit}</span>
        </div>
      </div>
    </div>
  </div>
</div>

