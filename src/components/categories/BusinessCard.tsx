import * as React from 'react';

import CustomLink from '@/components/links/CustomLink';

import { Listing } from '@/pages/api/tamilBusinessData';

// Extend your existing Listing type to match the directory data.
// Keys with spaces match the Airtable column names exactly.
export type BusinessListing = Listing & {
  Description?: string | null;
  Email?: string | null;
  Website?: string | null;
  Instagram?: string | null;
  Address?: string | null;
  'Phone Number'?: string | null;
  'Youtube Channel'?: string | null;
  'Profile URL'?: string | null;
  'Profile Image'?: string | null;
};

const toUrl = (value: string) =>
  /^https?:\/\//i.test(value) ? value : `https://${value}`;

const instagramUrl = (value: string) =>
  /instagram\.com/i.test(value)
    ? toUrl(value)
    : `https://instagram.com/${value.replace(/^@/, '')}`;

const youtubeUrl = (value: string) =>
  /youtube\.com|youtu\.be/i.test(value)
    ? toUrl(value)
    : `https://youtube.com/@${value.replace(/^@/, '')}`;

type Row = { label: string; node: React.ReactNode };

export function BusinessCard({
  listing,
  fallbackImage,
}: {
  listing: BusinessListing;
  fallbackImage: string;
}) {
  const {
    Name,
    Description,
    Email,
    Website,
    Instagram,
    Address,
    'Phone Number': phone,
    'Youtube Channel': youtube,
    'Profile URL': profileUrl,
    'Profile Image': profileImage,
  } = listing;

  // Only rows that have data are rendered, so sparse listings stay tidy.
  const rows: Row[] = [
    Website && {
      label: 'Website',
      node: (
        <CustomLink href={toUrl(Website)}>
          {Website.replace(/^https?:\/\//i, '').replace(/\/$/, '')}
        </CustomLink>
      ),
    },
    Email && {
      label: 'Email',
      node: <a href={`mailto:${Email.trim()}`}>{Email.trim()}</a>,
    },
    phone && {
      label: 'Phone',
      node: <a href={`tel:${phone.replace(/[^\d+]/g, '')}`}>{phone}</a>,
    },
    Instagram && {
      label: 'Instagram',
      node: (
        <CustomLink href={instagramUrl(Instagram)}>
          @{Instagram.replace(/^@/, '')}
        </CustomLink>
      ),
    },
    youtube && {
      label: 'YouTube',
      node: <CustomLink href={youtubeUrl(youtube)}>Channel</CustomLink>,
    },
    Address && {
      label: 'Address',
      node: (
        <CustomLink
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            Address
          )}`}
        >
          {Address}
        </CustomLink>
      ),
    },
    profileUrl && {
      label: 'More info',
      node: <CustomLink href={toUrl(profileUrl)}>View profile</CustomLink>,
    },
  ].filter(Boolean) as Row[];

  return (
    <article className='flex flex-col overflow-hidden text-left text-white rounded-lg bg-white/5'>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={profileImage || fallbackImage}
        alt={profileImage ? `${Name} logo` : ''}
        loading='lazy'
        className='object-cover w-full h-44'
        onError={(e) => {
          // Airtable attachment links expire, so fall back to the category photo.
          if (e.currentTarget.src !== fallbackImage) {
            e.currentTarget.src = fallbackImage;
          }
        }}
      />

      <div className='flex flex-col flex-1 gap-3 p-4'>
        <h2 className='text-lg font-semibold text-white'>{Name}</h2>

        {Description && (
          <p className='text-sm text-gray-300'>{Description}</p>
        )}

        {rows.length > 0 ? (
          <dl className='grid grid-cols-[5.5rem_1fr] gap-x-3 gap-y-1 text-sm'>
            {rows.map(({ label, node }) => (
              <React.Fragment key={label}>
                <dt className='text-gray-400'>{label}</dt>
                <dd className='break-words'>{node}</dd>
              </React.Fragment>
            ))}
          </dl>
        ) : (
          <p className='text-sm text-gray-400'>
            No contact details listed yet.
          </p>
        )}
      </div>
    </article>
  );
}