import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import Navbar from '@/components/Navbar';
import { STORY_DATA } from './api/storyData';


interface StoryListItem {
  slug: string;
  title: string;
  imageUrl: string | null;
}

interface PageProps {
  storyListData: StoryListItem[];
}

const StoriesHomePage = ({ storyListData }: PageProps) => {
  return (
    <div className='flex flex-col w-full h-screen bg-gray-200'>
      <Navbar />

      <div className='sticky z-10 w-full p-4 bg-white shadow-md'>
        <div className='py-4 font-bold'>
          <h1 className='text-3xl text-center'>Stories</h1>
        </div>
      </div>

      <div className='grid flex-grow w-full grid-cols-1 p-4 overflow-auto md:grid-cols-4'>
        {storyListData.map((story) => (
          <Link key={story.slug} href={`/stories/${story.slug}`} passHref>
            <a className='flex flex-col items-center justify-center h-56 p-4 ml-4 bg-white rounded-lg cursor-pointer'>
              <div className='flex flex-col justify-center'>
                {story.imageUrl && (
                  <Image
                    width={120}
                    height={120}
                    alt={`${story.title} cover`}
                    className='object-cover transition-all duration-500 ease-in-out transform hover:scale-105'
                    src={story.imageUrl}
                  />
                )}
                <p className='mt-4 text-xl font-bold text-center'>
                  {story.title}
                </p>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
};

export async function getStaticProps() {
  const storyListData: StoryListItem[] = (STORY_DATA as any[]).map((s) => ({
    slug: s.slug,
    title: s.title,
    imageUrl: s.imageUrl,
  }));

  return {
    props: { storyListData },
  };
}

export default StoriesHomePage;