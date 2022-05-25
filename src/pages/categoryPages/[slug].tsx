import { useRouter } from 'next/router';
import * as React from 'react';
import { useEffect, useState } from 'react';

import { CategoryCard } from '@/components/categories/CategoryCard';
import Layout from '@/components/layout/Layout';
import CustomLink from '@/components/links/CustomLink';
import Seo from '@/components/Seo';

import { category_specific_photos } from '../api/categories';
import { getCategoryData, Listing } from '../api/search_results';

///Pass in the data from staticProps once implemented
export default function CategoryPage() {
  const router = useRouter();
  const categoryPageName = router.query.slug;
  const [businessByCategoryData, setBusinessByCategoryData] = useState<
    Listing[]
  >([]);
  const [isLoading, setLoading] = useState(false);

  //If getStaticProps is defined, this is not needed
  useEffect(() => {
    async function onPageLoad() {
      setLoading(true);

      const data = await getCategoryData(categoryPageName as string);

      setBusinessByCategoryData(data as Listing[]);
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
            <h1 className='p-8 text-white'>{categoryPageName}</h1>
            <div className='mt-4'>
              {isLoading ? (
                <p className='text-white'>Loading...</p>
              ) : (
                <div className='grid grid-cols-4 gap-4 mt-4'>
                  {businessByCategoryData.map((listing, index) => (
                    <CategoryCard
                      key={index}
                      title={listing.name}
                      image_path={category_specific_photos(
                        categoryPageName as string
                      )}
                      route_path={'/categoryPages/' + listing.name}
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
