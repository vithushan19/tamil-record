import * as React from 'react';
import { useEffect, useState } from 'react';

import { CategoryCard } from '@/components/categories/CategoryCard';
import Layout from '@/components/layout/Layout';
import ButtonLink from '@/components/links/ButtonLink';
import CustomLink from '@/components/links/CustomLink';
import Seo from '@/components/Seo';

import { categories, categories_photos } from './api/categories';
import { getData, Listing } from './api/search_results';

///Pass in the data from staticProps once implemented
export default function HomePage() {
  const [businessData, setBusinessData] = useState<Listing[]>([]);
  const [searchList, setSearchList] = useState<string[]>([]);

  //If getStaticProps is defined, this is not needed
  useEffect(() => {
    async function onPageLoad() {
      const data = await getData();
      setBusinessData(data);
    }
    onPageLoad();
  }, []);

  const setList = (results: string[]) => {
    const editedSearchList = [];
    if (results.length == 0) {
      editedSearchList.push('No results found!');
    } else {
      for (let i = 0; i < results.length; i++) {
        editedSearchList[i] = results[i];
      }
    }
    setSearchList(editedSearchList);
  };

  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />

      <main>
        <section className='bg-gray-200'>
          <div className='flex flex-col items-center justify-center min-h-screen text-center '>
            <div className='flex flex-col items-center justify-center w-full p-4 text-white bg-gray-800 bg-center h-96 bg-blend-overlay bg-hero'>
              <h1 className='text-3xl'>Tamil Record</h1>
              <p className='mt-2 text-gray-300'>
                A directory of local businesses and educational resources.
              </p>
              <div className='flex flex-col mt-12 sm:w-1/2'>
                <div className='flex flex-col text-gray-700 sm:flex-row'>
                  <input
                    className='w-full h-10 p-6 mb-4 text-base placeholder-gray-400 border rounded-lg focus:shadow-outline'
                    type='text'
                    placeholder='Business Name'
                    onChange={(e) => {
                      let value = e.target.value;
                      if (value == '') {
                        setSearchList([]);
                      }
                      if (value && value.trim().length > 0) {
                        value = value.trim().toLowerCase();

                        //returning only the results of setList if the value of the search is included in the business' name
                        setList(
                          //change the filter function to use strings rather than the custom type
                          businessData
                            .filter((business) => {
                              return business.name
                                .toLowerCase()
                                .includes(value.toLowerCase());
                            })
                            .map((it) => it.name)
                        );
                      }
                    }}
                  />
                  <button className='flex items-center justify-center h-12 py-4 font-bold text-white rounded-lg sm:px-6 sm:ml-4 sm:rounded-r-lg bg-charmander hover:bg-yellow-700 focus:bg-yellow-700'>
                    Search
                  </button>
                </div>
              </div>
            </div>
            <div className='w-full bg-white sm:w-1/2 results-container'>
              <ul className='w-full results-list' id='list'>
                {searchList.map((searchResult, index) => (
                  <li key={index} className='w-full p-4 hover:bg-charmander'>
                    {searchResult}
                  </li>
                ))}
              </ul>
            </div>

            <div className='m-12'>
              <h2 className='text-3xl'>Business Categories</h2>
              <div className='grid grid-cols-1 gap-4 mt-4 sm:grid-cols-4'>
                {categories.map((category, index) => (
                  <CategoryCard
                    key={index}
                    title={category}
                    image_path={categories_photos[index]}
                    route_path={'/categoryPages/' + category}
                  />
                ))}
              </div>
            </div>

            <div className='p-4'>
              © {new Date().getFullYear()} By{' '}
              <CustomLink href='https://skillify.ca'>Skillify</CustomLink>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );

  //add getsTATIC props function similar to dashboard in Math Champs and test it out there, return data to above function
}
