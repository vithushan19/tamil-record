import { useEffect, useRef, useState } from 'react';

import Navbar from '@/components/Navbar';
import { NOV19_Meiyazhagan } from './api/listeningClub/NOV19_Meiyazhagan';

const formatTime = (s: number) => {
  if (!Number.isFinite(s) || s < 0) return '0:00';
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${m}:${pad(sec)}`;
};

export default function ListeningClubPage() {
  const captions = NOV19_Meiyazhagan;
  const audioSrc = '/audio/listening-club/19 Nov Meiyazhagan.mp3';
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pendingSeekRef = useRef<{ time: number; wasPlaying: boolean } | null>(
    null,
  );

  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Loop state
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [loopAnchorIndex, setLoopAnchorIndex] = useState<number | null>(null);

  // Keep the audio element's volume in sync
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Attach media listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.load();

    const onLoaded = () => {
      setDuration(audio.duration || 0);
      if (pendingSeekRef.current) {
        audio.currentTime = pendingSeekRef.current.time;
        if (pendingSeekRef.current.wasPlaying) {
          audio.play().catch(() => { });
        }
        pendingSeekRef.current = null;
      }
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    if (audio.readyState >= 1) onLoaded();

    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, []);

  // Poll currentTime at 100ms — also drives the loop rewind
  useEffect(() => {
    const interval = setInterval(() => {
      const audio = audioRef.current;
      if (!audio) return;
      const t = audio.currentTime;

      // ── Loop rewind ──────────────────────────────────────────
      if (isLooping && loopAnchorIndex !== null) {
        const anchor = captions[loopAnchorIndex];
        const next = captions[loopAnchorIndex + 1];
        const endTime = next?.timestamp ?? audio.duration;

        if (
          anchor &&
          Number.isFinite(endTime) &&
          endTime > 0 &&
          t >= endTime - 0.02
        ) {
          const wasEnded = audio.ended;
          audio.currentTime = anchor.timestamp;
          setCurrentTime(anchor.timestamp);
          if (wasEnded) audio.play().catch(() => { });
          return;
        }
      }

      setCurrentTime(t);
    }, 100);
    return () => clearInterval(interval);
  }, [isLooping, loopAnchorIndex, captions]);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play().catch(() => { });
    else audio.pause();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  // Which caption a given time falls inside
  const indexAtTime = (t: number) =>
    captions.findIndex(
      (caption, i) =>
        t >= caption.timestamp &&
        (i === captions.length - 1 || t < captions[i + 1].timestamp),
    );

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = parseFloat(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = t;
    setCurrentTime(t);
    // If looped, move the anchor to the sentence the user just landed on
    if (isLooping) {
      const newIndex = indexAtTime(t);
      if (newIndex >= 0) setLoopAnchorIndex(newIndex);
    }
  };

  const handleToggleLoop = () => {
    if (!isLooping) {
      // Freeze whichever sentence is currently playing
      const t = audioRef.current?.currentTime ?? 0;
      const idx = indexAtTime(t);
      if (idx >= 0) {
        setLoopAnchorIndex(idx);
        setIsLooping(true);
      }
    } else {
      // Release the anchor — playback continues naturally
      setIsLooping(false);
      setLoopAnchorIndex(null);
    }
  };

  const [isTranscriptVisible, setIsTranscriptVisible] = useState<boolean>(false);

  const handleToggleTranscript = () => {
    setIsTranscriptVisible((prev) => !prev);
  };

  // Caption lookup
  const currentIndex = indexAtTime(currentTime);
  const currentCaption = captions[currentIndex];
  const nextStart = captions[currentIndex + 1]?.timestamp;
  const totalDuration =
    (nextStart ?? duration) - (currentCaption?.timestamp ?? 0);
  const timeElapsed = currentTime - (currentCaption?.timestamp ?? 0);
  const highlightRatio =
    totalDuration > 0
      ? Math.min(1, Math.max(0, timeElapsed / totalDuration))
      : 0;

  const renderAdjacent = (offset: number) => {
    const caption = captions[currentIndex + offset];
    if (!caption) return null;
    const distance = Math.abs(offset);
    const opacity =
      distance === 1 ? 'opacity-50' : distance === 2 ? 'opacity-30' : 'opacity-15';
    return (
      <p
        key={`${offset}-${caption.timestamp}`}
        className={`text-base font-medium text-slate-300 transition-opacity duration-300 md:text-lg ${opacity}`}
      >
        {caption.text}
      </p>
    );
  };

  return (
    <div className='min-h-screen bg-slate-950 text-slate-100'>
      <Navbar />

      <main className='mx-auto max-w-3xl space-y-6 px-4 py-8'>
        {/* Disclaimer card giving credit to the original artist: Tamil Language Centre: https://www.tamillanguagecentre.com/ */}
        <section className='rounded-3xl border border-white/5 bg-slate-900/50 p-6 shadow-2xl shadow-black/30 backdrop-blur-sm'>
          <p className='text-sm text-slate-400'>
            This listening club feature is provided for educational purposes only. All rights to the original audio and transcription belong to the original creator Tamil Language Centre.
          </p>
          <p className='mt-2 text-sm text-slate-400'>
            Original creator: <a href='https://www.tamillanguagecentre.com/' className='text-blue-500 hover:text-blue-500 underline'>Tamil Language Centre</a>
          </p>
          <p className='mt-2 text-sm text-slate-400'>
            Support them by purchasing products on their website or donating to their gofundme.
          </p>
        </section>

        {/* Song card */}
        <section className='rounded-3xl border border-white/5 bg-slate-900/50 p-6 shadow-2xl shadow-black/30 backdrop-blur-sm'>
          <div className='flex items-center gap-4'>
            <img
              src='/audio/listening-club/TLClogocircle.avif'
              alt='Tamil Language Centre logo'
              width={96}
              height={96}
              className='h-24 w-24 rounded-2xl object-cover shadow-lg shadow-black/40 ring-1 ring-white/10'
            />
            <div className='min-w-0'>
              <p className='mt-1 text-sm text-slate-400'>Nov 19 Meiyazhagan</p>
            </div>
          </div>

          <audio ref={audioRef} src={audioSrc} preload='auto' />

          {/* Progress */}
          <div className='mt-6'>
            <div className='mb-2 flex items-center justify-between text-xs font-medium tabular-nums text-slate-500'>
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <input
              type='range'
              min='0'
              max={duration || 0}
              step='0.1'
              value={Math.min(currentTime, duration || 0)}
              onChange={handleSeek}
              aria-label='Seek'
              className='w-full cursor-pointer accent-amber-400'
            />
          </div>

          {/* Controls */}
          <div className='mt-6 flex flex-wrap items-center gap-4'>
            <button
              type='button'
              onClick={handlePlayPause}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              className='flex h-14 w-14 items-center justify-center rounded-full bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/30 transition hover:bg-amber-300 active:scale-95'
            >
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>

            <div className='flex items-center gap-2 text-slate-400'>
              <VolumeIcon />
              <input
                type='range'
                min='0'
                max='1'
                step='0.01'
                value={volume}
                onChange={handleVolumeChange}
                aria-label='Volume'
                className='w-24 cursor-pointer accent-amber-400'
              />
              <span className='w-9 text-right text-xs tabular-nums text-slate-500'>
                {Math.round(volume * 100)}%
              </span>
            </div>

            {/* Loop button */}
            <button
              type='button'
              onClick={handleToggleLoop}
              aria-pressed={isLooping}
              aria-label={
                isLooping
                  ? `Stop looping line ${(loopAnchorIndex ?? 0) + 1}`
                  : 'Loop current line'
              }
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${isLooping
                ? 'border-purple-400 bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                : 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
                }`}
            >
              <LoopIcon />
              {isLooping
                ? `Looping line ${(loopAnchorIndex ?? 0) + 1}`
                : 'Loop line'}
            </button>

            {/* Hide Transcript */}
            <button
              type='button'
              onClick={handleToggleTranscript}
              aria-pressed={isTranscriptVisible}
              aria-label={
                isTranscriptVisible
                  ? 'Hide transcript'
                  : 'Show transcript'
              }
              className='flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all'
            >
              <TranscriptIcon />
              {isTranscriptVisible ? 'Hide Transcript' : 'Show Transcript'}
            </button>
          </div>
        </section>

        {/* Caption stage */}
        {isTranscriptVisible && (
          <section
            className={`relative overflow-hidden rounded-3xl border bg-slate-900/50 p-8 shadow-2xl shadow-black/30 backdrop-blur-sm transition-colors md:p-12 ${isLooping ? 'border-violet-500/40' : 'border-white/5'
              }`}
          >
            {isLooping && (
              <div className='absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-violet-500/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-violet-300 ring-1 ring-violet-500/30'>
                <LoopIcon className='h-3 w-3' />
                Loop
              </div>
            )}

            <div className='flex min-h-[280px] flex-col items-center justify-center gap-2 text-center'>
              {renderAdjacent(-3)}
              {renderAdjacent(-2)}
              {renderAdjacent(-1)}

              <div className='my-3 md:my-4'>
                <ProgressiveHighlightingCaption
                  text={currentCaption?.text || ''}
                  highlightRatio={highlightRatio}
                />
              </div>

              {renderAdjacent(1)}
              {renderAdjacent(2)}
              {renderAdjacent(3)}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

// ── Caption rendering ────────────────────────────────────────────────

function ProgressiveHighlightingCaption({
  text,
  highlightRatio,
}: {
  text: string;
  highlightRatio: number;
}) {
  return (
    <div className='whitespace-pre-wrap text-2xl font-bold leading-relaxed tracking-tight md:text-3xl'>
      {text.split('').map((char, index) => {
        const threshold = text.length > 0 ? index / text.length : 0;
        const isHighlighted = highlightRatio >= threshold;
        return (
          <span
            key={index}
            className={
              isHighlighted
                ? 'text-amber-300 [text-shadow:0_0_24px_rgba(252,211,77,0.55)]'
                : 'text-slate-100'
            }
            style={{
              transition: 'color 0.15s linear, text-shadow 0.15s linear',
            }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
}

// ── Icons ────────────────────────────────────────────────────────────

function PlayIcon() {
  return (
    <svg
      className='h-6 w-6 translate-x-[1px]'
      fill='currentColor'
      viewBox='0 0 24 24'
      aria-hidden='true'
    >
      <path d='M8 5v14l11-7z' />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg
      className='h-6 w-6'
      fill='currentColor'
      viewBox='0 0 24 24'
      aria-hidden='true'
    >
      <path d='M6 5h4v14H6zM14 5h4v14h-4z' />
    </svg>
  );
}

function VolumeIcon() {
  return (
    <svg
      className='h-5 w-5'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      viewBox='0 0 24 24'
      aria-hidden='true'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M6 9v6h3l4 4V5L9 9H6z'
      />
    </svg>
  );
}

function LoopIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      viewBox='0 0 24 24'
      aria-hidden='true'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
      />
    </svg>
  );
}

function TranscriptIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      viewBox='0 0 24 24'
      aria-hidden='true'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M8 16h8M8 12h8m-8-4h8M3 6h.01M3 12h.01M3 18h.01M21 6h.01M21 12h.01M21 18h.01'
      />
    </svg>
  );
}