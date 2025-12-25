import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  Lock,
  Headphones,
  Music,
  Heart,
  Play,
  Pause,
  Crown,
  Loader2,
  Volume2,
  VolumeX,
  Volume1,
  Sparkles,
  Clock,
  Waves,
  Brain,
  Star,
  ChevronRight,
  X,
  GripHorizontal,
  SkipBack,
  SkipForward,
  Repeat,
  Minimize2,
  Maximize2,
} from 'lucide-react';
import {
  getMyAudioLibrary,
  getAudioContent,
  getAudioStreamUrl,
  redeemAccessKey,
  formatDuration,
  audioTitles,
  categoryLabels,
  type AudioContent,
  type AudioCategory,
  type AudioLibrary,
} from '@/services/audioService';
import { AudioPlayer } from '@/components/AudioPlayer';
import { cn } from '@/lib/utils';
import { SEO } from '@/components/SEO';

// Category icons mapping
const categoryIcons: Record<AudioCategory, typeof Music> = {
  AMBIENT: Waves,
  MEDITATION: Brain,
  FREQUENCY: Heart,
  EXCLUSIVE: Star,
};

// Category colors
const categoryColors: Record<AudioCategory, string> = {
  AMBIENT: 'from-blue-500 to-cyan-500',
  MEDITATION: 'from-purple-500 to-pink-500',
  FREQUENCY: 'from-green-500 to-emerald-500',
  EXCLUSIVE: 'from-amber-500 to-orange-500',
};

const categoryBgColors: Record<AudioCategory, string> = {
  AMBIENT: 'bg-blue-500/10 text-blue-600 border-blue-200',
  MEDITATION: 'bg-purple-500/10 text-purple-600 border-purple-200',
  FREQUENCY: 'bg-green-500/10 text-green-600 border-green-200',
  EXCLUSIVE: 'bg-amber-500/10 text-amber-600 border-amber-200',
};

const AudioExperience = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);

  const [loading, setLoading] = useState(true);
  const [library, setLibrary] = useState<AudioLibrary | null>(null);
  const [publicContent, setPublicContent] = useState<AudioContent[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<AudioCategory | 'ALL'>('ALL');
  const [currentTrack, setCurrentTrack] = useState<AudioContent | null>(null);
  const [currentStreamUrl, setCurrentStreamUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingTrack, setIsLoadingTrack] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [accessKeyInput, setAccessKeyInput] = useState('');
  const [redeemingKey, setRedeemingKey] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isLooping, setIsLooping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Draggable player state
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const playerRef = useRef<HTMLDivElement>(null);

  const lang = language === 'es' ? 'es' : 'en';

  // Drag event handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!playerRef.current) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - playerPosition.x,
      y: e.clientY - playerPosition.y,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !playerRef.current) return;

    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;

    // Get viewport bounds
    const playerRect = playerRef.current.getBoundingClientRect();
    const maxX = window.innerWidth - playerRect.width;
    const maxY = window.innerHeight - playerRect.height;

    // Constrain within viewport
    setPlayerPosition({
      x: Math.min(Math.max(newX, -maxX / 2), maxX / 2),
      y: Math.min(Math.max(newY, -maxY), 100), // Allow moving up, limit moving down
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add/remove global mouse event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  useEffect(() => {
    loadContent();
  }, [user]);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onDurationChange = () => setDuration(audio.duration);
    const onEnded = () => {
      setIsPlaying(false);
      // Auto-play next track logic could go here
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onCanPlay = () => setIsLoadingTrack(false);
    const onError = (e: Event) => {
      console.error('Audio error:', audio.error);
      setIsLoadingTrack(false);
      toast({
        title: 'Error',
        description: lang === 'es' ? 'Error al cargar el audio' : 'Failed to load audio',
        variant: 'destructive',
      });
    };
    const onLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('error', onError);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
    };
  }, [lang, toast]);

  const loadContent = async () => {
    try {
      setLoading(true);
      if (user) {
        const libraryData = await getMyAudioLibrary();
        setLibrary(libraryData);
      } else {
        const { audioContent } = await getAudioContent();
        setPublicContent(audioContent);
      }
    } catch (error: any) {
      console.error('Failed to load audio content:', error);
      try {
        const { audioContent } = await getAudioContent();
        setPublicContent(audioContent);
      } catch {
        // Ignore
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = async (audio: AudioContent) => {
    if (!audio.canAccess && !audio.isPreview) {
      if (!user) {
        toast({
          title: lang === 'es' ? 'Inicia sesión' : 'Login Required',
          description: lang === 'es'
            ? 'Inicia sesión para acceder al contenido premium'
            : 'Login to access premium content',
        });
        navigate('/login');
        return;
      }
      toast({
        title: lang === 'es' ? 'Suscripción requerida' : 'Subscription Required',
        description: lang === 'es'
          ? 'Suscríbete para acceder a este contenido'
          : 'Subscribe to access this content',
      });
      navigate('/subscriptions');
      return;
    }

    try {
      // If same track, toggle play/pause
      if (currentTrack?.id === audio.id) {
        if (isPlaying) {
          audioRef.current?.pause();
        } else {
          audioRef.current?.play();
        }
        return;
      }

      setIsLoadingTrack(true);

      // Stop current audio before loading new one
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      const { streamUrl } = await getAudioStreamUrl(audio.id);
      setCurrentTrack(audio);
      setCurrentStreamUrl(streamUrl);
      setShowPlayer(true);
      // Use database duration as fallback until audio metadata loads
      setDuration(audio.durationSeconds);

      if (audioRef.current) {
        audioRef.current.src = streamUrl;
        audioRef.current.load();
        try {
          await audioRef.current.play();
        } catch (playError) {
          // Ignore AbortError as it's expected when switching tracks quickly
          if ((playError as Error).name !== 'AbortError') {
            throw playError;
          }
        }
      }
    } catch (error: any) {
      setIsLoadingTrack(false);
      toast({
        title: 'Error',
        description: error.message || 'Failed to play audio',
        variant: 'destructive',
      });
    }
  };

  const handleRedeemKey = async () => {
    if (!accessKeyInput.trim()) {
      toast({
        title: 'Error',
        description: lang === 'es' ? 'Ingresa un código de acceso' : 'Enter an access code',
        variant: 'destructive',
      });
      return;
    }

    if (!user) {
      toast({
        title: lang === 'es' ? 'Inicia sesión' : 'Login Required',
        description: lang === 'es'
          ? 'Inicia sesión para canjear tu código'
          : 'Login to redeem your code',
      });
      navigate('/login');
      return;
    }

    try {
      setRedeemingKey(true);
      const result = await redeemAccessKey(accessKeyInput.trim());
      toast({
        title: lang === 'es' ? 'Código canjeado' : 'Code Redeemed',
        description: lang === 'es'
          ? `Acceso activado hasta ${new Date(result.expiresAt).toLocaleDateString()}`
          : `Access activated until ${new Date(result.expiresAt).toLocaleDateString()}`,
      });
      setAccessKeyInput('');
      loadContent();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to redeem code',
        variant: 'destructive',
      });
    } finally {
      setRedeemingKey(false);
    }
  };

  const getTitle = (titleKey: string) => {
    return audioTitles[titleKey]?.[lang] || titleKey;
  };

  const getCategoryLabel = (category: AudioCategory) => {
    return categoryLabels[category]?.[lang] || category;
  };

  // Format time helper
  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Volume control handlers
  const handleVolumeChange = (values: number[]) => {
    const newVolume = values[0];
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume || 0.5;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  // Seek handler
  const handleSeek = (values: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = values[0];
      setCurrentTime(values[0]);
    }
  };

  // Skip time
  const skipTime = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(audioRef.current.currentTime + seconds, duration));
    }
  };

  // Toggle loop
  const toggleLoop = () => {
    if (audioRef.current) {
      audioRef.current.loop = !isLooping;
    }
    setIsLooping(!isLooping);
  };

  // Get volume icon
  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  const content = user && library ? library.library : publicContent;
  const hasAccess = library?.hasSubscription || library?.hasAccessKey;

  const filteredContent = selectedCategory === 'ALL'
    ? content
    : content.filter(audio => audio.category === selectedCategory);

  const categories: (AudioCategory | 'ALL')[] = ['ALL', 'AMBIENT', 'MEDITATION', 'FREQUENCY', 'EXCLUSIVE'];

  // Group content by category for featured section
  const featuredByCategory = categories
    .filter(cat => cat !== 'ALL')
    .map(category => ({
      category: category as AudioCategory,
      tracks: content.filter(a => a.category === category).slice(0, 4),
    }))
    .filter(g => g.tracks.length > 0);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-amber-200 border-t-amber-500 animate-spin" />
          <Headphones className="absolute inset-0 m-auto h-6 w-6 text-amber-600" />
        </div>
        <p className="mt-4 text-slate-500 animate-pulse">
          {lang === 'es' ? 'Cargando experiencia de audio...' : 'Loading audio experience...'}
        </p>
      </div>
    );
  }

  const audioSeoContent = {
    es: {
      title: 'Experiencia de Audio',
      description: 'Descubre nuestra biblioteca exclusiva de audio con meditaciones guiadas, frecuencias de sanación y paisajes sonoros ambientales para tu bienestar.',
      keywords: 'audio meditación, frecuencias sanación, sonidos ambiente, bienestar, relajación, V&M Candle',
    },
    en: {
      title: 'Audio Experience',
      description: 'Discover our exclusive audio library with guided meditations, healing frequencies, and ambient soundscapes for your wellness.',
      keywords: 'meditation audio, healing frequencies, ambient sounds, wellness, relaxation, V&M Candle',
    },
  };

  const seoContent = audioSeoContent[lang];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <SEO
        title={seoContent.title}
        description={seoContent.description}
        keywords={seoContent.keywords}
        url="/audio"
      />
      {/* Hidden audio element */}
      <audio ref={audioRef} preload="metadata" />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-amber-500/20 to-transparent rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-500/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span className="text-sm text-amber-200">
                {lang === 'es' ? 'Experiencia Premium' : 'Premium Experience'}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 bg-gradient-to-r from-white via-amber-100 to-white bg-clip-text text-transparent">
              {lang === 'es' ? 'Experiencia de Audio' : 'Audio Experience'}
            </h1>

            <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed">
              {lang === 'es'
                ? 'Sumérgete en un viaje sensorial con nuestra colección exclusiva de meditaciones guiadas, música ambiental y frecuencias de sanación.'
                : 'Immerse yourself in a sensory journey with our exclusive collection of guided meditations, ambient music, and healing frequencies.'}
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              {[
                { icon: Waves, text: lang === 'es' ? 'Música Ambiental' : 'Ambient Music', color: 'text-blue-400' },
                { icon: Brain, text: lang === 'es' ? 'Meditaciones' : 'Meditations', color: 'text-purple-400' },
                { icon: Heart, text: lang === 'es' ? 'Frecuencias' : 'Frequencies', color: 'text-green-400' },
                { icon: Star, text: lang === 'es' ? 'Exclusivo' : 'Exclusive', color: 'text-amber-400' },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm"
                >
                  <item.icon className={cn("h-4 w-4", item.color)} />
                  <span className="text-sm text-slate-200">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto fill-slate-50">
            <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" />
          </svg>
        </div>
      </section>

      {/* Subscription Status */}
      {hasAccess && library && (
        <div className="max-w-7xl mx-auto px-4 -mt-6 relative z-10">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
            <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-green-800">
                {lang === 'es' ? 'Acceso Premium Activo' : 'Premium Access Active'}
              </p>
              <p className="text-sm text-green-600">
                {lang === 'es'
                  ? `Plan ${library.planId} - Válido hasta ${new Date(library.expiresAt!).toLocaleDateString()}`
                  : `${library.planId} Plan - Valid until ${new Date(library.expiresAt!).toLocaleDateString()}`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            const CategoryIcon = cat === 'ALL' ? Music : categoryIcons[cat as AudioCategory];

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all duration-300",
                  isActive
                    ? "bg-slate-900 text-white shadow-lg scale-105"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                )}
              >
                <CategoryIcon className="h-4 w-4" />
                <span>
                  {cat === 'ALL'
                    ? (lang === 'es' ? 'Todos' : 'All')
                    : getCategoryLabel(cat as AudioCategory)}
                </span>
                {cat !== 'ALL' && (
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full",
                    isActive ? "bg-white/20" : "bg-slate-100"
                  )}>
                    {content.filter(a => a.category === cat).length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Audio Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContent.map((audio) => {
            const canPlay = audio.isPreview || audio.canAccess;
            const isCurrentTrack = currentTrack?.id === audio.id;
            const CategoryIcon = categoryIcons[audio.category];

            return (
              <Card
                key={audio.id}
                className={cn(
                  "group relative overflow-hidden transition-all duration-500 hover:shadow-xl border-0",
                  isCurrentTrack && isPlaying
                    ? "ring-2 ring-amber-500 shadow-amber-500/20 shadow-lg"
                    : "shadow-md hover:-translate-y-1"
                )}
              >
                {/* Category gradient header */}
                <div className={cn(
                  "h-2 bg-gradient-to-r",
                  categoryColors[audio.category]
                )} />

                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-slate-800 truncate mb-1">
                        {getTitle(audio.titleKey)}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={cn("text-xs", categoryBgColors[audio.category])}
                        >
                          <CategoryIcon className="h-3 w-3 mr-1" />
                          {getCategoryLabel(audio.category)}
                        </Badge>
                        {audio.isPreview && (
                          <Badge variant="secondary" className="text-xs">
                            {lang === 'es' ? 'Vista Previa' : 'Preview'}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {!canPlay && (
                      <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                        <Lock className="h-4 w-4 text-slate-400" />
                      </div>
                    )}
                  </div>

                  {/* Duration */}
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                    <Clock className="h-4 w-4" />
                    <span>{formatDuration(audio.durationSeconds)}</span>
                    {audio.requiredPlan && (
                      <>
                        <span className="text-slate-300">•</span>
                        <span className="text-amber-600 font-medium">{audio.requiredPlan}</span>
                      </>
                    )}
                  </div>

                  {/* Waveform visualization (decorative) */}
                  <div className="flex items-end justify-between h-8 gap-[2px] mb-4">
                    {Array(30).fill(0).map((_, i) => {
                      const height = isCurrentTrack && isPlaying
                        ? Math.sin(Date.now() / 200 + i * 0.5) * 0.3 + 0.5
                        : Math.sin(i * 0.8) * 0.3 + 0.4;
                      return (
                        <div
                          key={i}
                          className={cn(
                            "w-1 rounded-full transition-all duration-150",
                            isCurrentTrack && isPlaying
                              ? `bg-gradient-to-t ${categoryColors[audio.category]}`
                              : "bg-slate-200"
                          )}
                          style={{ height: `${height * 100}%` }}
                        />
                      );
                    })}
                  </div>

                  {/* Play Button */}
                  <Button
                    onClick={() => handlePlay(audio)}
                    disabled={isLoadingTrack && currentTrack?.id === audio.id}
                    className={cn(
                      "w-full rounded-xl h-12 font-medium transition-all duration-300",
                      canPlay
                        ? isCurrentTrack && isPlaying
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                          : "bg-slate-900 hover:bg-slate-800 text-white"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                    )}
                  >
                    {isLoadingTrack && currentTrack?.id === audio.id ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : !canPlay ? (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        {lang === 'es' ? 'Desbloquear' : 'Unlock'}
                      </>
                    ) : isCurrentTrack && isPlaying ? (
                      <>
                        <Pause className="h-5 w-5 mr-2" />
                        {lang === 'es' ? 'Pausar' : 'Pause'}
                      </>
                    ) : (
                      <>
                        <Play className="h-5 w-5 mr-2" />
                        {lang === 'es' ? 'Reproducir' : 'Play'}
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredContent.length === 0 && (
          <div className="text-center py-16">
            <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Music className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-medium text-slate-700 mb-2">
              {lang === 'es' ? 'Sin contenido' : 'No Content'}
            </h3>
            <p className="text-slate-500">
              {lang === 'es'
                ? 'No hay contenido en esta categoría'
                : 'No content in this category'}
            </p>
          </div>
        )}
      </section>

      {/* Access Key Section */}
      {!hasAccess && (
        <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-16">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <div className="h-16 w-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="h-8 w-8 text-amber-400" />
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">
              {lang === 'es' ? '¿Tienes un código de acceso?' : 'Have an Access Code?'}
            </h2>
            <p className="text-slate-400 mb-8">
              {lang === 'es'
                ? 'Si recibiste un código de acceso con la compra de una vela o como regalo, ingrésalo aquí.'
                : 'If you received an access code with a candle purchase or as a gift, enter it here.'}
            </p>
            <div className="flex gap-3 max-w-md mx-auto">
              <Input
                type="text"
                placeholder="VM-XXXXX-XXXXX"
                value={accessKeyInput}
                onChange={(e) => setAccessKeyInput(e.target.value.toUpperCase())}
                className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 h-12"
              />
              <Button
                onClick={handleRedeemKey}
                disabled={redeemingKey}
                className="h-12 px-6 bg-amber-500 hover:bg-amber-600 text-white"
              >
                {redeemingKey ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  lang === 'es' ? 'Activar' : 'Activate'
                )}
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Subscribe CTA */}
      {!hasAccess && (
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Crown className="h-12 w-12 text-amber-500 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-800 mb-4">
              {lang === 'es' ? 'Desbloquea Todo el Contenido' : 'Unlock All Content'}
            </h2>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              {lang === 'es'
                ? 'Suscríbete para acceder a toda nuestra biblioteca de meditaciones, música ambiental, frecuencias sanadoras y contenido exclusivo.'
                : 'Subscribe to access our entire library of meditations, ambient music, healing frequencies, and exclusive content.'}
            </p>
            <Button
              size="lg"
              onClick={() => navigate('/subscriptions')}
              className="h-14 px-8 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-full shadow-lg shadow-amber-500/30"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              {lang === 'es' ? 'Ver Planes de Suscripción' : 'View Subscription Plans'}
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      )}

      {/* Floating Player - Elegant Design */}
      {showPlayer && currentTrack && (
        <div
          ref={playerRef}
          className={cn(
            "fixed z-50 transition-all duration-500 ease-out",
            isMinimized
              ? "bottom-6 right-6 w-auto"
              : "bottom-6 left-1/2 w-full max-w-2xl px-4",
            isDragging ? "cursor-grabbing" : "cursor-default"
          )}
          style={{
            transform: isMinimized
              ? `translate(${playerPosition.x}px, ${playerPosition.y}px)`
              : `translate(calc(-50% + ${playerPosition.x}px), ${playerPosition.y}px)`,
            transition: isDragging ? 'none' : 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {/* Minimized Player */}
          {isMinimized ? (
            <div
              className="relative group"
              onMouseDown={handleMouseDown}
            >
              {/* Glow effect */}
              <div className={cn(
                "absolute -inset-2 rounded-full blur-xl transition-opacity duration-300",
                isPlaying ? "bg-amber-500/30 opacity-100" : "opacity-0"
              )} />

              <div className={cn(
                "relative flex items-center gap-3 p-3 pr-4 rounded-full shadow-2xl border transition-all duration-300",
                "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900",
                "border-slate-700/50 hover:border-amber-500/30",
                isDragging ? "cursor-grabbing scale-105" : "cursor-grab hover:scale-[1.02]"
              )}>
                {/* Animated ring when playing */}
                {isPlaying && (
                  <div className="absolute inset-0 rounded-full animate-pulse bg-gradient-to-r from-amber-500/10 to-orange-500/10" />
                )}

                {/* Play/Pause Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isPlaying) {
                      audioRef.current?.pause();
                    } else {
                      audioRef.current?.play();
                    }
                  }}
                  className={cn(
                    "relative h-12 w-12 rounded-full flex items-center justify-center transition-all duration-300",
                    "bg-gradient-to-br from-amber-400 to-amber-600",
                    "hover:from-amber-500 hover:to-amber-700",
                    "shadow-lg shadow-amber-500/25"
                  )}
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5 text-white" fill="white" />
                  ) : (
                    <Play className="h-5 w-5 text-white ml-0.5" fill="white" />
                  )}
                </button>

                {/* Track Info */}
                <div className="flex flex-col min-w-0 max-w-[150px]">
                  <span className="text-sm font-medium text-white truncate">
                    {getTitle(currentTrack.titleKey)}
                  </span>
                  <span className="text-xs text-slate-400 truncate">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                {/* Expand Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMinimized(false);
                  }}
                  className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Maximize2 className="h-4 w-4" />
                </button>

                {/* Close Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPlayer(false);
                    if (audioRef.current) {
                      audioRef.current.pause();
                      audioRef.current.currentTime = 0;
                    }
                    setCurrentTrack(null);
                    setCurrentStreamUrl('');
                    setIsPlaying(false);
                    setPlayerPosition({ x: 0, y: 0 });
                  }}
                  className="p-2 rounded-full text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Expanded Player */
            <div className="relative">
              {/* Ambient glow */}
              <div className={cn(
                "absolute -inset-4 rounded-3xl blur-2xl transition-opacity duration-500",
                isPlaying
                  ? "bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-amber-500/20 opacity-100"
                  : "opacity-0"
              )} />

              {/* Drag handle */}
              <div
                onMouseDown={handleMouseDown}
                className={cn(
                  "absolute -top-2 left-1/2 -translate-x-1/2 px-6 py-1 rounded-full z-50 flex items-center gap-2 transition-all duration-200",
                  "bg-slate-700/80 backdrop-blur-sm hover:bg-slate-600/80",
                  isDragging ? "cursor-grabbing scale-110" : "cursor-grab hover:scale-105"
                )}
              >
                <GripHorizontal className="h-3 w-3 text-slate-400" />
              </div>

              {/* Main Player Card */}
              <div className={cn(
                "relative overflow-hidden rounded-2xl shadow-2xl",
                "bg-gradient-to-br from-slate-900/98 via-slate-800/98 to-slate-900/98",
                "backdrop-blur-xl border border-slate-700/50"
              )}>
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-30">
                  <div className={cn(
                    "absolute top-0 left-1/4 w-64 h-64 rounded-full blur-3xl transition-all duration-1000",
                    isPlaying ? "bg-amber-500/30 animate-pulse" : "bg-slate-600/20"
                  )} />
                  <div className={cn(
                    "absolute bottom-0 right-1/4 w-48 h-48 rounded-full blur-3xl transition-all duration-1000 delay-500",
                    isPlaying ? "bg-orange-500/20 animate-pulse" : "bg-slate-600/10"
                  )} />
                </div>

                <div className="relative p-6">
                  {/* Header with controls */}
                  <div className="flex items-center justify-between mb-4">
                    {/* Minimize Button */}
                    <button
                      onClick={() => setIsMinimized(true)}
                      className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200 hover:scale-110"
                      title={lang === 'es' ? 'Minimizar' : 'Minimize'}
                    >
                      <Minimize2 className="h-4 w-4" />
                    </button>

                    {/* Track Info - Centered */}
                    <div className="flex-1 text-center px-4">
                      <h3 className="text-lg font-semibold text-white truncate mb-0.5">
                        {getTitle(currentTrack.titleKey)}
                      </h3>
                      <p className="text-sm text-amber-400/80">
                        {getCategoryLabel(currentTrack.category)}
                      </p>
                    </div>

                    {/* Close Button */}
                    <button
                      onClick={() => {
                        setShowPlayer(false);
                        if (audioRef.current) {
                          audioRef.current.pause();
                          audioRef.current.currentTime = 0;
                        }
                        setCurrentTrack(null);
                        setCurrentStreamUrl('');
                        setIsPlaying(false);
                        setPlayerPosition({ x: 0, y: 0 });
                        setIsMinimized(false);
                      }}
                      className="p-2 rounded-full text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 hover:scale-110"
                      title={lang === 'es' ? 'Cerrar' : 'Close'}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Waveform Visualizer */}
                  <div className="flex items-end justify-center gap-[3px] h-12 mb-5 px-2">
                    {Array(50).fill(0).map((_, i) => {
                      const baseHeight = Math.sin(i * 0.3) * 0.3 + 0.4;
                      const animatedHeight = isPlaying
                        ? Math.sin(Date.now() / 150 + i * 0.4) * 0.4 + 0.5
                        : baseHeight * 0.4;
                      return (
                        <div
                          key={i}
                          className={cn(
                            "w-1 rounded-full transition-all",
                            isPlaying
                              ? "bg-gradient-to-t from-amber-500 to-amber-300 duration-100"
                              : "bg-slate-600/50 duration-300"
                          )}
                          style={{
                            height: `${animatedHeight * 100}%`,
                            opacity: isPlaying ? 0.7 + animatedHeight * 0.3 : 0.4
                          }}
                        />
                      );
                    })}
                  </div>

                  {/* Time Display */}
                  <div className="flex items-center justify-center gap-3 mb-3 font-mono">
                    <span className="text-2xl font-light text-white tracking-wide">
                      {formatTime(currentTime)}
                    </span>
                    <span className="text-slate-500">/</span>
                    <span className="text-sm text-slate-400">
                      {formatTime(duration)}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-5 group px-1">
                    <Slider
                      value={[currentTime]}
                      min={0}
                      max={duration || 100}
                      step={0.1}
                      onValueChange={handleSeek}
                      className={cn(
                        "[&_[role=slider]]:h-3 [&_[role=slider]]:w-3",
                        "[&_[role=slider]]:bg-white [&_[role=slider]]:border-2 [&_[role=slider]]:border-amber-500",
                        "[&_[role=slider]]:shadow-lg [&_[role=slider]]:transition-transform",
                        "[&_[role=slider]]:hover:scale-150 [&_[role=slider]]:focus:scale-150",
                        "[&_[data-orientation=horizontal]]:h-1.5 [&_[data-orientation=horizontal]]:bg-slate-700",
                        "[&_[data-orientation=horizontal]_[data-state=complete]]:bg-gradient-to-r",
                        "[&_[data-orientation=horizontal]_[data-state=complete]]:from-amber-400",
                        "[&_[data-orientation=horizontal]_[data-state=complete]]:to-amber-600"
                      )}
                    />
                  </div>

                  {/* Main Controls */}
                  <div className="flex items-center justify-center gap-3 mb-4">
                    {/* Loop Button */}
                    <button
                      onClick={toggleLoop}
                      className={cn(
                        "p-2.5 rounded-full transition-all duration-200 hover:scale-110",
                        isLooping
                          ? "text-amber-400 bg-amber-500/20"
                          : "text-slate-400 hover:text-white hover:bg-white/10"
                      )}
                    >
                      <Repeat className="h-4 w-4" />
                    </button>

                    {/* Skip Back */}
                    <button
                      onClick={() => skipTime(-10)}
                      className="p-3 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200 hover:scale-110"
                    >
                      <SkipBack className="h-5 w-5" />
                    </button>

                    {/* Main Play/Pause Button */}
                    <button
                      onClick={() => {
                        if (isPlaying) {
                          audioRef.current?.pause();
                        } else {
                          audioRef.current?.play();
                        }
                      }}
                      disabled={isLoadingTrack}
                      className={cn(
                        "h-14 w-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300",
                        "bg-gradient-to-br from-amber-400 to-amber-600",
                        "hover:from-amber-500 hover:to-amber-700",
                        "hover:scale-110 hover:shadow-amber-500/30",
                        "active:scale-95",
                        "disabled:opacity-50"
                      )}
                    >
                      {isLoadingTrack ? (
                        <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : isPlaying ? (
                        <Pause className="h-6 w-6 text-white" fill="white" />
                      ) : (
                        <Play className="h-6 w-6 text-white ml-1" fill="white" />
                      )}
                    </button>

                    {/* Skip Forward */}
                    <button
                      onClick={() => skipTime(10)}
                      className="p-3 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200 hover:scale-110"
                    >
                      <SkipForward className="h-5 w-5" />
                    </button>

                    {/* Mute Button (placeholder for symmetry) */}
                    <button
                      onClick={toggleMute}
                      className={cn(
                        "p-2.5 rounded-full transition-all duration-200 hover:scale-110",
                        isMuted
                          ? "text-red-400 bg-red-500/20"
                          : "text-slate-400 hover:text-white hover:bg-white/10"
                      )}
                    >
                      <VolumeIcon className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Volume Control */}
                  <div className="flex items-center justify-center gap-3 px-8">
                    <Volume1 className="h-3.5 w-3.5 text-slate-500" />
                    <Slider
                      value={[isMuted ? 0 : volume]}
                      min={0}
                      max={1}
                      step={0.01}
                      onValueChange={handleVolumeChange}
                      className={cn(
                        "w-32",
                        "[&_[role=slider]]:h-2.5 [&_[role=slider]]:w-2.5",
                        "[&_[role=slider]]:bg-white [&_[role=slider]]:shadow",
                        "[&_[data-orientation=horizontal]]:h-1 [&_[data-orientation=horizontal]]:bg-slate-700",
                        "[&_[data-orientation=horizontal]_[data-state=complete]]:bg-amber-500"
                      )}
                    />
                    <Volume2 className="h-3.5 w-3.5 text-slate-500" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AudioExperience;
