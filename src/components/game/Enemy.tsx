import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Vector3 } from 'three';
import { Enemy as EnemyType } from '@/types/game';

interface EnemyProps {
  enemy: EnemyType;
  playerPosition: Vector3;
  onUpdatePosition: (id: string, position: Vector3) => void;
  onPlayerHit: () => void;
}

const EnemyComponent = ({ enemy, playerPosition, onUpdatePosition, onPlayerHit }: EnemyProps) => {
  const meshRef = useRef<Mesh>(null);
  const lastHitTime = useRef(0);
  
  const enemyColor = useMemo(() => {
    const colors = ['#ff0044', '#ff4400', '#ff0088', '#aa0044'];
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current || !enemy.isAlive) return;

    // Move towards player
    const direction = new Vector3()
      .subVectors(playerPosition, enemy.position)
      .normalize();
    
    const newPosition = enemy.position.clone().add(
      direction.multiplyScalar(enemy.speed * delta)
    );
    
    // Keep above ground
    newPosition.y = 1;
    
    // Update mesh position
    meshRef.current.position.copy(newPosition);
    
    // Look at player
    meshRef.current.lookAt(playerPosition.x, 1, playerPosition.z);
    
    // Update state
    onUpdatePosition(enemy.id, newPosition);

    // Check collision with player
    const distanceToPlayer = newPosition.distanceTo(playerPosition);
    const currentTime = state.clock.getElapsedTime();
    
    if (distanceToPlayer < 2 && currentTime - lastHitTime.current > 1) {
      lastHitTime.current = currentTime;
      onPlayerHit();
    }

    // Hover animation
    meshRef.current.position.y = 1 + Math.sin(state.clock.getElapsedTime() * 3 + parseInt(enemy.id.split('-')[1])) * 0.1;
  });

  if (!enemy.isAlive) return null;

  return (
    <group>
      <mesh 
        ref={meshRef} 
        position={[enemy.position.x, enemy.position.y, enemy.position.z]}
        castShadow
      >
        {/* Body */}
        <boxGeometry args={[1.2, 1.8, 0.8]} />
        <meshStandardMaterial 
          color={enemyColor}
          emissive={enemyColor}
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Eye glow */}
      <pointLight 
        position={[enemy.position.x, enemy.position.y + 0.5, enemy.position.z]}
        color={enemyColor}
        intensity={0.5}
        distance={5}
      />
    </group>
  );
};

export default EnemyComponent;
