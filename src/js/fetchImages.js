// export async function fetchImages(q, perPage, page) {
//   const key = '35796962-1f47dccffa5818bd233e445e2';
//   return fetch(
//     `https://pixabay.com/api/?key=${key}&q=${q}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`
//   ).then(response => {
//     if (!response.ok) {
//       throw new Error(response.status);
//     }
//     return response.json();
//   });
// }

import axios from 'axios';

export async function fetchImages(q, perPage, page) {
  const key = '35796962-1f47dccffa5818bd233e445e2';
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=${key}&q=${q}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.status);
  }
}
