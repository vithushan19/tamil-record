import React, { useEffect } from 'react';
import ReactPlayer from 'react-player/youtube';

import { getSubtitles } from './api/generateSubtitles';

const Learn = () => {
  useEffect(() => {
    getSubtitles().then((res) =>
      // TODO initialize subtitle
      {
        // no op
      }
    );
  }, []);

  const handleOnProgress = (data) => {
    // TODO handle video progress updates
  };

  return (
    <ReactPlayer
      url='https://www.youtube.com/watch?v=9UiTj9c3H54'
      onProgress={handleOnProgress}
    />
  );
};

export default Learn;
