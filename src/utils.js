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

const isFilmChecked = (check) => Object.values(check).some(Boolean);

const getArray = (item) => {
  const maxLength = item.length;
  const lengthOfArray = getRandomNumber(1, maxLength);
  const array = [];

  while (array.length < lengthOfArray) {
    const indexOfEl = getRandomNumber(0, maxLength - 1);
    const el = item[indexOfEl];

    if (!array.includes(el)) {
      array.push(el);
    }
  }
  return array;
};


export { getRandomInteger, Titles, humanizeDate, getRandomNumber, isFilmChecked, getArray, humanizePopupDate };
