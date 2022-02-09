import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player/youtube';

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
  const [currentIndex, setCurrentIndex] = useState<number>(0);

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
    setCurrentIndex(Math.max(0, currentSubtitleIndex));
  };

  return (
    <>
      <div className='w-full p-4 font-bold bg-blue-200'>Learn Thamizh</div>
      <div className='w-full '>
        <ReactPlayer
          width={'100%'}
          url='https://www.youtube.com/watch?v=9UiTj9c3H54'
          onProgress={handleOnProgress}
          controls={true}
        />

        {subTitlesTamil &&
          subTitlesTamil[currentIndex] &&
          subTitlesTrans &&
          subTitlesTrans[currentIndex] &&
          subTitlesEnglish &&
          subTitlesEnglish[currentIndex] && (
            <div className='flex-wrap p-8 m-4 text-xl bg-gray-100 rounded-md shadow-md h-80'>
              <div>
                <div className='flex flex-row m-2'>
                  <p className='bg-red-400 rounded-r-lg max-w-xs text-center w-1/5 break-words'>
                    தமிழ்
                  </p>
                  <p className='w-full m-2 text-red-900'>
                    {subTitlesTamil[currentIndex].text}
                  </p>
                </div>
                <div className='flex flex-row m-2'>
                  {' '}
                  <p className='bg-green-400 rounded-r-lg max-w-xs text-center  break-words w-1/5'>
                    Transliteration
                  </p>
                  <p className='w-full m-2 text-green-900'>
                    {subTitlesTrans[currentIndex].text}
                  </p>
                </div>
                <div className='flex flex-row m-2'>
                  {' '}
                  <p className='bg-blue-400 rounded-r-lg max-w-xs text-center  break-words w-1/5'>
                    English
                  </p>{' '}
                  <p className='w-full m-2 text-blue-900'>
                    {subTitlesEnglish[currentIndex].text}
                  </p>
                </div>
              </div>
            </div>
          )}
      </div>
    </>
  );
};

export default Learn;
