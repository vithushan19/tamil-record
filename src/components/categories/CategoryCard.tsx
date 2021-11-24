import * as React from 'react';

type CategoryProps = {
  title: string;
  // TODO add image prop
};

export const CategoryCard = ({ title }: CategoryProps) => {
  return (
    <div className='bg-white rounded-xl p-4 text-gray-600 hover:bg-yellow-400'>
      {title}
    </div>
  );
};
