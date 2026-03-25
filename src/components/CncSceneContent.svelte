<script lang="ts">
  import { T } from '@threlte/core';
  import { OrbitControls } from '@threlte/extras';

  interface Props {
    dimX: number;
    dimY: number;
    dimZ: number;
  }

  let { dimX, dimY, dimZ }: Props = $props();

  const GRID_SIZE = 20;
  const GRID_DIVISIONS = 20;
  const GRID_COLOR_PRIMARY = '#374151';
  const GRID_COLOR_SECONDARY = '#1f2937';
</script>

<T.PerspectiveCamera makeDefault position={[8, 6, 8]} fov={45}>
  <OrbitControls enableDamping dampingFactor={0.05} />
</T.PerspectiveCamera>

<T.AmbientLight intensity={0.5} />
<T.DirectionalLight position={[5, 10, 5]} intensity={1.2} castShadow />

<!-- Floor grid -->
<T.GridHelper args={[GRID_SIZE, GRID_DIVISIONS, GRID_COLOR_PRIMARY, GRID_COLOR_SECONDARY]} position={[0, 0, 0]} />

<!-- Rectangle box -->
<T.Mesh position={[0, dimY / 2, 0]} castShadow receiveShadow>
  <T.BoxGeometry args={[dimX, dimY, dimZ]} />
  <T.MeshStandardMaterial color="#4ade80" metalness={0.3} roughness={0.5} />
</T.Mesh>

<!-- Wireframe overlay to show the grid on the rectangle -->
<T.Mesh position={[0, dimY / 2, 0]}>
  <T.BoxGeometry args={[dimX, dimY, dimZ]} />
  <T.MeshBasicMaterial color="#166534" wireframe />
</T.Mesh>
