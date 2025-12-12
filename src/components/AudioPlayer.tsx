import { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Volume1,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AudioPlayerProps {
  audioUrl: string;
  audioTitle?: string;
  audioSubtitle?: string;
  coverImage?: string;
  className?: string;
  onEnded?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  showFullControls?: boolean;
  accentColor?: string;
}

export const AudioPlayer = ({
  audioUrl,
  audioTitle,
  audioSubtitle,
  coverImage,
  className,
  onEnded,
  onNext,
  onPrevious,
  showFullControls = false,
  accentColor = 'amber'
}: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [buffered, setBuffered] = useState(0);

  // Animated waveform bars
  const [waveformBars, setWaveformBars] = useState<number[]>(
    Array(40).fill(0).map(() => Math.random() * 0.3 + 0.1)
  );

  // Animate waveform when playing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setWaveformBars(prev =>
          prev.map((_, i) => {
            const base = Math.sin(Date.now() / 200 + i * 0.5) * 0.3 + 0.5;
            return base * (0.3 + Math.random() * 0.7);
          })
        );
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      onEnded?.();
    };
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleProgress = () => {
      if (audio.buffered.length > 0) {
        setBuffered(audio.buffered.end(audio.buffered.length - 1));
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('progress', handleProgress);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('progress', handleProgress);
    };
  }, [onEnded]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.loop = isLooping;
    }
  }, [isLooping]);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error toggling play:', error);
    }
  }, [isPlaying]);

  const handleSeek = useCallback((values: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = values[0];
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  }, []);

  const handleVolumeChange = useCallback((values: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = values[0];
    audio.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  }, []);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  }, [isMuted, volume]);

  const skipTime = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(audio.currentTime + seconds, duration));
  }, [duration]);

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferedProgress = duration > 0 ? (buffered / duration) * 100 : 0;

  const VolumeIcon = isMuted || volume === 0
    ? VolumeX
    : volume < 0.5
      ? Volume1
      : Volume2;

  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 shadow-2xl",
      className
    )}>
      {/* Background ambient glow */}
      <div className={cn(
        "absolute inset-0 opacity-20 blur-3xl",
        `bg-gradient-to-br from-${accentColor}-500/30 via-transparent to-${accentColor}-600/20`
      )} />

      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <div className="relative z-10">
        {/* Header with cover and title */}
        {(audioTitle || coverImage) && (
          <div className="flex items-center gap-4 mb-6">
            {coverImage && (
              <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-lg">
                <img
                  src={coverImage}
                  alt={audioTitle}
                  className={cn(
                    "w-full h-full object-cover transition-transform duration-700",
                    isPlaying && "scale-110"
                  )}
                />
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-t from-black/50 to-transparent",
                  isPlaying && "animate-pulse"
                )} />
              </div>
            )}
            <div className="flex-1 min-w-0">
              {audioTitle && (
                <h3 className="text-white font-semibold text-lg truncate">
                  {audioTitle}
                </h3>
              )}
              {audioSubtitle && (
                <p className="text-slate-400 text-sm truncate">
                  {audioSubtitle}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Animated Waveform Visualizer */}
        <div className="flex items-center justify-center gap-[2px] h-16 mb-6 px-4">
          {waveformBars.map((height, i) => (
            <div
              key={i}
              className={cn(
                "w-1 rounded-full transition-all duration-150 ease-out",
                isPlaying
                  ? `bg-gradient-to-t from-${accentColor}-500 to-${accentColor}-300`
                  : "bg-slate-600"
              )}
              style={{
                height: `${(isPlaying ? height : 0.2) * 100}%`,
                opacity: isPlaying ? 0.8 + height * 0.2 : 0.4,
              }}
            />
          ))}
        </div>

        {/* Time Display - Large and Centered */}
        <div className="text-center mb-4">
          <div className="inline-flex items-baseline gap-1 font-mono">
            <span className="text-4xl font-light text-white tracking-tight">
              {formatTime(currentTime)}
            </span>
            <span className="text-slate-500 text-lg mx-2">/</span>
            <span className="text-lg text-slate-400">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative mb-6 group">
          {/* Buffered progress */}
          <div className="absolute inset-0 h-2 rounded-full bg-slate-700/50 overflow-hidden">
            <div
              className="h-full bg-slate-600/50 transition-all duration-300"
              style={{ width: `${bufferedProgress}%` }}
            />
          </div>

          {/* Main progress slider */}
          <Slider
            value={[currentTime]}
            min={0}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            className={cn(
              "relative z-10",
              "[&_[role=slider]]:h-4 [&_[role=slider]]:w-4",
              "[&_[role=slider]]:bg-white [&_[role=slider]]:border-2",
              `[&_[role=slider]]:border-${accentColor}-500`,
              "[&_[role=slider]]:shadow-lg [&_[role=slider]]:transition-transform",
              "[&_[role=slider]]:hover:scale-125",
              "[&_[role=slider]]:opacity-0 group-hover:[&_[role=slider]]:opacity-100",
              `[&_[data-orientation=horizontal]]:bg-${accentColor}-500/30`,
              `[&_[data-orientation=horizontal]_[data-state=complete]]:bg-gradient-to-r`,
              `[&_[data-orientation=horizontal]_[data-state=complete]]:from-${accentColor}-400`,
              `[&_[data-orientation=horizontal]_[data-state=complete]]:to-${accentColor}-600`
            )}
          />
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-center gap-4 mb-4">
          {showFullControls && (
            <>
              <Button
                onClick={() => setIsLooping(!isLooping)}
                size="icon"
                variant="ghost"
                className={cn(
                  "h-10 w-10 rounded-full text-slate-400 hover:text-white hover:bg-slate-700/50",
                  isLooping && `text-${accentColor}-400`
                )}
              >
                <Repeat className="h-4 w-4" />
              </Button>

              <Button
                onClick={() => onPrevious?.() || skipTime(-10)}
                size="icon"
                variant="ghost"
                className="h-12 w-12 rounded-full text-slate-300 hover:text-white hover:bg-slate-700/50"
              >
                <SkipBack className="h-5 w-5" />
              </Button>
            </>
          )}

          {/* Main Play/Pause Button */}
          <Button
            onClick={togglePlay}
            size="icon"
            disabled={isLoading}
            className={cn(
              "h-16 w-16 rounded-full shadow-xl transition-all duration-300",
              "bg-gradient-to-br from-amber-400 to-amber-600",
              "hover:from-amber-500 hover:to-amber-700",
              "hover:scale-105 hover:shadow-amber-500/25",
              "active:scale-95",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause className="h-7 w-7 text-white" fill="white" />
            ) : (
              <Play className="h-7 w-7 text-white ml-1" fill="white" />
            )}
          </Button>

          {showFullControls && (
            <>
              <Button
                onClick={() => onNext?.() || skipTime(10)}
                size="icon"
                variant="ghost"
                className="h-12 w-12 rounded-full text-slate-300 hover:text-white hover:bg-slate-700/50"
              >
                <SkipForward className="h-5 w-5" />
              </Button>

              <Button
                onClick={() => {}}
                size="icon"
                variant="ghost"
                className="h-10 w-10 rounded-full text-slate-400 hover:text-white hover:bg-slate-700/50"
              >
                <Shuffle className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        {/* Volume Control */}
        <div className="flex items-center justify-center gap-3">
          <Button
            onClick={toggleMute}
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-full text-slate-400 hover:text-white"
          >
            <VolumeIcon className="h-4 w-4" />
          </Button>
          <Slider
            value={[isMuted ? 0 : volume]}
            min={0}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className={cn(
              "w-28",
              "[&_[role=slider]]:h-3 [&_[role=slider]]:w-3",
              "[&_[role=slider]]:bg-white",
              `[&_[data-orientation=horizontal]]:bg-slate-600`,
              `[&_[data-orientation=horizontal]_[data-state=complete]]:bg-${accentColor}-500`
            )}
          />
          <span className="text-xs text-slate-500 w-8">
            {Math.round((isMuted ? 0 : volume) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};

// Compact inline player for lists
export const CompactAudioPlayer = ({
  isPlaying,
  isLoading,
  currentTime,
  duration,
  onTogglePlay,
  className
}: {
  isPlaying: boolean;
  isLoading?: boolean;
  currentTime?: number;
  duration?: number;
  onTogglePlay: () => void;
  className?: string;
}) => {
  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Button
        onClick={onTogglePlay}
        size="icon"
        disabled={isLoading}
        className={cn(
          "h-10 w-10 rounded-full transition-all",
          isPlaying
            ? "bg-amber-500 hover:bg-amber-600 text-white"
            : "bg-slate-100 hover:bg-slate-200 text-slate-700"
        )}
      >
        {isLoading ? (
          <div className="h-4 w-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
        ) : isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4 ml-0.5" />
        )}
      </Button>
      {currentTime !== undefined && duration !== undefined && (
        <span className="text-xs text-muted-foreground font-mono">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      )}
    </div>
  );
};
