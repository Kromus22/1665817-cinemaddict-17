import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { FilterType } from './consts.js';

dayjs.extend(relativeTime);
const TWO_DAYS_MILLISECONDS = 172800000;

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

const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

const sortDateDown = (filmA, filmB) => {
  const weight = getWeightForNullDate(filmA.filmInfo.release.date, filmB.filmInfo.release.date);

  return weight ?? dayjs(filmB.filmInfo.release.date).diff(dayjs(filmA.filmInfo.release.date));
};

const sortRatingDown = (filmA, filmB) =>
  +filmB.filmInfo.totalRating - +filmA.filmInfo.totalRating;


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


export { sortDateDown, sortRatingDown, humanizeDate, isFilmChecked, humanizePopupDate, humanizeCommDate, filters, updateItem };
