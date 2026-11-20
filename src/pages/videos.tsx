import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player/youtube';

import Navbar from '@/components/Navbar';

import {
  getSubtitlesEnglish,
  getSubtitlesTamil,
  getSubtitlesTransliteration,
} from './api/generateSubtitles';
import { convertTimeStamp } from './api/time';

type Subtitle = {
  text: string;
  startTime: string;
  endTime: string;
  id: string;
};

type PlayerUpdate = {
  playedSeconds: number;
};

const Learn = () => {
  const [subTitlesTamil, setSubTitlesTamil] = useState<Subtitle[]>([]);
  const [subTitlesTrans, setSubTitlesTrans] = useState<Subtitle[]>([]);
  const [subTitlesEnglish, setSubTitlesEnglish] = useState<Subtitle[]>([]);
  const [isLoop, setIsLoop] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const playerRef = useRef<ReactPlayer>(null);

  const [isThamizhVisible, setIsThamizhVisible] = useState<boolean>(true);
  const [isTransliterationVisible, setIsTransliterationVisible] =
    useState<boolean>(true);
  const [isTranslationVisible, setIsTranslationVisible] =
    useState<boolean>(true);

  useEffect(() => {
    getSubtitlesTamil().then((res) => {
      setSubTitlesTamil(res);
      setCurrentIndex(0);
    });
    getSubtitlesTransliteration().then((res) => {
      setSubTitlesTrans(res);
      setCurrentIndex(0);
    });
    getSubtitlesEnglish().then((res) => {
      setSubTitlesEnglish(res);
      setCurrentIndex(0);
    });
  }, []);

  const handleOnProgress = (data: PlayerUpdate) => {
    const currentSubtitleIndex = subTitlesTamil.findIndex(
      (sub) =>
        data.playedSeconds >= convertTimeStamp(sub.startTime) &&
        data.playedSeconds <= convertTimeStamp(sub.endTime)
    );
    if (isLoop && currentSubtitleIndex !== currentIndex) {
      playerRef.current?.seekTo(
        convertTimeStamp(subTitlesTamil[currentIndex].startTime)
      );
    } else {
      setCurrentIndex(Math.max(0, currentSubtitleIndex));
    }
  };

  const isLoaded =
    subTitlesTamil.length > 0 &&
    subTitlesTrans.length > 0 &&
    subTitlesEnglish.length > 0;

  const current = isLoaded ? subTitlesTamil[currentIndex] : null;
  const currentTrans = isLoaded ? subTitlesTrans[currentIndex] : null;
  const currentEnglish = isLoaded ? subTitlesEnglish[currentIndex] : null;

  return (
    <div className='min-h-screen bg-slate-950 text-slate-100'>
      <Navbar />

      {/* Header */}
      <div className='border-b border-white/10 bg-slate-950/80 backdrop-blur'>
        <div className='mx-auto max-w-5xl px-4 py-6'>
          <h1 className='text-3xl font-bold tracking-tight text-center'>
            Music Videos
          </h1>
          <p className='mt-1 text-center text-sm text-slate-400'>
            Follow along with the lyrics, one line at a time.
          </p>
        </div>
      </div>

      <main className='mx-auto max-w-5xl px-4 py-6 space-y-6'>
        {/* Video */}
        <div className='overflow-hidden rounded-2xl bg-black shadow-2xl shadow-black/50 ring-1 ring-white/10'>
          <ReactPlayer
            playing={true}
            ref={playerRef}
            width={'100%'}
            url='https://www.youtube.com/watch?v=9UiTj9c3H54'
            onProgress={handleOnProgress}
            controls={true}
          />
        </div>

        {/* Toolbar */}
        <div className='flex flex-wrap items-center gap-2'>
          <button
            type='button'
            onClick={() => setIsThamizhVisible((v) => !v)}
            aria-pressed={isThamizhVisible}
            className={`group flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${isThamizhVisible
              ? 'border-red-500 bg-red-500 text-white shadow-lg shadow-red-500/25'
              : 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
              }`}
          >
            <span
              className={`h-2 w-2 rounded-full transition-colors ${isThamizhVisible ? 'bg-white' : 'bg-red-400'
                }`}
            />
            தமிழ்
          </button>

          <button
            type='button'
            onClick={() => setIsTransliterationVisible((v) => !v)}
            aria-pressed={isTransliterationVisible}
            className={`group flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${isTransliterationVisible
              ? 'border-green-500 bg-green-500 text-white shadow-lg shadow-green-500/25'
              : 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
              }`}
          >
            <span
              className={`h-2 w-2 rounded-full transition-colors ${isTransliterationVisible ? 'bg-white' : 'bg-green-400'
                }`}
            />
            Transliteration
          </button>

          <button
            type='button'
            onClick={() => setIsTranslationVisible((v) => !v)}
            aria-pressed={isTranslationVisible}
            className={`group flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${isTranslationVisible
              ? 'border-blue-500 bg-blue-500 text-white shadow-lg shadow-blue-500/25'
              : 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
              }`}
          >
            <span
              className={`h-2 w-2 rounded-full transition-colors ${isTranslationVisible ? 'bg-white' : 'bg-blue-400'
                }`}
            />
            English
          </button>

          <div className='ml-auto' />

          <button
            type='button'
            onClick={() => setIsLoop((v) => !v)}
            aria-pressed={isLoop}
            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${isLoop
              ? 'border-violet-500 bg-violet-500 text-white shadow-lg shadow-violet-500/25'
              : 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
              }`}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-4 w-4'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
              />
            </svg>
            {isLoop ? 'Looping line' : 'Loop line'}
          </button>
        </div>

        {/* Subtitle display */}
        {!isLoaded ? (
          <div className='rounded-2xl border border-white/10 bg-slate-900/60 p-10 text-center text-sm text-slate-400'>
            Loading subtitles…
          </div>
        ) : (
          <section className='space-y-3'>
            {/* Meta row */}
            <div className='flex items-center justify-between px-1 text-xs text-slate-500'>
              <span className='font-medium uppercase tracking-wider'>
                Line {currentIndex + 1} of {subTitlesTamil.length}
              </span>
              {current && (
                <span className='tabular-nums'>
                  {current.startTime} — {current.endTime}
                </span>
              )}
            </div>

            {/* Tamil */}
            {isThamizhVisible && current && (
              <div className='rounded-2xl border-l-4 border-l-rose-500 bg-slate-900 p-5 shadow-lg shadow-black/20 transition-all'>
                <p className='mb-2 text-[10px] font-semibold uppercase tracking-widest text-rose-400'>
                  தமிழ்
                </p>
                <p className='text-3xl font-semibold leading-snug text-rose-50'>
                  {current.text}
                </p>
              </div>
            )}

            {/* Transliteration */}
            {isTransliterationVisible && currentTrans && (
              <div className='rounded-2xl border-l-4 border-l-emerald-500 bg-slate-900 p-5 shadow-lg shadow-black/20 transition-all'>
                <p className='mb-2 text-[10px] font-semibold uppercase tracking-widest text-emerald-400'>
                  Transliteration
                </p>
                <p className='text-xl font-medium leading-snug text-emerald-50'>
                  {currentTrans.text}
                </p>
              </div>
            )}

            {/* English */}
            {isTranslationVisible && currentEnglish && (
              <div className='rounded-2xl border-l-4 border-l-sky-500 bg-slate-900 p-5 shadow-lg shadow-black/20 transition-all'>
                <p className='mb-2 text-[10px] font-semibold uppercase tracking-widest text-sky-400'>
                  English
                </p>
                <p className='text-lg leading-snug text-sky-50/90'>
                  {currentEnglish.text}
                </p>
              </div>
            )}

            {/* All toggles off */}
            {!isThamizhVisible &&
              !isTransliterationVisible &&
              !isTranslationVisible && (
                <div className='rounded-2xl border border-dashed border-white/10 bg-slate-900/40 p-10 text-center text-sm text-slate-500'>
                  All languages hidden — tap a toggle above to show them again.
                </div>
              )}
          </section>
        )}
      </main>
    </div>
  );
};

export default Learn;