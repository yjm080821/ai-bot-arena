import { useRef } from 'react';
import { Mesh } from 'three';

const Arena = () => {
  const floorRef = useRef<Mesh>(null);

  return (
    <group>
      {/* Floor */}
      <mesh 
        ref={floorRef} 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
          color="#0a1628"
          metalness={0.8}
          roughness={0.4}
        />
      </mesh>

      {/* Grid lines */}
      <gridHelper 
        args={[100, 50, '#00ffff', '#003344']} 
        position={[0, 0.01, 0]}
      />

      {/* Walls */}
      {[
        { pos: [0, 5, -50] as [number, number, number], rot: [0, 0, 0] as [number, number, number] },
        { pos: [0, 5, 50] as [number, number, number], rot: [0, Math.PI, 0] as [number, number, number] },
        { pos: [-50, 5, 0] as [number, number, number], rot: [0, Math.PI / 2, 0] as [number, number, number] },
        { pos: [50, 5, 0] as [number, number, number], rot: [0, -Math.PI / 2, 0] as [number, number, number] },
      ].map((wall, i) => (
        <mesh key={i} position={wall.pos} rotation={wall.rot}>
          <boxGeometry args={[100, 10, 1]} />
          <meshStandardMaterial 
            color="#0f1f3a"
            emissive="#00ffff"
            emissiveIntensity={0.05}
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
      ))}

      {/* Pillars */}
      {[
        [-20, 0, -20], [20, 0, -20], [-20, 0, 20], [20, 0, 20],
        [-35, 0, 0], [35, 0, 0], [0, 0, -35], [0, 0, 35],
      ].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh position={[0, 4, 0]} castShadow>
            <cylinderGeometry args={[1.5, 2, 8, 8]} />
            <meshStandardMaterial 
              color="#1a2a4a"
              emissive="#00ffff"
              emissiveIntensity={0.1}
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
          {/* Glowing ring */}
          <mesh position={[0, 7, 0]}>
            <torusGeometry args={[1.8, 0.1, 8, 16]} />
            <meshStandardMaterial 
              color="#00ffff"
              emissive="#00ffff"
              emissiveIntensity={2}
            />
          </mesh>
        </group>
      ))}

      {/* Ambient lighting elements */}
      <pointLight position={[0, 20, 0]} intensity={0.5} color="#00ffff" />
      {[
        [-30, 8, -30], [30, 8, -30], [-30, 8, 30], [30, 8, 30]
      ].map((pos, i) => (
        <pointLight 
          key={i} 
          position={pos as [number, number, number]} 
          intensity={0.3} 
          color="#ff00aa" 
          distance={30}
        />
      ))}
    </group>
  );
};

export default Arena;
