import Airtable from 'airtable';
import axios from 'axios';
import * as React from 'react';
import { useEffect, useState } from 'react';

import { CategoryCard } from '@/components/categories/CategoryCard';
import Layout from '@/components/layout/Layout';
import ButtonLink from '@/components/links/ButtonLink';
import CustomLink from '@/components/links/CustomLink';
import Seo from '@/components/Seo';

import { categories, categories_photos } from './api/categories';
// Import the function so that it can be called
import { getData } from './api/search_results';

const API_KEY = 'keyIoP5Idk5C4GiUh';
const BASE_ID = 'app0iXbbgdr96zkwt';
//create a new Airtable object in React
new Airtable({ apiKey: API_KEY }).base(BASE_ID);
//base endpoint to call with each request
axios.defaults.baseURL =
  'https://api.airtable.com/v0/' + BASE_ID + '/TamilRecord/';
//content type to send with all POST requests
axios.defaults.headers.post['Content-Type'] = 'application/json';
//authenticate to the base with the API key
axios.defaults.headers.common['Authorization'] = 'Bearer ' + API_KEY;

// !STARTERCONF -> Select !STARTERCONF and CMD + SHIFT + F
// Before you begin editing, follow all comments with `STARTERCONF`,
// to customize the default configuration.

export default function HomePage() {
  //Create a state variable for the function in search_results, intialized to empty array, then use this in the filter function
  const [businessData, setBusinessData] = useState<string[]>([]);
  const [searchList, setSearchList] = useState<string[]>([]);

  //setData(getData()); and wrap this in a useEffect
  //In case the above doesn't work, set the getData in a variable and then call the variable in setData function

  useEffect(() => {
    async function onPageLoad() {
      const dataFromAxios = await getData();
      const businessNameData = new Array<string>();
      for (let i = 0; i < dataFromAxios.length; i++) {
        businessNameData.push(dataFromAxios[i].fields.Name);
      }
      setBusinessData(businessNameData);
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
