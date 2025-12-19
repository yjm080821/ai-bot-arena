import { useState, useCallback } from 'react';
import { Vector3 } from 'three';
import { Enemy, GameState } from '@/types/game';

const TOTAL_ENEMIES = 10;
const ARENA_SIZE = 40;

const generateRandomPosition = (): Vector3 => {
  const angle = Math.random() * Math.PI * 2;
  const distance = 15 + Math.random() * 20;
  return new Vector3(
    Math.cos(angle) * distance,
    1,
    Math.sin(angle) * distance
  );
};

const createEnemy = (id: string): Enemy => ({
  id,
  position: generateRandomPosition(),
  health: 100,
  isAlive: true,
  targetPosition: new Vector3(0, 1, 0),
  speed: 2 + Math.random() * 2,
});

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    isGameOver: false,
    playerHealth: 100,
    enemiesKilled: 0,
    totalEnemies: TOTAL_ENEMIES,
    wave: 1,
  });

  const [enemies, setEnemies] = useState<Enemy[]>([]);

  const startGame = useCallback(() => {
    const newEnemies = Array.from({ length: TOTAL_ENEMIES }, (_, i) => 
      createEnemy(`enemy-${i}`)
    );
    setEnemies(newEnemies);
    setGameState({
      isPlaying: true,
      isGameOver: false,
      playerHealth: 100,
      enemiesKilled: 0,
      totalEnemies: TOTAL_ENEMIES,
      wave: 1,
    });
  }, []);

  const damageEnemy = useCallback((enemyId: string, damage: number) => {
    setEnemies(prev => {
      const updated = prev.map(enemy => {
        if (enemy.id === enemyId && enemy.isAlive) {
          const newHealth = enemy.health - damage;
          if (newHealth <= 0) {
            setGameState(gs => ({
              ...gs,
              enemiesKilled: gs.enemiesKilled + 1,
            }));
            return { ...enemy, health: 0, isAlive: false };
          }
          return { ...enemy, health: newHealth };
        }
        return enemy;
      });
      
      // Check if all enemies are dead
      const allDead = updated.every(e => !e.isAlive);
      if (allDead) {
        setTimeout(() => {
          setGameState(gs => ({ ...gs, isGameOver: true }));
        }, 1000);
      }
      
      return updated;
    });
  }, []);

  const damagePlayer = useCallback((damage: number) => {
    setGameState(prev => {
      const newHealth = Math.max(0, prev.playerHealth - damage);
      if (newHealth <= 0) {
        return { ...prev, playerHealth: 0, isGameOver: true };
      }
      return { ...prev, playerHealth: newHealth };
    });
  }, []);

  const updateEnemyPosition = useCallback((enemyId: string, newPosition: Vector3) => {
    setEnemies(prev => prev.map(enemy => 
      enemy.id === enemyId ? { ...enemy, position: newPosition.clone() } : enemy
    ));
  }, []);

  return {
    gameState,
    enemies,
    startGame,
    damageEnemy,
    damagePlayer,
    updateEnemyPosition,
  };
};
