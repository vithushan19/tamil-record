import Image from 'next/image';
import Link from 'next/link';
import { createClient } from 'next-sanity';
import React from 'react';

interface PageProps {
  storyListData: any;
}

const StoriesHomePage = ({ storyListData }: PageProps) => {
  return (
    <div className='flex flex-col w-full h-screen'>
      <div className='sticky z-10 w-full p-4 shadow-md'>
        <div className='py-4 font-bold '>Stories</div>
      </div>
      <div className='grid flex-grow w-full grid-cols-1 p-4 overflow-auto md:grid-cols-3'>
        {storyListData.map((story: any) => (
          <div key={story.slug} className='h-40 p-4 rounded-lg bg-rattata-200'>
            <Link href={`/story/${story.slug}`} passHref>
              <div className='flex flex-col justify-center cursor-pointer'>
                <Image
                  width={96}
                  height={96}
                  alt='Story Image'
                  className='object-contain'
                  src={story.imageUrl}
                />
                <p className='text-xl text-center'>{story.title}</p>
              </div>
            </Link>
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
