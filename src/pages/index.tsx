import * as React from 'react';

import { CategoryCard } from '@/components/categories/CategoryCard';
import Layout from '@/components/layout/Layout';
import ButtonLink from '@/components/links/ButtonLink';
import CustomLink from '@/components/links/CustomLink';
import Seo from '@/components/Seo';

import { categories, categories_photos } from './api/categories';

// !STARTERCONF -> Select !STARTERCONF and CMD + SHIFT + F
// Before you begin editing, follow all comments with `STARTERCONF`,
// to customize the default configuration.

export default function HomePage() {
  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />

      <main>
        <section className='bg-dark'>
          <div className='flex flex-col items-center justify-center min-h-screen text-center text-white layout'>
            <h1>Tamil Record</h1>
            <p className='mt-2 text-sm text-gray-300'>
              A site that allows people to find local tamil businesses around
              them{' '}
            </p>
            <div className='mt-12'>
              <h2>Browse Tamil Businesses by category</h2>
              <div className='grid grid-cols-4 gap-4 mt-4'>
                {categories.map((category, index) => (
                  <CategoryCard
                    key={index}
                    title={category}
                    image_path={categories_photos[index]}
                  />
                ))}
              </div>
            </div>

            <ButtonLink className='mt-6' href='/components' variant='light'>
              See all components
            </ButtonLink>

            <div>
              © {new Date().getFullYear()} By{' '}
              <CustomLink href='https://theodorusclarence.com?ref=tsnextstarter'>
                Ajevan Mahadaya
              </CustomLink>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
