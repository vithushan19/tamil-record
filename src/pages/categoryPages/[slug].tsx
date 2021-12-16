import { useRouter } from 'next/router';
import * as React from 'react';
import { useEffect, useState } from 'react';

import { CategoryCard } from '@/components/categories/CategoryCard';
import Layout from '@/components/layout/Layout';
import ButtonLink from '@/components/links/ButtonLink';
import CustomLink from '@/components/links/CustomLink';
import Seo from '@/components/Seo';

import {
  categories,
  categories_photos,
  category_specific_photos,
} from '../api/categories';
import { getCategoryData, getData } from '../api/search_results';

///Pass in the data from staticProps once implemented
export default function CategoryPage() {
  const router = useRouter();
  const categoryPageName = router.query.slug;

  const [businessData, setBusinessData] = useState<string[]>([]);
  const [businessByCategoryData, setBusinessByCategoryData] = useState<
    string[]
  >([]);
  const [searchList, setSearchList] = useState<string[]>([]);

  //If getStaticProps is defined, this is not needed
  useEffect(() => {
    async function onPageLoad() {
      const dataFromAxios = await getData();
      setBusinessData(dataFromAxios as string[]);
      const dataFromAxios2 = await getCategoryData(categoryPageName as string);
      setBusinessByCategoryData(dataFromAxios2 as string[]);
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
        <section className='bg-dark'>
          <div className='flex flex-col items-center justify-center min-h-screen text-center text-white layout'>
            <h1>Tamil Record</h1>
            <p className='mt-2 text-sm text-gray-300'>
              Welcome to the {categoryPageName} page!
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

                      //returning only the results of setList if the value of the search is included in the business' name
                      setList(
                        //change the filter function to use strings rather than the custom type
                        businessData.filter((business) => {
                          return business
                            .toLowerCase()
                            .includes(value.toLowerCase());
                        })
                      );
                    }
                  }}
                />
                <button className='absolute inset-y-0 right-0 flex items-center px-4 font-bold text-white bg-indigo-600 rounded-r-lg hover:bg-indigo-500 focus:bg-indigo-700'>
                  Search
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
                {businessByCategoryData.map((category, index) => (
                  <CategoryCard
                    key={index}
                    title={category}
                    image_path={category_specific_photos(
                      categoryPageName as string
                    )}
                    route_path={'/categoryPages/' + category}
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
