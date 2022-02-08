import React from 'react';
import ReactPlayer from 'react-player/youtube';

const Learn = () => {
  const handleOnProgress = (data) => {
    console.log(data);
  };

  return (
    <ReactPlayer
      url='https://www.youtube.com/watch?v=ysz5S6PUM-U'
      onProgress={handleOnProgress}
    />
  );
};

export default Learn;
