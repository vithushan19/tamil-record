export const categories = [
  'Artist',
  'Videography',
  'Food',
  'Designers',
  'Photography',
  'Make-up and Hair',
  'Jewellery',
  'Grocery Store',
  'Event Planner',
  'DJ',
  'Decor and Flowers',
  'Clothes and Fashion',
  'Banquet Halls',
  'Bakers',
];

export const categories_photos = [
  '/images/Artist.jpeg',
  '/images/Videography.jpeg',
  '/images/Food.jpeg',
  '/images/Designer.jpeg',
  '/images/Photography.jpeg',
  '/images/Makeup_Hair.jpeg',
  '/images/Jewellery.jpeg',
  '/images/Groceries.jpeg',
  '/images/Event_Planning.jpeg',
  '/images/DJ.jpeg',
  '/images/Decor.jpeg',
  '/images/Fashion.jpeg',
  '/images/Banquet_Hall.jpeg',
  '/images/Bakers.jpeg',
];

export const category_specific_photos = (category: string) => {
  if (category === 'Clothes and Fashion') {
    category = 'Fashion';
  }
  if (category === 'Decor and Flowers') {
    category = 'Decor';
  }
  if (category === 'Banquet Halls') {
    category = 'Banquet_Hall';
  }
  if (category === 'Event Planner') {
    category = 'Event_Planning';
  }
  if (category === 'Make-up and Hair') {
    category = 'Makeup_Hair';
  }
  if (category === 'Grocery Store') {
    category = 'Groceries';
  }
  const image_path = '/images/' + category + '.jpeg';
  return image_path;
};
