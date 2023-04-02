import fetchImages from '../js/fetchImages';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const input = document.querySelector('.search-form__input');
const searchBtn = document.querySelector('.search-form__button');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
let gallerySimpleLightbox = new SimpleLightbox('.gallery a');

loadMoreBtn.style.display = 'none';

let pageNumber = 1;

searchBtn.addEventListener('click', onSearchBtnClick);

async function onSearchBtnClick(e) {
  e.preventDefault();
  cleanGallery();
  const trimmedValue = input.value.trim();
  const response = await fetchImages(trimmedValue, pageNumber);
  try {
    if (trimmedValue !== '') {
      if (response.hits.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        renderImageList(response.hits);
        Notiflix.Notify.success(
          `Hooray! We found ${response.totalHits} images.`
        );
        loadMoreBtn.style.display = 'block';
        gallerySimpleLightbox.refresh();
      }
    }
  } catch (error) {
    console.log(error);
  }
}
loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

async function onLoadMoreBtnClick(e) {
  pageNumber++;
  const trimmedValue = input.value.trim();
  loadMoreBtn.style.display = 'none';
  const response = await fetchImages(trimmedValue, pageNumber);
  if (response.hits.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    renderImageList(response.hits);
    loadMoreBtn.style.display = 'block';
  }
}

function renderImageList(images) {
  const markup = images
    .map(image => {
      return `<div class="photo-card">

       <a href="${image.largeImageURL}"><img class="image" src="${image.webformatURL}" alt="${image.tags}" title="${image.tags}" loading="lazy"/></a>

        <div class="info">
           <p class="info-item">
    <b>Likes</b> <span class="info-item__span"> ${image.likes} </span>
</p>
            <p class="info-item">
                <b>Views</b> <span class="info-item__span">${image.views}</span>  
            </p>
            <p class="info-item">
                <b>Comments</b> <span class="info-item__span">${image.comments}</span>  
            </p>
            <p class="info-item">
                <b>Downloads</b> <span class="info-item__span">${image.downloads}</span> 
            </p>
        </div>
    </div>`;
    })
    .join('');
  gallery.innerHTML += markup;
}

function cleanGallery() {
  gallery.innerHTML = '';
  pageNumber = 1;
  loadMoreBtn.style.display = 'none';
}
