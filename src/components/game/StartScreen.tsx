interface StartScreenProps {
  onStart: () => void;
}

const StartScreen = ({ onStart }: StartScreenProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      {/* Animated background grid */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--primary) / 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--primary) / 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      <div className="text-center relative z-10">
        <div className="mb-4">
          <span className="font-display text-lg tracking-[0.5em] text-primary/60">
            CYBER ARENA
          </span>
        </div>

        <h1 className="game-title mb-8">
          NEON STRIKE
        </h1>

        <p className="text-xl text-muted-foreground mb-12 max-w-md mx-auto font-body">
          적 10명을 처치하고 생존하세요. <br />
          당신만이 이 아레나의 챔피언이 될 수 있습니다.
        </p>

        <button
          onClick={onStart}
          className="game-button animate-pulse-scale"
        >
          Start Game
        </button>

        <div className="mt-12 grid grid-cols-3 gap-8 max-w-lg mx-auto">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-lg bg-primary/20 flex items-center justify-center">
              <span className="text-primary text-2xl">W</span>
            </div>
            <span className="text-sm text-muted-foreground">Move</span>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-lg bg-primary/20 flex items-center justify-center">
              <span className="text-primary text-2xl">🖱️</span>
            </div>
            <span className="text-sm text-muted-foreground">Aim</span>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-lg bg-primary/20 flex items-center justify-center">
              <span className="text-primary text-xl">Click</span>
            </div>
            <span className="text-sm text-muted-foreground">Shoot</span>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-20 w-32 h-32 border border-primary/20 rotate-45" />
      <div className="absolute bottom-20 right-20 w-24 h-24 border border-secondary/20 rotate-12" />
      <div className="absolute top-1/4 right-1/4 w-4 h-4 bg-primary/40 rounded-full animate-pulse" />
      <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-secondary/40 rounded-full animate-pulse" />
    </div>
  );
};

export default StartScreen;
