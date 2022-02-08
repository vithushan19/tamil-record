import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player/youtube';

import { getSubtitles } from './api/generateSubtitles';
import { convertTimeStamp } from './api/time';

type Subtitle = {
  text: string;
  startTime: string;
  endTime: string;
  id: string;
};

const Learn = () => {
  const [subTitles, setSubTitles] = useState<Subtitle[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    getSubtitles().then((res) =>
      // TODO initialize subtitle
      {
        setSubTitles(res);
        setCurrentIndex(0);
      }
    );
  }, []);

  const handleOnProgress = (data) => {
    //We have time
    //Create a funct to take in time and get subtitles for that interval
    console.log(data.playedSeconds);
    const currentSubtitleIndex = subTitles.findIndex(
      (sub) =>
        data.playedSeconds >= convertTimeStamp(sub.startTime) &&
        data.playedSeconds <= convertTimeStamp(sub.endTime)
    );
    setCurrentIndex(Math.max(0, currentSubtitleIndex));
    console.log(
      currentSubtitleIndex,
      JSON.stringify(data.playedSeconds),
      JSON.stringify(subTitles[0].startTime),
      JSON.stringify(subTitles[0].endTime),
      JSON.stringify(subTitles[0].text)
    );
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

        {subTitles && subTitles[currentIndex] && (
          <div className='flex-wrap p-8 m-4 text-xl bg-gray-100 rounded-md shadow-md h-80'>
            <p className='w-full'>{subTitles[currentIndex].text}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Learn;
