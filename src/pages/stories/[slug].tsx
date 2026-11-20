import { useRouter } from 'next/router';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Arrange from '@/components/stories/Arrange';
import Line from '@/components/stories/Line';
import Matching from '@/components/stories/Matching';
import MultipleChoice from '@/components/stories/MultipleChoice';

import {
  handleContinue,
  loadStory,
  selectStoryState,
} from '@/features/stories/storySlice';

import * as animationData from '../../../public/anims/story-session-end.json';
import { STORY_DATA } from '../api/storyData';

import dynamic from 'next/dynamic';

const Lottie = dynamic(() => import('react-lottie'), {
  ssr: false,
  loading: () => <div className='h-[400px] w-[400px]' />,
});

// ── Types ─────────────────────────────────────────────────────────────

export interface StoryCharacter {
  _id: string;
  name: string | null;
  imageUrl: string | null;
}

export type StoryStep =
  | {
    _id: string;
    _type: 'line';
    text: string | null;
    translation: string | null;
    transliteration: string | null;
    character: StoryCharacter | null;
  }
  | {
    _id: string;
    _type: 'multipleChoice';
    title: string;
    choices: { _key: string; title: string; isCorrect: boolean }[];
  }
  | {
    _id: string;
    _type: 'matching';
    title: string;
    pairs: { _key: string; text: string | null; translation: string | null }[];
  }
  | {
    _id: string;
    _type: 'arrange';
    instruction?: string;
    translation: string;
    parts: string[];
    answer?: string;
  };

export interface StoryData {
  _id: string;
  slug: string;
  title: string;
  imageUrl: string | null;
  steps: StoryStep[];
}

interface PageProps {
  storyData: StoryData;
}

// ── Page ──────────────────────────────────────────────────────────────

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
  }, [dispatch, storyData]);

  useEffect(() => {
    storyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentStep]);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: { preserveAspectRatio: 'xMidYMid slice' },
  };

  return (
    <div className='flex flex-col w-full h-screen'>
      <div className='sticky z-10 w-full p-4 shadow-md'>
        <div className='py-4 font-bold'>{storyData.title}</div>
        <div className='w-full h-3 bg-gray-200 rounded-full dark:bg-gray-700'>
          <div
            className='h-3 transition-all transform rounded-full bg-charmander'
            style={{
              width: `${(currentStep * 100) / storyData.steps.length}%`,
            }}
          />
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
        <div className='flex-grow w-full overflow-auto'>
          {storyData.steps.slice(0, currentStep).map((step) => {
            switch (step._type) {
              case 'line':
                return (
                  <div
                    key={step._id}
                    className='m-4 overflow-hidden bg-red-400 rounded-lg'
                  >
                    <Line
                      // Narrator, Manjula, Daneeta have no avatar in the export
                      avatarUrl={step.character?.imageUrl ?? undefined}
                      // `large-family` lines are translation-only
                      text={step.text ?? step.translation ?? ''}
                      translation={step.translation ?? ''}
                    />
                  </div>
                );

              case 'multipleChoice':
                return (
                  <MultipleChoice
                    key={step._id}
                    question={step.title}
                    choices={step.choices}
                  />
                );

              case 'matching':
                return (
                  <Matching
                    key={step._id}
                    title={step.title}
                    pairs={step.pairs.map((p) => ({
                      text: p.text ?? p.translation ?? '',
                      translation: p.translation ?? '',
                    }))}
                  />
                );

              case 'arrange':
                return (
                  <Arrange
                    key={step._id}
                    parts={step.parts}
                    answer={step.answer}
                    translation={step.translation}
                    instruction={step.instruction}
                    onSolve={() => {
                      // TODO: wire to the same action MultipleChoice/Matching
                      // dispatch to enable the Continue button. Example:
                      // dispatch(setContinueEnabled(true));
                    }}
                  />
                );

              default:
                return null;
            }
          })}
          <div style={{ float: 'left', clear: 'both' }} ref={storyEndRef} />
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

// ── Static generation ────────────────────────────────────────────────

export async function getStaticPaths() {
  return {
    paths: (STORY_DATA as StoryData[]).map((story) => ({
      params: { slug: story.slug },
    })),
    fallback: false,
  };
}

export async function getStaticProps(context: { params: { slug: string } }) {
  const story = (STORY_DATA as StoryData[]).find(
    (s) => s.slug === context.params.slug,
  );
  if (!story) {
    return { notFound: true as const };
  }
  return { props: { storyData: story } };
}

export default StoryPage;