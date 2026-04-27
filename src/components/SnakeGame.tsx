import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RotateCcw, Play, Pause } from 'lucide-react';
import { Point, Direction, GameState } from '../types';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const GAME_SPEED = 150;

export function SnakeGame() {
  const [gameState, setGameState] = useState<GameState>({
    snake: INITIAL_SNAKE,
    food: { x: 5, y: 5 },
    direction: INITIAL_DIRECTION,
    score: 0,
    isGameOver: false,
    highScore: 0,
    isPaused: false,
  });

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((snake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setGameState(prev => ({
      ...prev,
      snake: INITIAL_SNAKE,
      food: generateFood(INITIAL_SNAKE),
      direction: INITIAL_DIRECTION,
      score: 0,
      isGameOver: false,
      isPaused: false,
    }));
  };

  const moveSnake = useCallback(() => {
    if (gameState.isGameOver || gameState.isPaused) return;

    setGameState(prev => {
      const head = prev.snake[0];
      const newHead = { ...head };

      switch (prev.direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Check collisions
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE ||
        prev.snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        return {
          ...prev,
          isGameOver: true,
          highScore: Math.max(prev.highScore, prev.score),
        };
      }

      const newSnake = [newHead, ...prev.snake];
      let newScore = prev.score;
      let newFood = prev.food;

      // Check food
      if (newHead.x === prev.food.x && newHead.y === prev.food.y) {
        newScore += 10;
        newFood = generateFood(newSnake);
      } else {
        newSnake.pop();
      }

      return {
        ...prev,
        snake: newSnake,
        food: newFood,
        score: newScore,
      };
    });
  }, [gameState.isGameOver, gameState.isPaused, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          setGameState(prev => prev.direction !== 'DOWN' ? { ...prev, direction: 'UP' } : prev);
          break;
        case 'ArrowDown':
          setGameState(prev => prev.direction !== 'UP' ? { ...prev, direction: 'DOWN' } : prev);
          break;
        case 'ArrowLeft':
          setGameState(prev => prev.direction !== 'RIGHT' ? { ...prev, direction: 'LEFT' } : prev);
          break;
        case 'ArrowRight':
          setGameState(prev => prev.direction !== 'LEFT' ? { ...prev, direction: 'RIGHT' } : prev);
          break;
        case ' ': // Space to pause
          setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!gameState.isGameOver && !gameState.isPaused) {
      gameLoopRef.current = setInterval(moveSnake, GAME_SPEED);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameState.isGameOver, gameState.isPaused, moveSnake]);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-black/40 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl">
      <div className="flex justify-between w-64 mb-6 px-2">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest text-white/40 font-mono">Score</span>
          <span className="text-2xl font-bold text-cyan-400 font-mono drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
            {gameState.score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-widest text-white/40 font-mono">Best</span>
          <span className="text-2xl font-bold text-magenta-400 font-mono drop-shadow-[0_0_8px_rgba(232,23,171,0.5)]">
            {gameState.highScore.toString().padStart(4, '0')}
          </span>
        </div>
      </div>

      <div 
        className="relative bg-zinc-900 border-2 border-white/5 rounded-xl overflow-hidden shadow-inner"
        style={{ 
          width: GRID_SIZE * 20, 
          height: GRID_SIZE * 20,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        {/* Snake Grid Background */}
        <div className="absolute inset-0 opacity-10" 
          style={{ 
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }} 
        />

        {/* Snake Segments */}
        {gameState.snake.map((segment, i) => (
          <motion.div
            key={`${segment.x}-${segment.y}-${i}`}
            layoutId={i === 0 ? 'head' : `segment-${i}`}
            className="absolute rounded-sm"
            style={{
              width: 18,
              height: 18,
              left: segment.x * 20 + 1,
              top: segment.y * 20 + 1,
              backgroundColor: i === 0 ? '#22d3ee' : '#0891b2',
              boxShadow: i === 0 ? '0 0 10px #22d3ee' : 'none',
              zIndex: 10,
            }}
          />
        ))}

        {/* Food */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
          className="absolute bg-magenta-500 rounded-full shadow-[0_0_12px_#e817ab]"
          style={{
            width: 14,
            height: 14,
            left: gameState.food.x * 20 + 3,
            top: gameState.food.y * 20 + 3,
            zIndex: 5,
          }}
        />

        {/* Game Over / Pause Overlay */}
        <AnimatePresence>
          {(gameState.isGameOver || gameState.isPaused) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm"
            >
              {gameState.isGameOver ? (
                <>
                  <Trophy className="w-16 h-16 text-magenta-500 mb-4 animate-bounce" />
                  <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2 italic">Game Over</h2>
                  <p className="text-white/60 mb-6 font-mono">Final Score: {gameState.score}</p>
                  <button
                    onClick={resetGame}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold uppercase tracking-widest rounded-full hover:bg-magenta-500 hover:text-white transition-all transform hover:scale-105"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Retry
                  </button>
                </>
              ) : (
                <>
                  <Pause className="w-16 h-16 text-cyan-400 mb-4" />
                  <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-6 italic">Paused</h2>
                  <button
                    onClick={() => setGameState(prev => ({ ...prev, isPaused: false }))}
                    className="flex items-center gap-2 px-8 py-3 bg-cyan-500 text-white font-bold uppercase tracking-widest rounded-full hover:bg-cyan-400 transition-all transform hover:scale-105"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Resume
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 text-center">
        <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-mono mb-2">Controls</p>
        <div className="flex gap-4 text-[10px] text-white/50 font-mono">
          <span>ARROWS: MOVE</span>
          <span>SPACE: PAUSE</span>
        </div>
      </div>
    </div>
  );
}
