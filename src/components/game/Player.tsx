import { useRef, useEffect, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3, Raycaster, Mesh, Vector2 } from 'three';
import { PointerLockControls } from '@react-three/drei';
import { Enemy } from '@/types/game';

interface PlayerProps {
  enemies: Enemy[];
  onShoot: (enemyId: string) => void;
  isPlaying: boolean;
  onPositionUpdate: (position: Vector3) => void;
}

const Player = ({ enemies, onShoot, isPlaying, onPositionUpdate }: PlayerProps) => {
  const { camera, scene } = useThree();
  const controlsRef = useRef<any>(null);
  const velocity = useRef(new Vector3());
  const moveState = useRef({ forward: false, backward: false, left: false, right: false });
  const raycaster = useRef(new Raycaster());
  
  const MOVE_SPEED = 15;
  const ARENA_BOUNDS = 45;

  useEffect(() => {
    camera.position.set(0, 1.7, 0);
  }, [camera]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.code) {
      case 'KeyW': moveState.current.forward = true; break;
      case 'KeyS': moveState.current.backward = true; break;
      case 'KeyA': moveState.current.left = true; break;
      case 'KeyD': moveState.current.right = true; break;
    }
  }, []);

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

    // Cast ray from camera center
    raycaster.current.setFromCamera(new Vector2(0, 0), camera);
    
    // Find all enemy meshes
    const enemyMeshes: Mesh[] = [];
    scene.traverse((object) => {
      if (object instanceof Mesh && object.geometry.type === 'BoxGeometry') {
        const params = (object.geometry.parameters as any);
        if (params.width === 1.2 && params.height === 1.8) {
          enemyMeshes.push(object);
        }
      }
    });

    const intersects = raycaster.current.intersectObjects(enemyMeshes, false);
    
    if (intersects.length > 0) {
      const hitMesh = intersects[0].object;
      // Find which enemy was hit based on position
      enemies.forEach(enemy => {
        if (enemy.isAlive) {
          const dist = new Vector3(
            hitMesh.position.x,
            hitMesh.position.y,
            hitMesh.position.z
          ).distanceTo(enemy.position);
          if (dist < 2) {
            onShoot(enemy.id);
          }
        }
      });
    }
  }, [camera, scene, enemies, onShoot, isPlaying]);

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
    </>
  );
};

export default Player;
