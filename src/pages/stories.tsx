import Image from 'next/image';
import Link from 'next/link';
import { createClient } from 'next-sanity';
import React from 'react';

interface PageProps {
  storyListData: any;
}

const StoriesHomePage = ({ storyListData }: PageProps) => {
  return (
    <div className='flex flex-col w-full h-screen bg-gray-200'>
      <div className='sticky z-10 w-full p-4 bg-white shadow-md'>
        <div className='py-4 font-bold '>
          <h1 className='text-3xl text-center'>Stories</h1>
        </div>
      </div>
      <div className='grid flex-grow w-full grid-cols-1 p-4 overflow-auto md:grid-cols-4'>
        {storyListData.map((story: any) => (
          <Link key={story.slug} href={`/story/${story.slug}`} passHref>
            <div className='flex flex-col items-center justify-center h-56 p-4 bg-white rounded-lg cursor-pointer'>
              <div className='flex flex-col justify-center '>
                <Image
                  width={120}
                  height={120}
                  alt='Story Image'
                  className='object-cover transition-all duration-500 ease-in-out transform hover:scale-105'
                  src={story.imageUrl}
                />
                <p className='mt-4 text-xl font-bold text-center'>
                  {story.title}
                </p>
              </div>
            </div>
          </Link>
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
      slug,
      "imageUrl": image.asset->url
    }`
  );
  return {
    props: {
      storyListData: sanityResponse,
    },
  };
}

export default StoriesHomePage;
