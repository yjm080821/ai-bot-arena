import { useCallback } from 'react';
import StartScreen from '@/components/game/StartScreen';
import GameScene from '@/components/game/GameScene';
import GameOverScreen from '@/components/game/GameOverScreen';
import { useGameState } from '@/hooks/useGameState';

const Index = () => {
  const {
    gameState,
    enemies,
    startGame,
    damageEnemy,
    damagePlayer,
    updateEnemyPosition,
  } = useGameState();

  const handleStart = useCallback(() => {
    startGame();
  }, [startGame]);

  const handleRestart = useCallback(() => {
    startGame();
  }, [startGame]);

  return (
    <main className="w-full h-screen overflow-hidden bg-background">
      {/* SEO */}
      <title>Neon Strike - Cyber Arena FPS Game</title>
      <meta name="description" content="웹 기반 3D 슈팅 게임. 사이버 아레나에서 AI 적들과 전투하세요." />

      {!gameState.isPlaying && !gameState.isGameOver && (
        <StartScreen onStart={handleStart} />
      )}

      {gameState.isPlaying && (
        <GameScene
          enemies={enemies}
          gameState={gameState}
          onDamageEnemy={damageEnemy}
          onDamagePlayer={damagePlayer}
          onUpdateEnemyPosition={updateEnemyPosition}
        />
      )}

      {gameState.isGameOver && (
        <GameOverScreen 
          gameState={gameState} 
          onRestart={handleRestart}
        />
      )}
    </main>
  );
};

export default Index;
