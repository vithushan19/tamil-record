import * as React from 'react';
import { useState } from 'react';

import { CategoryCard } from '@/components/categories/CategoryCard';
import Layout from '@/components/layout/Layout';
import ButtonLink from '@/components/links/ButtonLink';
import CustomLink from '@/components/links/CustomLink';
import Seo from '@/components/Seo';

import { categories, categories_photos } from './api/categories';
import { searchResults } from './api/search_results';

// !STARTERCONF -> Select !STARTERCONF and CMD + SHIFT + F
// Before you begin editing, follow all comments with `STARTERCONF`,
// to customize the default configuration.

export default function HomePage() {
  const [searchList, setSearchList] = useState<string[]>([]);

  const setList = (results: { name: string }[]) => {
    const editedSearchList = [];
    if (results.length == 0) {
      editedSearchList.push('No results found!');
    } else {
      for (let i = 0; i < results.length; i++) {
        editedSearchList[i] = results[i].name;
      }
    }
    setSearchList(editedSearchList);
  };
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
            <div className='flex flex-col mt-12'>
              <div className='relative text-gray-700'>
                <input
                  className='w-full h-10 pl-3 pr-8 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline'
                  type='text'
                  placeholder=''
                  onChange={(e) => {
                    let value = e.target.value;
                    if (value == '') {
                      setSearchList([]);
                    }
                    if (value && value.trim().length > 0) {
                      value = value.trim().toLowerCase();

                      //returning only the results of setList if the value of the search is included in the person's name
                      setList(
                        searchResults.filter((person) => {
                          return person.name.includes(e.target.value);
                        })
                      );
                    }
                  }}
                />
                <button className='absolute inset-y-0 right-0 flex items-center px-4 font-bold text-white bg-indigo-600 rounded-r-lg hover:bg-indigo-500 focus:bg-indigo-700'>
                  Click
                </button>
              </div>
            </div>

            <div className='results-container'>
              <ul className='results-list' id='list'>
                {searchList.map((searchResult, index) => (
                  <li key={index}>{searchResult}</li>
                ))}
              </ul>
            </div>

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
