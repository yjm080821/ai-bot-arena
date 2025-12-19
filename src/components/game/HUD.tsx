import { GameState, WEAPONS } from '@/types/game';

interface HUDProps {
  gameState: GameState;
}

const HUD = ({ gameState }: HUDProps) => {
  const healthPercentage = (gameState.playerHealth / 100) * 100;
  const isLowHealth = gameState.playerHealth <= 30;
  const currentWeapon = WEAPONS[gameState.currentWeapon];

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {/* Crosshair */}
      <div className="crosshair">
        <div className="w-6 h-0.5 bg-primary absolute left-1/2 -translate-x-1/2" />
        <div className="w-0.5 h-6 bg-primary absolute top-1/2 -translate-y-1/2" />
        <div className="w-2 h-2 border-2 border-primary rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Health Bar */}
      <div className="absolute bottom-8 left-8 w-72">
        <div className="hud-panel p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-display text-sm uppercase tracking-wider text-primary">
              Health
            </span>
            <span className={`stat-value ${isLowHealth ? 'text-neon-red text-glow-red' : 'text-primary'}`}>
              {gameState.playerHealth}
            </span>
          </div>
          <div className="health-bar">
            <div 
              className={`health-bar-fill ${isLowHealth ? 'low' : ''}`}
              style={{ width: `${healthPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Weapon Display */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="hud-panel p-4">
          <div className="flex gap-4">
            {/* Rifle */}
            <div 
              className={`px-4 py-2 rounded border-2 transition-all ${
                gameState.currentWeapon === 'rifle' 
                  ? 'border-primary bg-primary/20 text-primary' 
                  : 'border-muted-foreground/30 text-muted-foreground'
              }`}
            >
              <div className="text-xs font-bold mb-1">1</div>
              <div className="font-display text-sm uppercase tracking-wider">
                Rifle
              </div>
              <div className="text-xs opacity-70">
                DMG: {WEAPONS.rifle.damage}
              </div>
            </div>
            
            {/* Sniper */}
            <div 
              className={`px-4 py-2 rounded border-2 transition-all ${
                gameState.currentWeapon === 'sniper' 
                  ? 'border-neon-pink bg-neon-pink/20 text-neon-pink' 
                  : 'border-muted-foreground/30 text-muted-foreground'
              }`}
            >
              <div className="text-xs font-bold mb-1">2</div>
              <div className="font-display text-sm uppercase tracking-wider">
                Sniper
              </div>
              <div className="text-xs opacity-70">
                DMG: {WEAPONS.sniper.damage}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enemy Counter */}
      <div className="absolute bottom-8 right-8">
        <div className="hud-panel p-4">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <span className="font-display text-xs uppercase tracking-wider text-muted-foreground block">
                Eliminated
              </span>
              <span className="stat-value text-neon-green">
                {gameState.enemiesKilled}
              </span>
            </div>
            <div className="w-px h-12 bg-primary/30" />
            <div className="text-center">
              <span className="font-display text-xs uppercase tracking-wider text-muted-foreground block">
                Remaining
              </span>
              <span className="stat-value text-neon-red">
                {gameState.totalEnemies - gameState.enemiesKilled}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2">
        <div className="hud-panel px-6 py-2">
          <span className="font-body text-sm text-muted-foreground">
            WASD 이동 • 클릭 사격 • 1/2 무기 교체 • ESC 일시정지
          </span>
        </div>
      </div>

      {/* Current Weapon Indicator */}
      <div className="absolute top-8 right-8">
        <div 
          className="hud-panel px-4 py-2"
          style={{ 
            borderColor: gameState.currentWeapon === 'rifle' ? '#00ffff' : '#ff00ff',
            boxShadow: `0 0 15px ${gameState.currentWeapon === 'rifle' ? '#00ffff33' : '#ff00ff33'}`
          }}
        >
          <span 
            className="font-display text-lg uppercase tracking-wider"
            style={{ color: gameState.currentWeapon === 'rifle' ? '#00ffff' : '#ff00ff' }}
          >
            {currentWeapon.name}
          </span>
        </div>
      </div>

      {/* Damage overlay */}
      {isLowHealth && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, transparent 30%, hsla(0, 100%, 50%, ${(30 - gameState.playerHealth) / 100}) 100%)`,
          }}
        />
      )}
    </div>
  );
};

export default HUD;
