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
  const [isTranslationhVisible, setIsTranslationVisible] =
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

  const handleThamizhClick = () => {
    setIsThamizhVisible(!isThamizhVisible);
  };
  const handleTransliterationClick = () => {
    setIsTransliterationVisible(!isTransliterationVisible);
  };
  const handleTranslationClick = () => {
    setIsTranslationVisible(!isTranslationhVisible);
  };
  const handleLoopClick = () => {
    setIsLoop(!isLoop);
  };

  return (
    <>
      <Navbar />

      <div className='sticky z-10 w-full p-4 bg-white shadow-md'>
        <div className='py-4 font-bold '>
          <h1 className='text-3xl text-center'>Music Videos</h1>
        </div>
      </div>
      <div className='bg-blue-900'>
        <div className='w-full bg-gray-200 '>
          <div className='overflow-hidden border-0 border-blue-300 sm:p-4 sm:rounded-xl'>
            <ReactPlayer
              playing={true}
              ref={playerRef}
              width={'100%'}
              url='https://www.youtube.com/watch?v=9UiTj9c3H54'
              onProgress={handleOnProgress}
              controls={true}
            />
          </div>

          <div className='flex w-full gap-2 px-4 py-4 '>
            <div className='flex justify-around w-full'>
              <div
                onClick={handleThamizhClick}
                className={`hover:bg-red-200 text-lg p-2 flex cursor-pointer flex-col justify-center rounded-lg max-w-xs text-center break-words align-middle ${
                  isThamizhVisible ? 'bg-red-400' : 'bg-red-200'
                }`}
              >
                <p>தமிழ்</p>
              </div>
              <div
                onClick={handleTransliterationClick}
                className={`hover:bg-green-200 text-lg p-2 flex cursor-pointer flex-col justify-center rounded-lg max-w-xs text-center break-words align-middle ${
                  isTransliterationVisible ? 'bg-green-400' : 'bg-green-200'
                }`}
              >
                <p>Transliteration</p>
              </div>
              <div
                onClick={handleTranslationClick}
                className={`hover:bg-blue-200 text-lg p-2 flex cursor-pointer flex-col justify-center rounded-lg max-w-xs text-center break-words align-middle ${
                  isTranslationhVisible ? 'bg-blue-400' : 'bg-blue-200'
                }`}
              >
                <p>English</p>
              </div>{' '}
              <div
                className={`flex p-2 items-center cursor-pointer  focus:border-2 hover:bg-purple-200  focus:border-purple-700 justify-center  rounded-xl ${
                  isLoop ? 'bg-purple-200' : 'bg-purple-400'
                }`}
                onClick={handleLoopClick}
              >
                <p>Loop</p>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='w-6 h-6'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                  />
                </svg>
              </div>
            </div>
          </div>
          {subTitlesTamil &&
            subTitlesTamil[currentIndex] &&
            subTitlesTrans &&
            subTitlesTrans[currentIndex] &&
            subTitlesEnglish &&
            subTitlesEnglish[currentIndex] && (
              <div className='flex-wrap h-screen p-4 font-mono bg-gray-900 border-2 border-blue-300 rounded-md shadow-md md:m-4 md:text-xl'>
                <div>
                  {isThamizhVisible && (
                    <div className='flex flex-row m-2'>
                      <p className='w-full p-4 m-2 text-xl text-red-500 bg-white rounded'>
                        {subTitlesTamil[currentIndex].text}
                      </p>
                    </div>
                  )}
                  {isTransliterationVisible && (
                    <div className='flex flex-row m-2'>
                      {' '}
                      <p className='w-full p-4 m-2 text-green-500 bg-white rounded'>
                        {subTitlesTrans[currentIndex].text}
                      </p>
                    </div>
                  )}
                  {isTranslationhVisible && (
                    <div className='flex flex-row m-2'>
                      {' '}
                      <p className='w-full p-4 m-2 text-blue-500 bg-white rounded'>
                        {subTitlesEnglish[currentIndex].text}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
        </div>
      </div>
    </>
  );
};

export default Learn;
