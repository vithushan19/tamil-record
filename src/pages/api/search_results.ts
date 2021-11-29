import Airtable from 'airtable';
import axios from 'axios';

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

// export const getData = () => {
//   //const data = new Array<string>();
//   axios.get('/').then((res) => {
//     return res.data.records;
//   });
//   //return data;
// };

export const getData = () => {
  return axios.get('/').then((res) => res.data.records);
};

// export type BusinessListing = {
//   name: string;
// };

// export const searchResults: BusinessListing[] = [
//   { name: data },
//   // { name: 'becky' },
//   // { name: 'chris' },
//   // { name: 'dillon' },
//   // { name: 'evan' },
//   // { name: 'frank' },
//   // { name: 'georgette' },
//   // { name: 'hugh' },
//   // { name: 'igor' },
//   // { name: 'jacoby' },
//   // { name: 'kristina' },
//   // { name: 'lemony' },
//   // { name: 'matilda' },
//   // { name: 'nile' },
//   // { name: 'ophelia' },
//   // { name: 'patrick' },
//   // { name: 'quincy' },
//   // { name: 'roslyn' },
//   // { name: 'solene' },
//   // { name: 'timothy' },
//   // { name: 'uff' },
//   // { name: 'violet' },
//   // { name: 'wyatt' },
//   // { name: 'x' },
//   // { name: 'yadri' },
//   // { name: 'zack' },
// ];
