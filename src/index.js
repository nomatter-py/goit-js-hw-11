import './sass/main.scss';
import './js/components/pixaby';

import Notiflix from 'notiflix';
import { getData } from './js/api';
import cardsTemplate from '/js/templates/photo-card.hbs';
import axios from 'axios';

const URL = 'https://pixabay.com/api/';
const KEY = '27495256-af825ffcf26d4c7b8b5ea146c';

let refs = {
    form : document.getElementById('search-form'),
    gallery : document.querySelector('.gallery'),
}; 


class DataHandler {

    page = 0;
    currentQuery = '';
    data;

    async fetch(query) {

        if (this.currentQuery !== query) {
            this.page = 0;    
        }

        this.currentQuery = query;
        this.page += 1;
        let response = await axios.get(URL, 
            { 
                params: {
                    key: KEY,
                    q:  query,
                    image_type: 'photo',
                    orientation: 'horizontal',
                    safesearch: 'true',
                }
        }) ;/*.then(function ({data}) {
            //console.log(response.data);
            this.data = data;
            //draw(refs.gallery, data);
        });*/

        let data = await response.data;
        this.draw(data);
    }

    draw(data) {
        console.log(data);
        let  hits = data.hits;
        let cards = cardsTemplate(hits);
        console.log(hits);
        refs.gallery.insertAdjacentHTML('beforeend',cards);
    }

}


function draw(markup, data) {
    let  hits = data.hits;
    let cards = cardsTemplate(hits);
    console.log(hits);
    markup.insertAdjacentHTML('beforeend',cards);
 }

const dataHandler = new DataHandler;


let searchHandler = (evt) => {
    evt.preventDefault();
    //fetchData();

    console.log(getData(refs.form.searchQuery.value));
       
}

async function fetchData() {
   dataHandler.fetch(refs.form.searchQuery.value);
}





