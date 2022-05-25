import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { getData, fetchParams } from '../../api';
import cardsTemplate from '../../../templates/photo-card.hbs';

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
  fetchParams.q = refs.form.elements.searchQuery.value.trim();

  evt.preventDefault();

  if (fetchParams.q === '') {
    lastQuery = fetchParams.q;
    return;
  }

  if (lastQuery !== fetchParams.q) {
    lastQuery = fetchParams.q;
    fetchParams.page = 1;
    refreshTemplate();
  } else {
    return;
  }

  if (!refs.loadMoreBtn.classList.contains('load-more--hidden')) {
    refs.loadMoreBtn.classList.toggle('load-more--hidden');
  }

  getData(fetchParams).then(cards => {
    if (cards.total === 0) {
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.',
      );

      return;
    }

    Notiflix.Notify.success(`Hooray! We found ${cards.total} images.`);

    if (fetchParams.page * fetchParams.per_page < cards.total)
      refs.loadMoreBtn.classList.toggle('load-more--hidden');

    drawTemplate(cards);
    gallery.refresh();
  });
};

let loadMoreHandler = () => {
  fetchParams.q = refs.form.elements.searchQuery.value;
  fetchParams.page += 1;
  getData(fetchParams).then(cards => {
    drawTemplate(cards);

    console.log(`page: ${fetchParams.page * fetchParams.per_page}  total: ${cards.total}`);

    if (fetchParams.page * fetchParams.per_page >= cards.total) {
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
