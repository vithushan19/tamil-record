import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';

type CategoryProps = {
  title: string;
  image_path: string;
  route_path: string;
  // TODO add image prop
};

export const CategoryCard = ({
  title,
  image_path,
  route_path,
}: CategoryProps) => {
  return (
    <Link passHref={true} href={route_path}>
      <div className='flex flex-col p-4 bg-white rounded-lg cursor-pointer hover:bg-charmander'>
        <p className='mb-4 text-lg font-bold'>{title}</p>
        <Image
          height={164}
          width={164}
          alt={title}
          className='object-cover transition-all duration-500 ease-in-out transform hover:scale-105'
          src={image_path}
        ></Image>
      </div>
    </Link>
  );
};
