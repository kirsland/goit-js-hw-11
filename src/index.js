import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchImages } from './js/fetchImages.js';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const lightbox = new SimpleLightbox('.photo-card a', {
  /* options */
});

const searchInput = document.querySelector('.search-input');
const searchForm = document.querySelector('.search-form');

const gallery = document.querySelector('.gallery');

const perPage = 40;
let page = 1;

searchForm.addEventListener('submit', onSubmit);

let searchQuery = '';

// Search fetch // axios //

function onSubmit(e) {
  e.preventDefault();
  searchQuery = searchInput.value;
  page = 1;

  if (!searchQuery) {
    clearImagesListHtml();
    Notify.info('Write your search query');
    return;
  }

  async function doSearch() {
    try {
      loadMoreButton.classList.add('is-hidden');
      const resultFromQuery = await fetchImages(searchQuery, perPage, page);
      if (resultFromQuery.hits.length === 0) {
        clearImagesListHtml();
        console.log(resultFromQuery);
        Notify.info(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }

      if (
        resultFromQuery.hits.length > 0 &&
        resultFromQuery.totalHits <= perPage
      ) {
        renderImagesList(resultFromQuery.hits);
        Notify.info(`Hooray! We found ${resultFromQuery.totalHits} images.`);
        return;
      }

      if (
        resultFromQuery.hits.length > 0 &&
        resultFromQuery.totalHits > perPage
      ) {
        renderImagesList(resultFromQuery.hits);
        Notify.info(`Hooray! We found ${resultFromQuery.totalHits} images.`);
        loadMoreButton.classList.remove('is-hidden');
        return;
      }
    } catch (error) {
      if (error.message === '404') {
        clearImagesListHtml();
        Notify.failure(
          'Oops, there are no images matching your search query. Please try again.'
        );
      }
      console.log(error);
    }
  }

  doSearch();

  function renderImagesList(searchQueryResults) {
    const markup = searchQueryResults
      .map(
        ({
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) => {
          return `
        <div class="photo-card">
          <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
          <div class="info">
            <p class="info-item">
              <b>Likes:</b><br>${likes}
            </p>
            <p class="info-item">
              <b>Views:</b><br>${views}
            </p>
            <p class="info-item">
              <b>Comments:</b><br>${comments}
            </p>
            <p class="info-item">
              <b>Downloads:</b><br>${downloads}
            </p>
          </div>
        </div>
          `;
        }
      )
      .join('');

    gallery.innerHTML = markup;
    lightbox.refresh();
    // gallery.insertAdjacentHTML('beforeend', markup);
  }
}

// Load more // axios //

const loadMoreButton = document.querySelector('.load-more');
loadMoreButton.addEventListener('click', onLoadMoreButton);

function onLoadMoreButton(e) {
  e.preventDefault();

  async function doLoadMore() {
    try {
      loadMoreButton.classList.add('is-hidden');
      page += 1;
      const resultFromQuery = await fetchImages(searchQuery, perPage, page);
      renderImagesList(resultFromQuery.hits);
      loadMoreButton.classList.remove('is-hidden');

      if (resultFromQuery.totalHits / perPage <= page) {
        loadMoreButton.classList.add('is-hidden');
        Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
    } catch (error) {
      if (error.message === '404') {
        clearImagesListHtml();
        Notify.failure('Oops, something is wrong. Please try again.');
      }
      console.log(error);
    }
  }

  doLoadMore();

  function renderImagesList(searchQueryResults) {
    const markup = searchQueryResults
      .map(
        ({
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) => {
          return `
        <div class="photo-card">
          <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
          <div class="info">
            <p class="info-item">
              <b>Likes:</b><br>${likes}
            </p>
            <p class="info-item">
              <b>Views:</b><br>${views}
            </p>
            <p class="info-item">
              <b>Comments:</b><br>${comments}
            </p>
            <p class="info-item">
              <b>Downloads:</b><br>${downloads}
            </p>
          </div>
        </div>
          `;
        }
      )
      .join('');

    // gallery.innerHTML = markup;
    gallery.insertAdjacentHTML('beforeend', markup);
    lightbox.refresh();
  }
}

function clearImagesListHtml() {
  gallery.innerHTML = '';
  loadMoreButton.classList.add('is-hidden');
}

// FETCH standart method --------------------------------------------------------------------------

// import { Notify } from 'notiflix/build/notiflix-notify-aio';
// import { fetchImages } from './js/fetchImages.js';

// const searchInput = document.querySelector('.search-input');
// const searchForm = document.querySelector('.search-form');

// const gallery = document.querySelector('.gallery');

// const perPage = 40;
// let page = 1;

// searchForm.addEventListener('submit', onSubmit);

// let searchQuery = '';

// // Search fetch // fetch //

// function onSubmit(e) {
//   e.preventDefault();
//   searchQuery = searchInput.value;
//   page = 1;

//   if (!searchQuery) {
//     clearImagesListHtml();
//     Notify.info('Write your search query');
//     return;
//   }

//   fetchImages(searchQuery, perPage, page)
//     .then(resultFromQuery => {
//       if (resultFromQuery.hits.length === 0) {
//         clearImagesListHtml();
//         console.log(resultFromQuery);
//         Notify.info(
//           'Sorry, there are no images matching your search query. Please try again.'
//         );
//       }

//       if (resultFromQuery.hits.length > 0) {
//         renderImagesList(resultFromQuery.hits);
//         loadMoreButton.classList.remove('is-hidden');
//       }
//     })
//     .catch(err => {
//       if (err.message === '404') {
//         clearImagesListHtml();
//         Notify.failure(
//           'Oops, there are no images matching your search query. Please try again.'
//         );
//       }
//       console.log(err);
//     });

//   function renderImagesList(searchQueryResults) {
//     const markup = searchQueryResults
//       .map(
//         ({
//           webformatURL,
//           largeImageURL,
//           tags,
//           likes,
//           views,
//           comments,
//           downloads,
//         }) => {
//           return `
//         <div class="photo-card">
//           <img src="${webformatURL}" alt="${tags}" loading="lazy" />
//           <div class="info">
//             <p class="info-item">
//               <b>Likes:</b><br>${likes}
//             </p>
//             <p class="info-item">
//               <b>Views:</b><br>${views}
//             </p>
//             <p class="info-item">
//               <b>Comments:</b><br>${comments}
//             </p>
//             <p class="info-item">
//               <b>Downloads:</b><br>${downloads}
//             </p>
//           </div>
//         </div>
//           `;
//         }
//       )
//       .join('');

//     gallery.innerHTML = markup;
//     // gallery.insertAdjacentHTML('beforeend', markup);
//   }
// }

// // Load more // fetch //

// const loadMoreButton = document.querySelector('.load-more');
// loadMoreButton.addEventListener('click', onLoadMoreButton);

// // Load more fetch // fetch //

// function onLoadMoreButton(e) {
//   e.preventDefault();

//   fetchImages(searchQuery, perPage, page)
//     .then(resultFromQuery => {
//       loadMoreButton.classList.remove('is-hidden');
//       renderImagesList(resultFromQuery.hits);
//       page += 1;

//       if (resultFromQuery.totalHits / perPage <= page) {
//         loadMoreButton.classList.add('is-hidden');
//         Notify.info(
//           "We're sorry, but you've reached the end of search results."
//         );
//       }
//     })
//     .catch(err => {
//       if (err.message === '404') {
//         clearImagesListHtml();
//         Notify.failure('Oops, something is wrong. Please try again.');
//       }
//       console.log(err);
//     });

//   function renderImagesList(searchQueryResults) {
//     const markup = searchQueryResults
//       .map(
//         ({
//           webformatURL,
//           largeImageURL,
//           tags,
//           likes,
//           views,
//           comments,
//           downloads,
//         }) => {
//           return `
//         <div class="photo-card">
//           <img src="${webformatURL}" alt="${tags}" loading="lazy" />
//           <div class="info">
//             <p class="info-item">
//               <b>Likes:</b><br>${likes}
//             </p>
//             <p class="info-item">
//               <b>Views:</b><br>${views}
//             </p>
//             <p class="info-item">
//               <b>Comments:</b><br>${comments}
//             </p>
//             <p class="info-item">
//               <b>Downloads:</b><br>${downloads}
//             </p>
//           </div>
//         </div>
//           `;
//         }
//       )
//       .join('');

//     // gallery.innerHTML = markup;
//     gallery.insertAdjacentHTML('beforeend', markup);
//   }
// }

// function clearImagesListHtml() {
//   gallery.innerHTML = '';
//   loadMoreButton.classList.add('is-hidden');
// }
