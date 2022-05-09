import dayjs from 'dayjs';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomNumber = (min, max) => min + Math.random() * (max - min);

const humanizeDate = (date) => dayjs(date).format('YYYY');
const humanizePopupDate = (date) => dayjs(date).format('D MMMM YYYY');
const humanizeCommDate = (date) => dayjs(date).format('YYYY/MMMM/DD HH:MM');

const isFilmChecked = (check) => Object.values(check).some(Boolean);

const filters = {
  watchlist: (cards) => cards.filter((card) => card.userDetails.watchlist).length,
  watched: (cards) => cards.filter((card) => card.userDetails.alreadyWatched).length,
  favorite: (cards) => cards.filter((card) => card.userDetails.favorite).length,
};

const getFilters = (cards) => Object.entries(filters).map(([filterName, countFilms]) => (
  {
    name: filterName,
    count: countFilms(cards),
  }
));


export { getRandomInteger, humanizeDate, getRandomNumber, isFilmChecked, humanizePopupDate, humanizeCommDate, getFilters };
