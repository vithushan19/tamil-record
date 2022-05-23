import { createClient } from 'next-sanity';
import React, { useEffect, useRef, useState } from 'react';
import Lottie from 'react-lottie';

import Line from '@/components/stories/Line';

import * as animationData from '../../../public/anims/story-session-end.json';

interface PageProps {
  storyData: StoryData;
}

interface StoryData {
  steps: any[];
  title: string;
}

const GoodMorning = ({ storyData }: PageProps) => {
  const [currentStep, setStep] = useState(1);
  const storyEndRef = useRef<HTMLDivElement>(null);
  const [isSessionEnd, setSessionEnd] = useState(false);

  const onNextClick = () => {
    if (currentStep === storyData.steps.length) {
      setSessionEnd(true);
    }
    setStep(Math.min(storyData.steps.length, currentStep + 1));
  };
  const onPreviousClick = () => {
    setSessionEnd(false);
    setStep(Math.max(0, currentStep - 1));
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentStep]);

  const scrollToBottom = () => {
    storyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div className='flex flex-col w-full h-screen'>
      <div className='sticky z-10 w-full p-4 shadow-md bg-primary-200'>
        <div className='py-4 font-bold bg-primary-200 '>{storyData.title}</div>
        <div className='w-full h-3 bg-gray-200 rounded-full dark:bg-gray-700'>
          <div
            className='h-3 transition-all transform rounded-full bg-primary-600'
            style={{
              width: `${(currentStep * 100) / storyData.steps.length}%`,
            }}
          ></div>
        </div>
      </div>
      {isSessionEnd ? (
        <div className='flex-grow w-full p-4 overflow-auto'>
          <h2 className='mb-4 text-xl font-bold text-center'>
            Congratulations! You completed a story.
          </h2>
          <div className='overflow-hidden rounded-lg bg-primary-400'>
            <Lottie options={defaultOptions} height={400} width={400} />
          </div>
        </div>
      ) : (
        <div className='flex-grow w-full overflow-auto'>
          {storyData.steps.slice(0, currentStep).map((step) => (
            <div key={step._id}>
              {step._type === 'line' ? (
                <div className='m-4 bg-red-400'>
                  <Line
                    avatarUrl={step.character.imageUrl}
                    text={step.text}
                    translation={step.translation}
                  />
                </div>
              ) : (
                <div className='my-4'>
                  <p className='mx-4 overflow-auto text-lg font-bold bg-red-50'>
                    Placeholder for component: {step._type}
                  </p>
                  <p className='mx-4 overflow-auto bg-red-50'>
                    {JSON.stringify(step)}
                  </p>
                </div>
              )}
            </div>
          ))}
          <div style={{ float: 'left', clear: 'both' }} ref={storyEndRef}></div>
        </div>
      )}
      <div className='flex justify-center'>
        <button
          className='p-4 m-4 rounded-md bg-primary-500'
          onClick={onNextClick}
        >
          Next
        </button>
        <button
          className='p-4 m-4 rounded-md bg-primary-500'
          onClick={onPreviousClick}
        >
          Previous
        </button>
      </div>
    </div>
  );
};

const client = createClient({
  projectId: 'odjc966y',
  dataset: 'production',
  apiVersion: '2022-03-25',
  useCdn: false,
});

export async function getStaticProps() {
  const sanityResponse = await client.fetch(
    `*[_type == "story"]
    {
      title, 
      steps[]->{
        ..., 
        character->{
          ..., 
          "imageUrl": avatar.asset->url
        }
      } 
    }`
  );
  return {
    props: {
      storyData: sanityResponse[0],
    },
  };
}

export default GoodMorning;
