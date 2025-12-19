import { GameState } from '@/types/game';

interface GameOverScreenProps {
  gameState: GameState;
  onRestart: () => void;
}

const GameOverScreen = ({ gameState, onRestart }: GameOverScreenProps) => {
  const isVictory = gameState.enemiesKilled === gameState.totalEnemies;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md">
      <div className="text-center">
        <h1 
          className={`text-7xl font-display font-black mb-8 tracking-wider ${
            isVictory ? 'text-neon-green text-glow-cyan' : 'text-neon-red text-glow-red'
          }`}
          style={{
            textShadow: isVictory 
              ? '0 0 40px hsl(140 100% 50% / 0.8)' 
              : '0 0 40px hsl(0 100% 55% / 0.8)'
          }}
        >
          {isVictory ? 'VICTORY' : 'DEFEATED'}
        </h1>

        <div className="hud-panel p-8 mb-8 inline-block">
          <div className="grid grid-cols-2 gap-8 text-center">
            <div>
              <span className="font-display text-sm uppercase tracking-wider text-muted-foreground block mb-2">
                Enemies Eliminated
              </span>
              <span className="stat-value text-4xl text-neon-green">
                {gameState.enemiesKilled}
              </span>
            </div>
            <div>
              <span className="font-display text-sm uppercase tracking-wider text-muted-foreground block mb-2">
                Total Enemies
              </span>
              <span className="stat-value text-4xl text-primary">
                {gameState.totalEnemies}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onRestart}
          className="game-button"
        >
          Play Again
        </button>

        <p className="mt-6 text-muted-foreground font-body">
          Press the button or click anywhere to restart
        </p>
      </div>
    </div>
  );
};

export default GameOverScreen;
