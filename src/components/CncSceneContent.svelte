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
</script>

<T.PerspectiveCamera makeDefault position={[8, 6, 8]} fov={45}>
  <OrbitControls enableDamping dampingFactor={0.05} />
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
    onclick={(e) => { e.stopPropagation(); onAdjustX?.(1); }}
  >
    <T.CylinderGeometry args={[SHAFT_RADIUS, SHAFT_RADIUS, SHAFT_HEIGHT, 8]} />
    <T.MeshStandardMaterial color={ARROW_COLOR} />
  </T.Mesh>
  <T.Mesh
    position={[dimX / 2 + SHAFT_HEIGHT + HEAD_HEIGHT / 2, dimY / 2, 0]}
    rotation={[0, 0, -Math.PI / 2]}
    onclick={(e) => { e.stopPropagation(); onAdjustX?.(1); }}
  >
    <T.ConeGeometry args={[HEAD_RADIUS, HEAD_HEIGHT, 8]} />
    <T.MeshStandardMaterial color={ARROW_COLOR} />
  </T.Mesh>

  <!-- -X arrow (decrease width) -->
  <T.Mesh
    position={[-dimX / 2 - SHAFT_HEIGHT / 2, dimY / 2, 0]}
    rotation={[0, 0, Math.PI / 2]}
    onclick={(e) => { e.stopPropagation(); onAdjustX?.(-1); }}
  >
    <T.CylinderGeometry args={[SHAFT_RADIUS, SHAFT_RADIUS, SHAFT_HEIGHT, 8]} />
    <T.MeshStandardMaterial color={ARROW_COLOR} />
  </T.Mesh>
  <T.Mesh
    position={[-dimX / 2 - SHAFT_HEIGHT - HEAD_HEIGHT / 2, dimY / 2, 0]}
    rotation={[0, 0, Math.PI / 2]}
    onclick={(e) => { e.stopPropagation(); onAdjustX?.(-1); }}
  >
    <T.ConeGeometry args={[HEAD_RADIUS, HEAD_HEIGHT, 8]} />
    <T.MeshStandardMaterial color={ARROW_COLOR} />
  </T.Mesh>

  <!-- +Y arrow (increase height) -->
  <T.Mesh
    position={[0, dimY + SHAFT_HEIGHT / 2, 0]}
    onclick={(e) => { e.stopPropagation(); onAdjustY?.(1); }}
  >
    <T.CylinderGeometry args={[SHAFT_RADIUS, SHAFT_RADIUS, SHAFT_HEIGHT, 8]} />
    <T.MeshStandardMaterial color={ARROW_COLOR} />
  </T.Mesh>
  <T.Mesh
    position={[0, dimY + SHAFT_HEIGHT + HEAD_HEIGHT / 2, 0]}
    onclick={(e) => { e.stopPropagation(); onAdjustY?.(1); }}
  >
    <T.ConeGeometry args={[HEAD_RADIUS, HEAD_HEIGHT, 8]} />
    <T.MeshStandardMaterial color={ARROW_COLOR} />
  </T.Mesh>

  <!-- -Y arrow (decrease height) -->
  <T.Mesh
    position={[0, -SHAFT_HEIGHT / 2, 0]}
    rotation={[0, 0, Math.PI]}
    onclick={(e) => { e.stopPropagation(); onAdjustY?.(-1); }}
  >
    <T.CylinderGeometry args={[SHAFT_RADIUS, SHAFT_RADIUS, SHAFT_HEIGHT, 8]} />
    <T.MeshStandardMaterial color={ARROW_COLOR} />
  </T.Mesh>
  <T.Mesh
    position={[0, -SHAFT_HEIGHT - HEAD_HEIGHT / 2, 0]}
    rotation={[0, 0, Math.PI]}
    onclick={(e) => { e.stopPropagation(); onAdjustY?.(-1); }}
  >
    <T.ConeGeometry args={[HEAD_RADIUS, HEAD_HEIGHT, 8]} />
    <T.MeshStandardMaterial color={ARROW_COLOR} />
  </T.Mesh>

  <!-- +Z arrow (increase depth) -->
  <T.Mesh
    position={[0, dimY / 2, dimZ / 2 + SHAFT_HEIGHT / 2]}
    rotation={[Math.PI / 2, 0, 0]}
    onclick={(e) => { e.stopPropagation(); onAdjustZ?.(1); }}
  >
    <T.CylinderGeometry args={[SHAFT_RADIUS, SHAFT_RADIUS, SHAFT_HEIGHT, 8]} />
    <T.MeshStandardMaterial color={ARROW_COLOR} />
  </T.Mesh>
  <T.Mesh
    position={[0, dimY / 2, dimZ / 2 + SHAFT_HEIGHT + HEAD_HEIGHT / 2]}
    rotation={[Math.PI / 2, 0, 0]}
    onclick={(e) => { e.stopPropagation(); onAdjustZ?.(1); }}
  >
    <T.ConeGeometry args={[HEAD_RADIUS, HEAD_HEIGHT, 8]} />
    <T.MeshStandardMaterial color={ARROW_COLOR} />
  </T.Mesh>

  <!-- -Z arrow (decrease depth) -->
  <T.Mesh
    position={[0, dimY / 2, -dimZ / 2 - SHAFT_HEIGHT / 2]}
    rotation={[-Math.PI / 2, 0, 0]}
    onclick={(e) => { e.stopPropagation(); onAdjustZ?.(-1); }}
  >
    <T.CylinderGeometry args={[SHAFT_RADIUS, SHAFT_RADIUS, SHAFT_HEIGHT, 8]} />
    <T.MeshStandardMaterial color={ARROW_COLOR} />
  </T.Mesh>
  <T.Mesh
    position={[0, dimY / 2, -dimZ / 2 - SHAFT_HEIGHT - HEAD_HEIGHT / 2]}
    rotation={[-Math.PI / 2, 0, 0]}
    onclick={(e) => { e.stopPropagation(); onAdjustZ?.(-1); }}
  >
    <T.ConeGeometry args={[HEAD_RADIUS, HEAD_HEIGHT, 8]} />
    <T.MeshStandardMaterial color={ARROW_COLOR} />
  </T.Mesh>
{/if}
