<script lang="ts">
  import { T, useTask } from '@threlte/core';

  let rotationX = $state(0);
  let rotationY = $state(0);

  useTask((delta) => {
    rotationX += delta * 0.3;
    rotationY += delta * 0.5;
  });
</script>

<T.AmbientLight intensity={0.6} />
<T.DirectionalLight position={[5, 5, 5]} intensity={1.2} />

<T.Mesh rotation.x={rotationX} rotation.y={rotationY}>
  <T.IcosahedronGeometry args={[1.5, 1]} />
  <T.MeshStandardMaterial color="#4ade80" metalness={0.7} roughness={0.3} />
</T.Mesh>

<T.Mesh position={[3, -1, -2]} rotation.x={rotationX * 0.5} rotation.y={rotationY * 0.7}>
  <T.OctahedronGeometry args={[0.8]} />
  <T.MeshStandardMaterial color="#818cf8" metalness={0.5} roughness={0.5} />
</T.Mesh>

<T.Mesh position={[-3, 1, -1]} rotation.x={rotationX * 0.7} rotation.y={rotationY * 0.3}>
  <T.TetrahedronGeometry args={[1.0]} />
  <T.MeshStandardMaterial color="#38bdf8" metalness={0.6} roughness={0.4} />
</T.Mesh>
