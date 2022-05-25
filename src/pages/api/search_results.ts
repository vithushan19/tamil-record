import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.NEXT_PUBLIC_API_KEY }).base(
  process.env.NEXT_PUBLIC_BASE_KEY ?? ''
);

export interface Listing {
  name: string;
  instagram: string;
}
export const getData = () => {
  const data = new Array<Listing>();

  return new Promise<Listing[]>((resolve, reject) => {
    base('TamilRecord')
      .select({
        // Selecting the first 3 records in Directory:
        maxRecords: 386,
        view: 'Directory',
      })
      .eachPage(
        function page(records, fetchNextPage) {
          // This function (`page`) will get called for each page of records.
          records.forEach(function (record) {
            data.push({
              name: record.get('Name') as string,
              instagram: record.get('Instagram') as string,
            });
          });

          // To fetch the next page of records, call `fetchNextPage`.
          // If there are more records, `page` will get called again.
          // If there are no more records, `done` will get called.
          fetchNextPage();
        },
        function done(err) {
          if (err) return reject(err);
          return resolve(data);
        }
      );
  });
};

export const getCategoryData = (category: string) => {
  const data = new Array<Listing>();

  return new Promise<Listing[]>((resolve, reject) => {
    base('TamilRecord')
      .select({
        // Selecting the first 3 records in Directory:
        maxRecords: 386,
        view: 'Directory',
        filterByFormula: `SEARCH("${category}",{Category})`,
      })
      .eachPage(
        function page(records, fetchNextPage) {
          // This function (`page`) will get called for each page of records.
          records.forEach(function (record) {
            data.push({
              name: record.get('Name') as string,
              instagram: record.get('Instagram') as string,
            });
          });

          // To fetch the next page of records, call `fetchNextPage`.
          // If there are more records, `page` will get called again.
          // If there are no more records, `done` will get called.
          fetchNextPage();
        },
        function done(err) {
          if (err) return reject(err);
          return resolve(data);
        }
      );
  });
};
