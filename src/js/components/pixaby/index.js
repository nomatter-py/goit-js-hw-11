import Notiflix from 'notiflix';
import { getData } from '../../api';
import cardsTemplate from '../../../js/templates/photo-card.hbs';

const PER_PAGE = 40;

let lastQuery;
let page = 1;
let refs = {
  form: document.getElementById('search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

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

  getData(refs.form.elements.searchQuery.value).then(cards => {
    if (cards.total === 0) {
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.',
      );
      return;
    }
    if (page * PER_PAGE < cards.total) refs.loadMoreBtn.classList.toggle('load-more--hidden');

    drawTemplate(cards);
  });
};

let loadMoreHandler = () => {
  page += 1;
  getData(refs.form.elements.searchQuery.value, page).then(cards => {
    drawTemplate(cards);
    console.log(`page: ${page * PER_PAGE}  total: ${cards.total}`);
    if (page * PER_PAGE >= cards.total) {
      Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
      refs.loadMoreBtn.classList.toggle('load-more--hidden');
    }
  });
};

refs.loadMoreBtn.addEventListener('click', loadMoreHandler);
refs.form.addEventListener('submit', searchHandler);
