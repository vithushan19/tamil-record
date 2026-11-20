import { useRouter } from 'next/router';
import * as React from 'react';
import { useEffect, useState } from 'react';

import Layout from '@/components/layout/Layout';
import CustomLink from '@/components/links/CustomLink';
import Seo from '@/components/Seo';

import { category_specific_photos } from '../api/categories';
import { getCategoryData } from '../api/search_results';
import { BusinessListing, BusinessCard } from '@/components/categories/BusinessCard';

export default function CategoryPage() {
  const router = useRouter();
  // slug is undefined until the router is ready; it can also be string[]
  const slug = router.query.slug;
  const categoryPageName = Array.isArray(slug) ? slug[0] : slug;

  const [businesses, setBusinesses] = useState<BusinessListing[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady || !categoryPageName) return;

    let cancelled = false;
    async function onPageLoad() {
      setLoading(true);
      setError(null);
      try {
        const data = (await getCategoryData(
          categoryPageName as string
        )) as BusinessListing[];
        if (!cancelled) setBusinesses(data ?? []);
      } catch {
        if (!cancelled) setError('We could not load this category. Try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    onPageLoad();

    // Prevents a slow earlier request from overwriting a newer category
    return () => {
      cancelled = true;
    };
  }, [router.isReady, categoryPageName]);

  const fallbackImage = category_specific_photos(categoryPageName as string);

  return (
    <Layout>
      <Seo
        templateTitle={categoryPageName}
        description={`Tamil-owned businesses in the ${categoryPageName} category.`}
      />

      <main>
        <section className='bg-dark'>
          <div className='flex flex-col items-center min-h-screen py-8 text-center layout'>
            <h1 className='p-8 text-white'>{categoryPageName}</h1>

            {isLoading && <p className='text-white'>Loading...</p>}

            {error && <p className='text-red-400'>{error}</p>}

            {!isLoading && !error && businesses.length === 0 && (
              <p className='text-white'>No businesses listed in this category yet.</p>
            )}

            {!isLoading && !error && businesses.length > 0 && (
              <>
                <p className='mb-4 text-gray-400'>
                  {businesses.length} listing{businesses.length === 1 ? '' : 's'}
                </p>
                <div className='grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                  {businesses.map((listing) => (
                    <BusinessCard
                      key={listing.Name}
                      listing={listing}
                      fallbackImage={fallbackImage}
                    />
                  ))}
                </div>
              </>
            )}

            <div className='p-4 mt-auto text-white'>
              © {new Date().getFullYear()} By{' '}
              <CustomLink href='https://skillify.ca'>Skillify</CustomLink>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}