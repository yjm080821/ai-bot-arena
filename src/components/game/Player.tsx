import { useRef, useEffect, useCallback, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3, Raycaster, Vector2 } from 'three';
import { PointerLockControls } from '@react-three/drei';
import { Bullet, WEAPONS, WeaponType } from '@/types/game';
import BulletComponent from './Bullet';

interface PlayerProps {
  enemies: Array<{ id: string; position: Vector3; isAlive: boolean }>;
  onShoot: (enemyId: string) => void;
  isPlaying: boolean;
  onPositionUpdate: (position: Vector3) => void;
  currentWeapon: WeaponType;
  onSwitchWeapon: (weapon: WeaponType) => void;
}

const Player = ({ enemies, onShoot, isPlaying, onPositionUpdate, currentWeapon, onSwitchWeapon }: PlayerProps) => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const velocity = useRef(new Vector3());
  const moveState = useRef({ forward: false, backward: false, left: false, right: false });
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const lastShotTime = useRef(0);
  
  const MOVE_SPEED = 15;
  const ARENA_BOUNDS = 45;

  const weapon = WEAPONS[currentWeapon];

  useEffect(() => {
    camera.position.set(0, 1.7, 0);
  }, [camera]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.code) {
      case 'KeyW': moveState.current.forward = true; break;
      case 'KeyS': moveState.current.backward = true; break;
      case 'KeyA': moveState.current.left = true; break;
      case 'KeyD': moveState.current.right = true; break;
      case 'Digit1': onSwitchWeapon('rifle'); break;
      case 'Digit2': onSwitchWeapon('sniper'); break;
    }
  }, [onSwitchWeapon]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    switch (e.code) {
      case 'KeyW': moveState.current.forward = false; break;
      case 'KeyS': moveState.current.backward = false; break;
      case 'KeyA': moveState.current.left = false; break;
      case 'KeyD': moveState.current.right = false; break;
    }
  }, []);

  const handleClick = useCallback(() => {
    if (!isPlaying) return;

    const now = Date.now();
    const fireInterval = 1000 / weapon.fireRate;
    
    if (now - lastShotTime.current < fireInterval) return;
    lastShotTime.current = now;

    // Get camera direction
    const direction = new Vector3();
    camera.getWorldDirection(direction);

    // Create bullet
    const bulletId = `bullet-${Date.now()}-${Math.random()}`;
    const bulletPosition = camera.position.clone().add(direction.clone().multiplyScalar(0.5));
    
    const newBullet: Bullet = {
      id: bulletId,
      position: bulletPosition,
      direction: direction.clone(),
      speed: weapon.bulletSpeed,
      color: weapon.bulletColor,
      createdAt: now,
    };

    setBullets(prev => [...prev, newBullet]);
  }, [camera, isPlaying, weapon]);

  const handleBulletRemove = useCallback((bulletId: string) => {
    setBullets(prev => prev.filter(b => b.id !== bulletId));
  }, []);

  const handleBulletHitEnemy = useCallback((bulletId: string, _enemyPosition: Vector3, enemyId: string) => {
    setBullets(prev => prev.filter(b => b.id !== bulletId));
    onShoot(enemyId);
  }, [onShoot]);

  useEffect(() => {
    if (isPlaying) {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      window.addEventListener('click', handleClick);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('click', handleClick);
    };
  }, [handleKeyDown, handleKeyUp, handleClick, isPlaying]);

  useFrame((_, delta) => {
    if (!isPlaying || !controlsRef.current?.isLocked) return;

    // Calculate movement direction
    const direction = new Vector3();
    
    if (moveState.current.forward) direction.z -= 1;
    if (moveState.current.backward) direction.z += 1;
    if (moveState.current.left) direction.x -= 1;
    if (moveState.current.right) direction.x += 1;

    direction.normalize();

    // Apply movement relative to camera direction
    if (direction.length() > 0) {
      const cameraDirection = new Vector3();
      camera.getWorldDirection(cameraDirection);
      cameraDirection.y = 0;
      cameraDirection.normalize();

      const right = new Vector3();
      right.crossVectors(cameraDirection, new Vector3(0, 1, 0));

      velocity.current.set(0, 0, 0);
      velocity.current.add(cameraDirection.multiplyScalar(-direction.z));
      velocity.current.add(right.multiplyScalar(direction.x));
      velocity.current.normalize().multiplyScalar(MOVE_SPEED * delta);

      camera.position.add(velocity.current);
    }

    // Clamp to arena bounds
    camera.position.x = Math.max(-ARENA_BOUNDS, Math.min(ARENA_BOUNDS, camera.position.x));
    camera.position.z = Math.max(-ARENA_BOUNDS, Math.min(ARENA_BOUNDS, camera.position.z));
    camera.position.y = 1.7;

    onPositionUpdate(camera.position.clone());
  });

  return (
    <>
      <PointerLockControls ref={controlsRef} />
      
      {/* Render bullets */}
      {bullets.map(bullet => (
        <BulletComponent
          key={bullet.id}
          bullet={bullet}
          onRemove={handleBulletRemove}
          onHitEnemy={handleBulletHitEnemy}
          enemies={enemies}
        />
      ))}
    </>
  );
};

export default Player;
