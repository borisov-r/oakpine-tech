<script lang="ts">
  import { T } from '@threlte/core';
  import { OrbitControls, interactivity } from '@threlte/extras';

  interface Props {
    dimX: number;
    dimY: number;
    dimZ: number;
    onAdjustX?: (dir: 1 | -1) => void;
    onAdjustY?: (dir: 1 | -1) => void;
    onAdjustZ?: (dir: 1 | -1) => void;
  }

  let { dimX, dimY, dimZ, onAdjustX, onAdjustY, onAdjustZ }: Props = $props();

  interactivity();

  let selected = $state(false);
  let orbitEnabled = $state(true);

  const GRID_SIZE = 20;
  const GRID_DIVISIONS = 20;
  const GRID_COLOR_PRIMARY = '#374151';
  const GRID_COLOR_SECONDARY = '#1f2937';

  // Arrow geometry constants (in scene units)
  const SHAFT_RADIUS = 0.04;
  const SHAFT_HEIGHT = 0.3;
  const HEAD_RADIUS = 0.12;
  const HEAD_HEIGHT = 0.2;
  const ARROW_COLOR = '#facc15';

  // Pixels of pointer movement required to trigger one step adjustment
  const DRAG_THRESHOLD_PX = 20;

  // Drag state (plain variables – no reactivity needed)
  let isDragging = false;
  let dragAdjust: ((dir: 1 | -1) => void) | undefined;
  let dragScreenAxis: 'x' | 'y' = 'x';
  let dragLastPos = 0;
  let dragPending = 0;
  // Tracks whether at least one step was applied during the current drag so we
  // can suppress the subsequent onclick (which would double-count).
  let hadSignificantDrag = false;

  function startArrowDrag(
    adjust: ((dir: 1 | -1) => void) | undefined,
    screenAxis: 'x' | 'y',
    e: { stopPropagation: () => void; event?: PointerEvent },
  ) {
    e.stopPropagation();
    if (!adjust) return;

    isDragging = true;
    dragAdjust = adjust;
    dragScreenAxis = screenAxis;
    hadSignificantDrag = false;
    dragPending = 0;

    // Threlte wraps the native event under `e.event`
    dragLastPos = screenAxis === 'x' ? (e.event?.clientX ?? 0) : (e.event?.clientY ?? 0);

    orbitEnabled = false;
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp, { once: true });
  }

  function onPointerMove(e: PointerEvent) {
    if (!isDragging) return;

    const pos = dragScreenAxis === 'x' ? e.clientX : e.clientY;
    const rawDelta = pos - dragLastPos;
    dragLastPos = pos;

    // Screen Y increases downward; invert so dragging up increases the value.
    const delta = dragScreenAxis === 'y' ? -rawDelta : rawDelta;
    dragPending += delta;

    while (dragPending >= DRAG_THRESHOLD_PX) {
      dragAdjust?.(1);
      dragPending -= DRAG_THRESHOLD_PX;
      hadSignificantDrag = true;
    }
    while (dragPending <= -DRAG_THRESHOLD_PX) {
      dragAdjust?.(-1);
      dragPending += DRAG_THRESHOLD_PX;
      hadSignificantDrag = true;
    }
  }

  function onPointerUp() {
    isDragging = false;
    dragAdjust = undefined;
    orbitEnabled = true;
    document.removeEventListener('pointermove', onPointerMove);
    // 'pointerup' was added with { once: true } so no explicit removal is needed.
  }

  // Suppress the click that fires after a drag so the dimension isn't
  // adjusted twice. The flag is cleared after the first suppressed click.
  function handleArrowClick(
    e: { stopPropagation: () => void },
    adjust: ((dir: 1 | -1) => void) | undefined,
    dir: 1 | -1,
  ) {
    if (hadSignificantDrag) { hadSignificantDrag = false; return; }
    e.stopPropagation();
    adjust?.(dir);
  }

  // Clean up if the component is destroyed while a drag is in progress.
  $effect(() => {
    return () => {
      document.removeEventListener('pointermove', onPointerMove);
    };
  });
</script>

<T.PerspectiveCamera makeDefault position={[50, 35, 55]} fov={45}>
  <OrbitControls enableDamping dampingFactor={0.05} enabled={orbitEnabled} />
</T.PerspectiveCamera>

<T.AmbientLight intensity={0.5} />
<T.DirectionalLight position={[5, 10, 5]} intensity={1.2} castShadow />

<!-- Floor grid -->
<T.GridHelper args={[GRID_SIZE, GRID_DIVISIONS, GRID_COLOR_PRIMARY, GRID_COLOR_SECONDARY]} position={[0, 0, 0]} />

<!-- Rectangle box (clickable – toggles selection) -->
<T.Mesh
  position={[0, dimY / 2, 0]}
  castShadow
  receiveShadow
  onclick={(e) => { e.stopPropagation(); selected = !selected; }}
>
  <T.BoxGeometry args={[dimX, dimY, dimZ]} />
  <T.MeshStandardMaterial color={selected ? '#86efac' : '#4ade80'} metalness={0.3} roughness={0.5} />
</T.Mesh>

<!-- Wireframe overlay to show edges on the rectangle -->
<T.Mesh position={[0, dimY / 2, 0]}>
  <T.BoxGeometry args={[dimX, dimY, dimZ]} />
  <T.MeshBasicMaterial color="#166534" wireframe />
</T.Mesh>

<!-- Dimension handles: shown when the box is selected -->
{#if selected}
  <!-- +X arrow (increase width) -->
  <T.Mesh
    position={[dimX / 2 + SHAFT_HEIGHT / 2, dimY / 2, 0]}
    rotation={[0, 0, -Math.PI / 2]}
    onclick={(e) => handleArrowClick(e, onAdjustX, 1)}
    onpointerdown={(e) => startArrowDrag(onAdjustX, 'x', e)}
  >
    <T.CylinderGeometry args={[SHAFT_RADIUS, SHAFT_RADIUS, SHAFT_HEIGHT, 8]} />
    <T.MeshStandardMaterial color={ARROW_COLOR} />
  </T.Mesh>
  <T.Mesh
    position={[dimX / 2 + SHAFT_HEIGHT + HEAD_HEIGHT / 2, dimY / 2, 0]}
    rotation={[0, 0, -Math.PI / 2]}
    onclick={(e) => handleArrowClick(e, onAdjustX, 1)}
    onpointerdown={(e) => startArrowDrag(onAdjustX, 'x', e)}
  >
    <T.ConeGeometry args={[HEAD_RADIUS, HEAD_HEIGHT, 8]} />
    <T.MeshStandardMaterial color={ARROW_COLOR} />
  </T.Mesh>

  <!-- -X arrow (decrease width) -->
  <T.Mesh
    position={[-dimX / 2 - SHAFT_HEIGHT / 2, dimY / 2, 0]}
    rotation={[0, 0, Math.PI / 2]}
    onclick={(e) => handleArrowClick(e, onAdjustX, -1)}
    onpointerdown={(e) => startArrowDrag(onAdjustX, 'x', e)}
  >
    <T.CylinderGeometry args={[SHAFT_RADIUS, SHAFT_RADIUS, SHAFT_HEIGHT, 8]} />
    <T.MeshStandardMaterial color={ARROW_COLOR} />
  </T.Mesh>
  <T.Mesh
    position={[-dimX / 2 - SHAFT_HEIGHT - HEAD_HEIGHT / 2, dimY / 2, 0]}
    rotation={[0, 0, Math.PI / 2]}
    onclick={(e) => handleArrowClick(e, onAdjustX, -1)}
    onpointerdown={(e) => startArrowDrag(onAdjustX, 'x', e)}
  >
    <T.ConeGeometry args={[HEAD_RADIUS, HEAD_HEIGHT, 8]} />
    <T.MeshStandardMaterial color={ARROW_COLOR} />
  </T.Mesh>

  <!-- +Y arrow (increase height) -->
  <T.Mesh
    position={[0, dimY + SHAFT_HEIGHT / 2, 0]}
    onclick={(e) => handleArrowClick(e, onAdjustY, 1)}
    onpointerdown={(e) => startArrowDrag(onAdjustY, 'y', e)}
  >
    <T.CylinderGeometry args={[SHAFT_RADIUS, SHAFT_RADIUS, SHAFT_HEIGHT, 8]} />
    <T.MeshStandardMaterial color={ARROW_COLOR} />
  </T.Mesh>
  <T.Mesh
    position={[0, dimY + SHAFT_HEIGHT + HEAD_HEIGHT / 2, 0]}
    onclick={(e) => handleArrowClick(e, onAdjustY, 1)}
    onpointerdown={(e) => startArrowDrag(onAdjustY, 'y', e)}
  >
    <T.ConeGeometry args={[HEAD_RADIUS, HEAD_HEIGHT, 8]} />
    <T.MeshStandardMaterial color={ARROW_COLOR} />
  </T.Mesh>

  <!-- -Y arrow (decrease height) -->
  <T.Mesh
    position={[0, -SHAFT_HEIGHT / 2, 0]}
    rotation={[0, 0, Math.PI]}
    onclick={(e) => handleArrowClick(e, onAdjustY, -1)}
    onpointerdown={(e) => startArrowDrag(onAdjustY, 'y', e)}
  >
    <T.CylinderGeometry args={[SHAFT_RADIUS, SHAFT_RADIUS, SHAFT_HEIGHT, 8]} />
    <T.MeshStandardMaterial color={ARROW_COLOR} />
  </T.Mesh>
  <T.Mesh
    position={[0, -SHAFT_HEIGHT - HEAD_HEIGHT / 2, 0]}
    rotation={[0, 0, Math.PI]}
    onclick={(e) => handleArrowClick(e, onAdjustY, -1)}
    onpointerdown={(e) => startArrowDrag(onAdjustY, 'y', e)}
  >
    <T.ConeGeometry args={[HEAD_RADIUS, HEAD_HEIGHT, 8]} />
    <T.MeshStandardMaterial color={ARROW_COLOR} />
  </T.Mesh>

  <!-- +Z arrow (increase depth) -->
  <T.Mesh
    position={[0, dimY / 2, dimZ / 2 + SHAFT_HEIGHT / 2]}
    rotation={[Math.PI / 2, 0, 0]}
    onclick={(e) => handleArrowClick(e, onAdjustZ, 1)}
    onpointerdown={(e) => startArrowDrag(onAdjustZ, 'x', e)}
  >
    <T.CylinderGeometry args={[SHAFT_RADIUS, SHAFT_RADIUS, SHAFT_HEIGHT, 8]} />
    <T.MeshStandardMaterial color={ARROW_COLOR} />
  </T.Mesh>
  <T.Mesh
    position={[0, dimY / 2, dimZ / 2 + SHAFT_HEIGHT + HEAD_HEIGHT / 2]}
    rotation={[Math.PI / 2, 0, 0]}
    onclick={(e) => handleArrowClick(e, onAdjustZ, 1)}
    onpointerdown={(e) => startArrowDrag(onAdjustZ, 'x', e)}
  >
    <T.ConeGeometry args={[HEAD_RADIUS, HEAD_HEIGHT, 8]} />
    <T.MeshStandardMaterial color={ARROW_COLOR} />
  </T.Mesh>

  <!-- -Z arrow (decrease depth) -->
  <T.Mesh
    position={[0, dimY / 2, -dimZ / 2 - SHAFT_HEIGHT / 2]}
    rotation={[-Math.PI / 2, 0, 0]}
    onclick={(e) => handleArrowClick(e, onAdjustZ, -1)}
    onpointerdown={(e) => startArrowDrag(onAdjustZ, 'x', e)}
  >
    <T.CylinderGeometry args={[SHAFT_RADIUS, SHAFT_RADIUS, SHAFT_HEIGHT, 8]} />
    <T.MeshStandardMaterial color={ARROW_COLOR} />
  </T.Mesh>
  <T.Mesh
    position={[0, dimY / 2, -dimZ / 2 - SHAFT_HEIGHT - HEAD_HEIGHT / 2]}
    rotation={[-Math.PI / 2, 0, 0]}
    onclick={(e) => handleArrowClick(e, onAdjustZ, -1)}
    onpointerdown={(e) => startArrowDrag(onAdjustZ, 'x', e)}
  >
    <T.ConeGeometry args={[HEAD_RADIUS, HEAD_HEIGHT, 8]} />
    <T.MeshStandardMaterial color={ARROW_COLOR} />
  </T.Mesh>
{/if}
