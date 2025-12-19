import { Vector3 } from 'three';

export type WeaponType = 'rifle' | 'sniper';

export interface Weapon {
  type: WeaponType;
  name: string;
  damage: number;
  fireRate: number; // shots per second
  bulletSpeed: number;
  bulletColor: string;
}

export interface Bullet {
  id: string;
  position: Vector3;
  direction: Vector3;
  speed: number;
  color: string;
  createdAt: number;
}

export interface Enemy {
  id: string;
  position: Vector3;
  health: number;
  maxHealth: number;
  isAlive: boolean;
  targetPosition: Vector3;
  speed: number;
  isHit: boolean;
  hitTime: number;
}

export interface GameState {
  isPlaying: boolean;
  isGameOver: boolean;
  playerHealth: number;
  enemiesKilled: number;
  totalEnemies: number;
  wave: number;
  currentWeapon: WeaponType;
}

export interface PlayerState {
  position: Vector3;
  rotation: { x: number; y: number };
  health: number;
}

export const WEAPONS: Record<WeaponType, Weapon> = {
  rifle: {
    type: 'rifle',
    name: 'Assault Rifle',
    damage: 25,
    fireRate: 5,
    bulletSpeed: 80,
    bulletColor: '#00ffff',
  },
  sniper: {
    type: 'sniper',
    name: 'Sniper Rifle',
    damage: 100,
    fireRate: 0.8,
    bulletSpeed: 150,
    bulletColor: '#ff00ff',
  },
};
