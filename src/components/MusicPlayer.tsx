import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, Timer } from 'lucide-react';
import { Track } from '../types';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Cyber Pulse',
    artist: 'AI Synth Engine',
    duration: '03:24',
    coverUrl: 'https://picsum.photos/seed/cyberpulse/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Placeholder audio
  },
  {
    id: '2',
    title: 'Neon Rain',
    artist: 'Deep Lofi AI',
    duration: '02:45',
    coverUrl: 'https://picsum.photos/seed/neonrain/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: '3',
    title: 'Digital Horizon',
    artist: 'Virtual Horizon',
    duration: '04:12',
    coverUrl: 'https://picsum.photos/seed/digitalhorizon/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => {
        // Fallback if autoplay is blocked
        setIsPlaying(false);
      });
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const percentage = (audio.currentTime / audio.duration) * 100;
      setProgress(percentage || 0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleNext);
    
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleNext);
    };
  }, [currentTrackIndex]);

  const handleTogglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  return (
    <div className="w-full max-w-sm p-6 bg-zinc-950/60 backdrop-blur-xl border border-white/5 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
      {/* Background Glow */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-magenta-500/10 blur-[100px] pointer-events-none" />

      <audio ref={audioRef} src={currentTrack.audioUrl} />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-mono">Now Playing</span>
          </div>
          <Music className="w-4 h-4 text-white/20" />
        </div>

        {/* Album Art & Visualizer Overlay */}
        <div className="relative aspect-square mb-8 group-hover:scale-[1.02] transition-transform duration-500">
          <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentTrack.id}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6, ease: "circOut" }}
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>
            
            {/* Visualizer Overlay */}
            {isPlaying && (
              <div className="absolute bottom-4 left-0 right-0 px-6 flex items-end justify-center gap-1 h-12">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      height: [8, Math.random() * 40 + 8, 8],
                    }}
                    transition={{
                      duration: 0.5 + Math.random() * 0.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="w-1 bg-cyan-400/80 rounded-full"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Track Info */}
        <div className="text-center mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTrack.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-1 italic">
                {currentTrack.title}
              </h3>
              <p className="text-white/40 text-sm font-mono tracking-wider">
                {currentTrack.artist}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="relative h-1.5 bg-white/5 rounded-full overflow-hidden mb-2">
            <motion.div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-magenta-500"
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", bounce: 0, duration: 0.2 }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-white/30 font-mono">
            <div className="flex items-center gap-1">
              <Timer className="w-3 h-3" />
              <span>{Math.floor((audioRef.current?.currentTime || 0) / 60)}:{(Math.floor(audioRef.current?.currentTime || 0) % 60).toString().padStart(2, '0')}</span>
            </div>
            <span>{currentTrack.duration}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-8">
          <button 
            onClick={handlePrev}
            className="text-white/40 hover:text-white transition-colors transform hover:scale-110 active:scale-95"
          >
            <SkipBack className="w-6 h-6 fill-current" />
          </button>

          <button 
            onClick={handleTogglePlay}
            className="w-16 h-16 flex items-center justify-center bg-white rounded-full text-black hover:bg-cyan-400 hover:text-white hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all transform active:scale-90"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 ml-1 fill-current" />
            )}
          </button>

          <button 
            onClick={handleNext}
            className="text-white/40 hover:text-white transition-colors transform hover:scale-110 active:scale-95"
          >
            <SkipForward className="w-6 h-6 fill-current" />
          </button>
        </div>

        {/* Volume Indicator (Visual only) */}
        <div className="mt-8 flex justify-center items-center gap-3 text-white/20">
          <Volume2 className="w-4 h-4" />
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`w-1 h-3 rounded-full ${i < 3 ? 'bg-white/40' : 'bg-white/10'}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
