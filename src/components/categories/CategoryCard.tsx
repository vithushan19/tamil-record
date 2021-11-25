import Image from 'next/image';
import * as React from 'react';

type CategoryProps = {
  title: string;
  image_path: string;
  // TODO add image prop
};

export const CategoryCard = ({ title, image_path }: CategoryProps) => {
  return (
    <div className='bg-white rounded-xl p-4 text-gray-600 hover:bg-yellow-400 flex flex-col'>
      {title}
      <Image
        height={164}
        width={164}
        alt={title}
        className='object-cover transform transition-all hover:scale-105 ease-in-out duration-500'
        src={image_path}
      ></Image>
    </div>
  );
};
