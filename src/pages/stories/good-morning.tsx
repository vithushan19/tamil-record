import { createClient } from 'next-sanity';
import React, { useEffect, useRef, useState } from 'react';

import Line from '@/components/stories/Line';

interface PageProps {
  storyData: StoryData;
}

interface StoryData {
  steps: any[];
}

const GoodMorning = ({ storyData }: PageProps) => {
  const [currentStep, setStep] = useState(1);
  const onNextClick = () => {
    setStep(Math.min(storyData.steps.length, currentStep + 1));
  };
  const onPreviousClick = () => {
    setStep(Math.max(0, currentStep - 1));
  };

  return (
    <div className='w-full'>
      <div className='p-4 font-bold bg-blue-200 '>Good Morning</div>
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
      <div className='w-full'>
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
              <p className='w-full m-4 overflow-auto bg-red-50'>
                {JSON.stringify(step)}
              </p>
            )}
          </div>
        ))}
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
