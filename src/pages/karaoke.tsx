import { useEffect, useRef, useState } from 'react';

import Navbar from '@/components/Navbar';

const captions = [
  {
    transliteration: '...Whoa Whoa Whoa... Whoa Whoa Whoa... Whoa Whoa Whoa...',
    timestamp: 0,
  },
  { transliteration: 'Idhazhin Oru Oram', timestamp: 17 },
  { transliteration: 'Sirithaai Anbe', timestamp: 21 },
  { transliteration: 'Nijamaai Ithu Pothum', timestamp: 25 },
  { transliteration: 'Siripaal Anbe', timestamp: 30 },
  { transliteration: 'En Naadiyai Silirka Vaithai', timestamp: 34 },
  { transliteration: 'En Iravellam Velicham Thanthaai', timestamp: 38.5 },
  {
    transliteration: 'En Aan Karvam Maranthinru Un Munne Paniya Vaithai',
    timestamp: 42.5,
  },
  {
    transliteration: '... ... ...',
    timestamp: 48,
  },
  {
    transliteration: '...Whoa Whoa Whoa... Whoa Whoa Whoa... Whoa Whoa Whoa...',
    timestamp: 62,
  },
  { transliteration: 'Sollu Nee I Love You', timestamp: 82.5 },
  { transliteration: 'Ne Thaan En Kurunji Poo', timestamp: 85.5 },
  { transliteration: 'En Kadhal Enrum True', timestamp: 88 },
  { transliteration: 'Will Make Sure You’ll Never Feel Blue!', timestamp: 90 },
  { transliteration: '... ... ...', timestamp: 93 },
  { transliteration: 'Oh..ellam Maranthu Un Pinne Varuven', timestamp: 100 },
  {
    transliteration: 'Ne Sammathithaal Naan Nilavayum Tharuven',
    timestamp: 105.5,
  },
  {
    transliteration: 'Un Nizhal Tharai Padum Dhooram Nadanthen',
    timestamp: 110,
  },
  {
    transliteration: 'Antha Nodiyai Thaan Kavithai Varainthen',
    timestamp: 114.5,
  },
  { transliteration: 'Oh Penne En Kanne', timestamp: 118.5 },
  { transliteration: 'Senthene Vaa Munne', timestamp: 121 },
  { transliteration: 'En Uyirukul Peyarai Vaithai', timestamp: 122.5 },
  { transliteration: 'En Naadiyai Silirka Vaithai', timestamp: 127 },
  { transliteration: 'En Iravellam Velicham Thanthaai', timestamp: 131 },
  {
    transliteration: 'En Aan Karvam Maranthinru Un Munne Paniya Vaithai',
    timestamp: 135.5,
  },
  { transliteration: '... ... ...', timestamp: 141 },

  { transliteration: 'Oh Penne En Kanne', timestamp: 157.5 },
  { transliteration: 'Senthene Vaa Munne', timestamp: 160 },
  { transliteration: 'En Uyirukul Peyarai Vaithai', timestamp: 162.5 },
  { transliteration: 'Oh Penne En Kanne', timestamp: 167 },
  { transliteration: 'Senthene Vaa Munne', timestamp: 169.5 },
  { transliteration: 'En Uyirukul Peyarai Vaithai', timestamp: 172 },
  { transliteration: 'Sollu Nee I Love You', timestamp: 177 },
  { transliteration: 'Ne Thaan En Kurunji Poo', timestamp: 179.25 },
  { transliteration: 'En Kadhal Enrum True', timestamp: 181.8 },
  {
    transliteration: 'Will Make Sure You’ll Never Feel Blue!',
    timestamp: 183.25,
  },
  { transliteration: '(Oh Penne) Sollu Nee I Love You', timestamp: 185 },
  { transliteration: 'Ne Thaan En Kurunji Poo', timestamp: 188.25 },
  { transliteration: '(Oh Penne) En Kadhal Enrum True', timestamp: 190 },
  {
    transliteration: 'Will Make Sure You’ll Never Feel Blue!',
    timestamp: 192.25,
  },
  {
    transliteration: 'Oh Penne',
    timestamp: 194.25,
  },
  {
    transliteration: '... ... ...',
    timestamp: 197.25,
  },
];

export default function KaraokePage() {
  const audioSrc = '/audio/idhazhinOram/orginal-song.mp3';
  const instrumentalAudioSrc = '/audio/idhazhinOram/instrumental.wav';
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0); // Total duration of the audio
  const [volume, setVolume] = useState<number>(1); // Default volume: 1 (100%)
  const [useInstrumental, setUseInstrumental] = useState<boolean>(false);

  useEffect(() => {
    if (audioRef.current) {
      const handleLoadedMetadata = () => {
        setDuration(audioRef.current?.duration || 0);
      };

      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);

      return () => {
        audioRef.current?.removeEventListener(
          'loadedmetadata',
          handleLoadedMetadata
        );
      };
    }
  }, []);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(event.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const getCurrentCaption = () => {
    const currentCaption = captions.find(
      (caption, index) =>
        currentTime >= caption.timestamp &&
        (index === captions.length - 1 ||
          currentTime < captions[index + 1].timestamp)
    );
    const currentCaptionIndex = captions.findIndex(
      (caption, index) =>
        currentTime >= caption.timestamp &&
        (index === captions.length - 1 ||
          currentTime < captions[index + 1].timestamp)
    );
    return { caption: currentCaption, index: currentCaptionIndex };
  };

  const { caption, index } = getCurrentCaption();
  const nextStartTime = captions[index + 1]?.timestamp;
  const totalDuration = nextStartTime - (caption?.timestamp ?? 0);
  const timeElapsed = currentTime - (caption?.timestamp ?? 0);
  const highlightRatio = timeElapsed / totalDuration;

  return (
    <div className='flex flex-col w-full bg-gray-200'>
      <Navbar />
      <div className='flex flex-col items-center justify-center p-16 pt-8'>
        <h3>Idhazhin Oram</h3>
        <img
          src='/audio/idhazhinOram/thumbnail.jpg'
          alt='Idhazhin Oram'
          width={150}
          height={150}
        />
        <audio
          ref={audioRef}
          src={useInstrumental ? instrumentalAudioSrc : audioSrc}
          onTimeUpdate={handleTimeUpdate}
          preload='metadata'
        />
        <div>
          <button onClick={handlePlayPause}>
            {audioRef.current?.paused ? 'Play' : 'Pause'}
          </button>
        </div>
        <div>
          <label htmlFor='instrumental-control'>Instrumental: </label>
          <input
            id='instrumental-control'
            type='checkbox'
            checked={useInstrumental}
            onChange={() => setUseInstrumental(!useInstrumental)}
          />
        </div>
        <div>
          <label htmlFor='seek-control'>Seek: </label>
          <input
            id='seek-control'
            type='range'
            min='0'
            max={duration}
            step='0.1'
            value={currentTime}
            onChange={handleSeek}
          />
        </div>
        <div>
          <label htmlFor='volume-control'>Volume: </label>
          <input
            id='volume-control'
            type='range'
            min='0'
            max='1'
            step='0.01'
            value={volume}
            onChange={handleVolumeChange}
          />
          <span>{Math.round(volume * 100)}%</span>
        </div>
        <p>Current Timestamp: {currentTime.toFixed(2)} seconds</p>
        <p>Total Duration: {duration.toFixed(2)} seconds</p>

        {/* current caption */}
        <div className='flex flex-col items-center w-full p-4 text-gray-300 bg-blue-800'>
          {/* prev 3 captions */}
          {captions[index - 3] && <p>{captions[index - 3]?.transliteration}</p>}
          {captions[index - 2] && <p>{captions[index - 2]?.transliteration}</p>}
          {captions[index - 1] && <p>{captions[index - 1]?.transliteration}</p>}
          <ProgressiveHighlightingCaption
            text={getCurrentCaption().caption?.transliteration || ''}
            highlightRatio={highlightRatio}
          />
          {/* next 3 captions */}
          {captions[index + 1] && <p>{captions[index + 1]?.transliteration}</p>}
          {captions[index + 2] && <p>{captions[index + 2]?.transliteration}</p>}
          {captions[index + 3] && <p>{captions[index + 3]?.transliteration}</p>}
        </div>
      </div>
    </div>
  );
}

const ProgressiveHighlightingCaption = ({
  text,
  highlightRatio,
}: {
  text: string;
  highlightRatio: number;
}) => {
  return (
    <div
      style={{
        marginTop: '20px',
        marginBottom: '20px',
        fontSize: '24px',
        fontWeight: 'bold',
        whiteSpace: 'pre-wrap',
      }}
    >
      {text.split('').map((char, index) => {
        const charHighlightThreshold = index / text.length;
        const isHighlighted = highlightRatio >= charHighlightThreshold;

        return (
          <HighlightableSpan
            key={index}
            char={char}
            isHighlighted={isHighlighted}
          />
        );
      })}
    </div>
  );
};

const HighlightableSpan = ({
  char,
  isHighlighted,
}: {
  char: string;
  isHighlighted: boolean;
}) => {
  return (
    <span
      style={{
        color: isHighlighted ? 'yellow' : 'white',
        transition: 'color 0.1s linear',
      }}
    >
      {char}
    </span>
  );
};
