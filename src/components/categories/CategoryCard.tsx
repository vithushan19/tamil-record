import * as React from 'react';

type CategoryProps = {
  title: string;
  image_path: string;
  // TODO add image prop
};

export const CategoryCard = ({ title, image_path }: CategoryProps) => {
  return (
    <div className='bg-white rounded-xl p-4 text-gray-600 hover:bg-yellow-400'>
      {title}
      <img className='object-contain h-40 w-full' src={image_path}></img>
    </div>
  );
};
