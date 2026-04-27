import { motion } from 'motion/react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { Terminal, Gamepad2, Headphones, Activity } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]" 
          style={{ 
            backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} 
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-magenta-500/5 blur-[120px] rounded-full" />
      </div>

      {/* Navigation / Header Area */}
      <header className="relative z-10 border-b border-white/5 py-6 px-10 flex items-center justify-between backdrop-blur-sm bg-black/20">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <Gamepad2 className="text-black" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display uppercase tracking-tighter leading-none">Neon Synth</h1>
            <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-mono font-bold">Arcade & Audio Engine</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: 'System', icon: Terminal, active: true },
            { label: 'Audio', icon: Headphones, active: false },
            { label: 'Network', icon: Activity, active: false },
          ].map((item) => (
            <button 
              key={item.label}
              className={`flex items-center gap-2 text-[10px] uppercase font-mono tracking-widest transition-colors ${item.active ? 'text-white' : 'text-white/30 hover:text-white/60'}`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4 font-mono text-[10px] text-white/40">
          <div className="flex flex-col items-end">
            <span>REGION: ASIA-EAST</span>
            <span>OS: NEON-V1.4.2</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col md:flex-row items-center justify-center gap-12 p-10 max-w-7xl mx-auto w-full">
        {/* Game Pane */}
        <motion.div 
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "circOut" }}
          className="flex-1 flex flex-col items-center justify-center p-4"
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-magenta-500 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000" />
            <SnakeGame />
          </div>
        </motion.div>

        {/* Info & Side Pane */}
        <motion.div 
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "circOut", delay: 0.2 }}
          className="w-full md:w-auto h-full flex flex-col justify-center"
        >
          <div className="mb-8 hidden lg:block">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-4 max-w-[200px] leading-[0.9]">
              Eat. Play. <span className="text-cyan-400">Vibe.</span>
            </h2>
            <div className="h-px w-12 bg-magenta-500 mb-6" />
            <p className="text-white/40 text-xs font-mono max-w-[200px] leading-relaxed">
              Experience the classic game reinvented with real-time neural synth generation. Use arrow keys to navigate the grid.
            </p>
          </div>
          
          <MusicPlayer />
        </motion.div>
      </main>

      {/* Footer Branding */}
      <footer className="relative z-10 py-6 px-10 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-white/20 uppercase tracking-widest">
        <div>© 2026 AI STUDIO EXPERIMENTAL LABS</div>
        <div className="flex gap-8">
          <span>LATENCY: 12ms</span>
          <span>UPTIME: 99.9%</span>
        </div>
      </footer>
    </div>
  );
}
