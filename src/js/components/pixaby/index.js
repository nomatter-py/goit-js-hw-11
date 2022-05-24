import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { getData } from '../../api';
import cardsTemplate from '../../templates/photo-card.hbs';

const PER_PAGE = 40;
const fetchParams = {
  q: '',
  image_type: 'photo',
  orientation: 'horizontal',
  per_page: PER_PAGE,
  page: 1,
  safesearch: 'true',
};

let lastQuery;
let page = 1;
let refs = {
  form: document.getElementById('search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

let gallery = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

function refreshTemplate() {
  refs.gallery.innerHTML = '';
}

function drawTemplate(data) {
  let hits = data.hits;
  let cards = cardsTemplate(hits);
  refs.gallery.insertAdjacentHTML('beforeend', cards);
}

let searchHandler = evt => {
  let query = refs.form.elements.searchQuery.value.trim();

  evt.preventDefault();

  if (query === '') {
    lastQuery = query;
    return;
  }

  if (lastQuery !== query) {
    lastQuery = query;
    page = 1;
    refreshTemplate();
  } else {
    return;
  }

  if (!refs.loadMoreBtn.classList.contains('load-more--hidden')) {
    refs.loadMoreBtn.classList.toggle('load-more--hidden');
  }

  fetchParams.q = refs.form.elements.searchQuery.value;
  getData(fetchParams).then(cards => {
    if (cards.total === 0) {
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.',
      );

      return;
    }

    Notiflix.Notify.success(`Hooray! We found ${cards.total} images.`);

    if (page * PER_PAGE < cards.total) refs.loadMoreBtn.classList.toggle('load-more--hidden');

    drawTemplate(cards);
    gallery.refresh();
  });
};

let loadMoreHandler = () => {
  page += 1;
  fetchParams.q = refs.form.elements.searchQuery.value;
  fetchParams.page = page;
  getData(fetchParams).then(cards => {
    drawTemplate(cards);

    console.log(`page: ${page * PER_PAGE}  total: ${cards.total}`);

    if (page * PER_PAGE >= cards.total) {
      Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
      refs.loadMoreBtn.classList.toggle('load-more--hidden');
    }
    gallery.refresh();

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  });
};

refs.loadMoreBtn.addEventListener('click', loadMoreHandler);
refs.form.addEventListener('submit', searchHandler);
