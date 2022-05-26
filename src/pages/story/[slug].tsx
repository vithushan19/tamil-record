import { useRouter } from 'next/router';
import { createClient } from 'next-sanity';
import React, { useEffect, useRef, useState } from 'react';
import Lottie from 'react-lottie';
import { useDispatch, useSelector } from 'react-redux';

import Line from '@/components/stories/Line';
import Matching, { Pair } from '@/components/stories/Matching';
import MultipleChoice from '@/components/stories/MultipleChoice';

import {
  handleContinue,
  loadStory,
  selectStoryState,
} from '@/features/stories/storySlice';

import * as animationData from '../../../public/anims/story-session-end.json';

interface PageProps {
  storyData: StoryData;
}

export interface StoryData {
  steps: any[];
  title: string;
}

const StoryPage = ({ storyData }: PageProps) => {
  const storyEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentStep, isSessionEnd, isContinueEnabled } =
    useSelector(selectStoryState);

  const onNextClick = () => {
    if (isSessionEnd) {
      router.push('/stories');
    } else {
      dispatch(handleContinue());
    }
  };

  useEffect(() => {
    dispatch(loadStory(storyData));
  }, []);

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
      <div className='sticky z-10 w-full p-4 shadow-md'>
        <div className='py-4 font-bold '>{storyData.title}</div>
        <div className='w-full h-3 bg-gray-200 rounded-full dark:bg-gray-700'>
          <div
            className='h-3 transition-all transform rounded-full bg-charmander'
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
          <div className='overflow-hidden rounded-lg bg-rattata'>
            <Lottie options={defaultOptions} height={400} width={400} />
          </div>
        </div>
      ) : (
        <div className='flex-grow w-full overflow-auto '>
          {storyData.steps.slice(0, currentStep).map((step) => (
            <div key={step._id}>
              {step._type === 'line' ? (
                <div className='m-4 overflow-hidden bg-red-400 rounded-lg'>
                  <Line
                    avatarUrl={step.character.imageUrl}
                    text={step.text}
                    translation={step.translation}
                  />
                </div>
              ) : step._type === 'multipleChoice' ? (
                <MultipleChoice question={step.title} choices={step.choices} />
              ) : step._type === 'matching' ? (
                <Matching
                  title={step.title}
                  pairs={step.pairs.map((it: Pair) => {
                    return { text: it.text, translation: it.translation };
                  })}
                />
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
          className='w-full p-4 m-4 font-bold text-white rounded-md bg-charmander disabled:bg-gray-400'
          disabled={!isContinueEnabled}
          onClick={onNextClick}
        >
          Continue
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

export async function getStaticPaths() {
  return {
    paths: [{ params: { slug: 'good-morning' } }],
    fallback: false,
  };
}

export async function getStaticProps(context: any) {
  const slug = context.params.slug;

  const sanityResponse = await client.fetch(
    `*[_type == "story" && slug == "${slug}"]
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

export default StoryPage;
