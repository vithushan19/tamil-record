import { useRouter } from 'next/router';
import * as React from 'react';
import { useEffect, useState } from 'react';

import { CategoryCard } from '@/components/categories/CategoryCard';
import Layout from '@/components/layout/Layout';
import ButtonLink from '@/components/links/ButtonLink';
import CustomLink from '@/components/links/CustomLink';
import Seo from '@/components/Seo';

import { category_specific_photos } from '../api/categories';
import { getCategoryData, getData } from '../api/search_results';

///Pass in the data from staticProps once implemented
export default function CategoryPage() {
  const router = useRouter();
  const categoryPageName = router.query.slug;
  const [businessByCategoryData, setBusinessByCategoryData] = useState<
    string[]
  >([]);
  const [isLoading, setLoading] = useState(false);

  //If getStaticProps is defined, this is not needed
  useEffect(() => {
    async function onPageLoad() {
      setLoading(true);

      const dataFromAxios2 = await getCategoryData(categoryPageName as string);
      setBusinessByCategoryData(dataFromAxios2 as string[]);
      setLoading(false);
    }
    onPageLoad();
  }, [categoryPageName]);

  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />

      <main>
        <section className='bg-dark'>
          <div className='flex flex-col items-center justify-center min-h-screen text-center layout'>
            <h1 className='text-white'>{categoryPageName}</h1>
            <div className='mt-12'>
              {isLoading ? (
                <p className='text-white'>Loading...</p>
              ) : (
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
              )}
            </div>
            <div className='p-4 text-white'>
              © {new Date().getFullYear()} By{' '}
              <CustomLink href='https://skillify.ca'>Skillify</CustomLink>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
