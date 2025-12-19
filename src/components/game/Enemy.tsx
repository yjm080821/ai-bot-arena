import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Vector3 } from 'three';
import { Enemy as EnemyType } from '@/types/game';
import { Html } from '@react-three/drei';

interface EnemyProps {
  enemy: EnemyType;
  playerPosition: Vector3;
  onUpdatePosition: (id: string, position: Vector3) => void;
  onPlayerHit: () => void;
  onClearHit: (id: string) => void;
}

const EnemyComponent = ({ enemy, playerPosition, onUpdatePosition, onPlayerHit, onClearHit }: EnemyProps) => {
  const meshRef = useRef<Mesh>(null);
  const lastHitTime = useRef(0);
  
  const enemyColor = useMemo(() => {
    const colors = ['#ff0044', '#ff4400', '#ff0088', '#aa0044'];
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);

  // Clear hit state after flash
  useEffect(() => {
    if (enemy.isHit) {
      const timeout = setTimeout(() => {
        onClearHit(enemy.id);
      }, 150);
      return () => clearTimeout(timeout);
    }
  }, [enemy.isHit, enemy.id, onClearHit]);

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

  const healthPercentage = (enemy.health / enemy.maxHealth) * 100;
  const displayColor = enemy.isHit ? '#ffffff' : enemyColor;

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
          color={displayColor}
          emissive={displayColor}
          emissiveIntensity={enemy.isHit ? 2 : 0.5}
          metalness={0.8}
          roughness={0.2}
        />
        
        {/* Health bar - 3D billboard */}
        <Html
          position={[0, 1.5, 0]}
          center
          distanceFactor={15}
          occlude={false}
          style={{ pointerEvents: 'none' }}
        >
          <div className="w-16 flex flex-col items-center">
            {/* Health bar background */}
            <div className="w-full h-1.5 bg-black/70 rounded-full overflow-hidden border border-white/20">
              <div 
                className="h-full transition-all duration-100"
                style={{ 
                  width: `${healthPercentage}%`,
                  background: healthPercentage > 50 
                    ? 'linear-gradient(90deg, #22c55e, #4ade80)' 
                    : healthPercentage > 25 
                      ? 'linear-gradient(90deg, #eab308, #facc15)'
                      : 'linear-gradient(90deg, #ef4444, #f87171)'
                }}
              />
            </div>
            {/* Health text */}
            <span className="text-[8px] font-bold text-white drop-shadow-lg mt-0.5">
              {enemy.health}
            </span>
          </div>
        </Html>
      </mesh>
      
      {/* Eye glow */}
      <pointLight 
        position={[enemy.position.x, enemy.position.y + 0.5, enemy.position.z]}
        color={displayColor}
        intensity={enemy.isHit ? 2 : 0.5}
        distance={5}
      />
      
      {/* Hit indicator */}
      {enemy.isHit && (
        <mesh position={[enemy.position.x, enemy.position.y + 2.5, enemy.position.z]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshBasicMaterial color="#ff0000" transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  );
};

export default EnemyComponent;
