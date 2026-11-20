import { BUSINESS_DATA, Listing } from "./tamilBusinessData";



export const getData = () => {
  return BUSINESS_DATA;

};

export const getCategoryData = (category: string) => {

  return BUSINESS_DATA.filter((listing) => listing.Category === category);
};
