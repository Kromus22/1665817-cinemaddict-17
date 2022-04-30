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


export { getRandomInteger, Titles, humanizeDate, getRandomNumber };
