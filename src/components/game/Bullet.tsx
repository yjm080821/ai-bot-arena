import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Vector3 } from 'three';
import { Bullet as BulletType } from '@/types/game';

interface BulletProps {
  bullet: BulletType;
  onRemove: (id: string) => void;
  onHitEnemy: (bulletId: string, enemyPosition: Vector3, enemyId: string) => void;
  enemies: Array<{ id: string; position: Vector3; isAlive: boolean }>;
}

const BULLET_MAX_DISTANCE = 200;

const BulletComponent = ({ bullet, onRemove, onHitEnemy, enemies }: BulletProps) => {
  const meshRef = useRef<Mesh>(null);
  const distanceTraveled = useRef(0);
  const startPosition = useRef(bullet.position.clone());

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // Move bullet
    const movement = bullet.direction.clone().multiplyScalar(bullet.speed * delta);
    meshRef.current.position.add(movement);
    distanceTraveled.current += movement.length();

    // Check collision with enemies
    const bulletPos = meshRef.current.position;
    for (const enemy of enemies) {
      if (!enemy.isAlive) continue;
      
      const distance = bulletPos.distanceTo(enemy.position);
      if (distance < 1.5) {
        onHitEnemy(bullet.id, enemy.position, enemy.id);
        return;
      }
    }

    // Remove bullet if too far
    if (distanceTraveled.current > BULLET_MAX_DISTANCE) {
      onRemove(bullet.id);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={[bullet.position.x, bullet.position.y, bullet.position.z]}
    >
      <sphereGeometry args={[0.08, 8, 8]} />
      <meshBasicMaterial color={bullet.color} />
      {/* Bullet trail glow */}
      <pointLight
        color={bullet.color}
        intensity={1}
        distance={3}
      />
    </mesh>
  );
};

export default BulletComponent;
