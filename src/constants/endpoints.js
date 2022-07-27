const BASE_URL = 'https://ghibliapi.herokuapp.com';
const FILMS_URL = '/films';

export const films = (limit) => BASE_URL + FILMS_URL + '?limit=' + limit;