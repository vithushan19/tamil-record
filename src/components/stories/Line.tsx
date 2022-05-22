import Image from 'next/image';
import { useState } from 'react';

interface LineProps {
  avatarUrl: string;
  text: string;
  translation: string;
}
export default function Line({ avatarUrl, text, translation }: LineProps) {
  return (
    <div className='flex items-center bg-primary-200'>
      <Image
        width={96}
        height={96}
        alt='Avatar Url'
        className='object-cover'
        src={avatarUrl}
      />
      <div className='flex flex-col flex-1 ml-4'>
        <p className='text-2xl'> {text}</p>
        <p className=''> {translation}</p>
      </div>
    </div>
  );
}
