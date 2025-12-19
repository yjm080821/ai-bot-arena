import { Vector3 } from 'three';

export interface Enemy {
  id: string;
  position: Vector3;
  health: number;
  isAlive: boolean;
  targetPosition: Vector3;
  speed: number;
}

export interface GameState {
  isPlaying: boolean;
  isGameOver: boolean;
  playerHealth: number;
  enemiesKilled: number;
  totalEnemies: number;
  wave: number;
}

export interface PlayerState {
  position: Vector3;
  rotation: { x: number; y: number };
  health: number;
}
