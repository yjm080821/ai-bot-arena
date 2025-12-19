import { useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Vector3 } from 'three';
import Arena from './Arena';
import Player from './Player';
import EnemyComponent from './Enemy';
import HUD from './HUD';
import { Enemy, GameState, WEAPONS, WeaponType } from '@/types/game';

interface GameSceneProps {
  enemies: Enemy[];
  gameState: GameState;
  onDamageEnemy: (enemyId: string, damage: number) => void;
  onDamagePlayer: (damage: number) => void;
  onUpdateEnemyPosition: (enemyId: string, position: Vector3) => void;
  onClearEnemyHit: (enemyId: string) => void;
  onSwitchWeapon: (weapon: WeaponType) => void;
}

const GameScene = ({ 
  enemies, 
  gameState, 
  onDamageEnemy, 
  onDamagePlayer,
  onUpdateEnemyPosition,
  onClearEnemyHit,
  onSwitchWeapon,
}: GameSceneProps) => {
  const [playerPosition, setPlayerPosition] = useState(new Vector3(0, 1.7, 0));

  const handleShoot = useCallback((enemyId: string) => {
    const weapon = WEAPONS[gameState.currentWeapon];
    onDamageEnemy(enemyId, weapon.damage);
  }, [onDamageEnemy, gameState.currentWeapon]);

  const handlePlayerHit = useCallback(() => {
    onDamagePlayer(10);
  }, [onDamagePlayer]);

  return (
    <div className="w-full h-screen game-active">
      <Canvas
        shadows
        camera={{ fov: 75, near: 0.1, far: 1000 }}
        style={{ background: '#0a0f1a' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.2} />
        <directionalLight
          position={[10, 20, 10]}
          intensity={0.5}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <fog attach="fog" args={['#0a0f1a', 20, 80]} />

        {/* Game elements */}
        <Arena />
        
        <Player 
          enemies={enemies}
          onShoot={handleShoot}
          isPlaying={gameState.isPlaying && !gameState.isGameOver}
          onPositionUpdate={setPlayerPosition}
          currentWeapon={gameState.currentWeapon}
          onSwitchWeapon={onSwitchWeapon}
        />

        {enemies.map(enemy => (
          <EnemyComponent
            key={enemy.id}
            enemy={enemy}
            playerPosition={playerPosition}
            onUpdatePosition={onUpdateEnemyPosition}
            onPlayerHit={handlePlayerHit}
            onClearHit={onClearEnemyHit}
          />
        ))}
      </Canvas>

      <HUD gameState={gameState} />
    </div>
  );
};

export default GameScene;
