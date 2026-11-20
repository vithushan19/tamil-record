import * as React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { CategoryCard } from '@/components/categories/CategoryCard';
import Layout from '@/components/layout/Layout';
import CustomLink from '@/components/links/CustomLink';
import Seo from '@/components/Seo';
import Navbar from '@/components/Navbar';

import { categories, categories_photos } from './api/categories';
import { getData } from './api/search_results';
import { Listing } from './api/tamilBusinessData';

type HomePageProps = {
  businessData: Listing[];
  buildYear: number;
};

const MAX_VISIBLE_RESULTS = 8;

export default function HomePage({ businessData, buildYear }: HomePageProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const trimmed = query.trim().toLowerCase();

  const matches = useMemo(() => {
    if (!trimmed) return [];
    return businessData.filter((b) => b.Name.toLowerCase().includes(trimmed));
  }, [trimmed, businessData]);

  const visible = matches.slice(0, MAX_VISIBLE_RESULTS);
  const showDropdown = isOpen && trimmed.length > 0;

  // Close dropdown on outside click
  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  return (
    <Layout>
      <Seo />
      <Navbar />

      <main className='min-h-screen bg-gray-50'>
        {/* ── Hero ───────────────────────────────────────────────── */}
        <section className='relative overflow-hidden bg-gray-900'>
          <div aria-hidden className='absolute inset-0 bg-hero bg-cover bg-center opacity-25' />
          <div aria-hidden className='absolute inset-0 bg-gradient-to-b from-gray-900/70 via-gray-900/40 to-gray-900' />

          <div className='relative mx-auto flex max-w-4xl flex-col items-center px-4 py-24 text-center text-white sm:py-32'>
            <h1 className='text-4xl font-bold tracking-tight sm:text-5xl'>
              Tamil Record
            </h1>
            <p className='mt-4 max-w-xl text-lg text-gray-300'>
              A directory of local businesses and educational resources.
            </p>

            {/* Search combobox */}
            <div ref={containerRef} className='relative mt-10 w-full max-w-xl'>
              <div className='relative'>
                <SearchIcon className='pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
                <input
                  id='business-search'
                  type='search'
                  role='combobox'
                  aria-expanded={showDropdown}
                  aria-controls='search-results'
                  aria-autocomplete='list'
                  autoComplete='off'
                  placeholder='Search businesses…'
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setIsOpen(true);
                  }}
                  onFocus={() => setIsOpen(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setIsOpen(false);
                      (e.target as HTMLInputElement).blur();
                    }
                  }}
                  className='h-14 w-full rounded-full border border-transparent bg-white pl-12 pr-5 text-base text-gray-900 placeholder-gray-400 shadow-lg outline-none transition focus:border-charmander focus:ring-2 focus:ring-charmander/40'
                />
              </div>

              {showDropdown && (
                <ul
                  id='search-results'
                  role='listbox'
                  className='absolute inset-x-0 z-20 mt-2 max-h-80 overflow-auto rounded-2xl bg-white py-2 text-left shadow-2xl ring-1 ring-black/5'
                >
                  {visible.length > 0 ? (
                    <>
                      {visible.map((business) => (
                        <li
                          key={business.Name}
                          role='option'
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            setQuery(business.Name);
                            setIsOpen(false);
                          }}
                          className='cursor-pointer px-5 py-3 text-gray-800 transition hover:bg-charmander/10'
                        >
                          {business.Name}
                        </li>
                      ))}
                      {matches.length > MAX_VISIBLE_RESULTS && (
                        <li className='px-5 py-2 text-xs text-gray-500'>
                          Showing {MAX_VISIBLE_RESULTS} of {matches.length} — refine your search
                        </li>
                      )}
                    </>
                  ) : (
                    <li className='px-5 py-4 text-sm text-gray-500'>No results found.</li>
                  )}
                </ul>
              )}
            </div>
          </div>
        </section>

        {/* ── Categories ─────────────────────────────────────────── */}
        <section className='mx-auto max-w-6xl px-4 py-16 sm:py-20'>
          <div className='text-center'>
            <h2 className='text-3xl font-bold tracking-tight text-gray-900'>
              Browse by category
            </h2>
            <p className='mt-2 text-gray-600'>
              Explore local businesses across {categories.length} categories.
            </p>
          </div>

          <div className='mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
            {categories.map((category, index) => (
              <div
                key={category}
                className='transition-transform duration-200 hover:-translate-y-1'
              >
                <CategoryCard
                  title={category}
                  image_path={categories_photos[index]}
                  route_path={`/categoryPages/${category}`}
                />
              </div>
            ))}
          </div>
        </section>

        {/* ── Footer ─────────────────────────────────────────────── */}
        <footer className='border-t border-gray-200 bg-white'>
          <div className='mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-gray-500 sm:flex-row'>
            <p>© {buildYear} Tamil Record</p>
            <p>
              Built by <CustomLink href='https://skillify.ca'>Skillify</CustomLink>
            </p>
          </div>
        </footer>
      </main>
    </Layout>
  );
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill='none' stroke='currentColor' strokeWidth={2} viewBox='0 0 24 24' {...props}>
      <circle cx='11' cy='11' r='7' />
      <path strokeLinecap='round' d='m20 20-3.5-3.5' />
    </svg>
  );
}

export async function getStaticProps() {
  try {
    const businessData = await getData();
    return {
      props: { businessData, buildYear: new Date().getFullYear() },
      revalidate: 3600,
    };
  } catch (error) {
    console.error('Failed to load business data', error);
    return {
      props: { businessData: [], buildYear: new Date().getFullYear() },
      revalidate: 60,
    };
  }
}