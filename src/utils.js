import dayjs from 'dayjs';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomNumber = (min, max) => min + Math.random() * (max - min);

const Titles = {
  com: 'common',
  top: 'topRated',
  most: 'mostComm',
};

const humanizeDate = (date) => dayjs(date).format('YYYY');
const humanizePopupDate = (date) => dayjs(date).format('D MMMM YYYY');
const humanizeCommDate = (date) => dayjs(date).format('YYYY/MMMM/DD HH:MM');

const isFilmChecked = (check) => Object.values(check).some(Boolean);


export { getRandomInteger, Titles, humanizeDate, getRandomNumber, isFilmChecked, humanizePopupDate, humanizeCommDate };
