import axios from 'axios';

const KEY = '27495256-af825ffcf26d4c7b8b5ea146c';



export const getData = async (query, page=1) => {
  try {
    
    const { data } = await axios.get('https://pixabay.com/api/', {
      params: {
        key: KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        per_page: 40,
        page: page,
        safesearch: 'true',
      },
    });

    return data;
  } catch (error) {
    throw new Error(`Smth went wrong ${error}`);
  }
};
