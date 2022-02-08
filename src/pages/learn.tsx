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
    <div className='whitespace-pre'>
      {JSON.stringify(subTitles[currentIndex])}
      <p>TEST</p>
      <ReactPlayer
        url='https://www.youtube.com/watch?v=9UiTj9c3H54'
        onProgress={handleOnProgress}
        controls={true}
      />

      {subTitles && subTitles[currentIndex] && (
        <p>{subTitles[currentIndex].text}</p>
      )}
    </div>
  );
};

export default Learn;
