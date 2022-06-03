import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { FilterType } from './consts.js';

dayjs.extend(relativeTime);
const TWO_DAYS_MILLISECONDS = 172800000;

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomNumber = (min, max) => min + Math.random() * (max - min);

const humanizeDate = (date) => dayjs(date).format('YYYY');
const humanizePopupDate = (date) => dayjs(date).format('D MMMM YYYY');
const humanizeCommDate = (date) => {
  if (new Date().getTime() - new Date(date).getTime() < TWO_DAYS_MILLISECONDS) {
    return dayjs(date).fromNow();
  }
  return dayjs(date).format('YYYY/MMMM/DD HH:MM');
};

const isFilmChecked = (check) => Object.values(check).some(Boolean);

const filters = {
  [FilterType.ALL]: (movies) => movies,
  [FilterType.WATCHLIST]: (movies) => movies.filter(({ userDetails }) => userDetails.watchlist === true),
  [FilterType.HISTORY]: (movies) => movies.filter(({ userDetails }) => userDetails.alreadyWatched === true),
  [FilterType.FAVORITES]: (movies) => movies.filter(({ userDetails }) => userDetails.favorite === true),
};

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};


export { getRandomInteger, humanizeDate, getRandomNumber, isFilmChecked, humanizePopupDate, humanizeCommDate, filters, updateItem };
