import { getRandomInteger, getRandomNumber } from '../utils.js';

const generateDescription = () => {
  const descriptions = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra.',
    'Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis.',
  ];

  const randomIndex = getRandomInteger(0, descriptions.length - 1);

  return descriptions[randomIndex];
};

const generatePosters = () => {
  const posters = [
    'made-for-each-other.png',
    'popeye-meets-sinbad.png',
    'sagebrush-trail.jpg',
    'santa-claus-conquers-the-martians.jpg',
    'the-dance-of-life.jpg',
    'the-great-flamarion.jpg',
    'the-man-with-the-golden-arm.jpg',
  ];

  const randomIndex = getRandomInteger(0, posters.length - 1);

  return posters[randomIndex];
};

const generateTitles = () => {
  const titles = [
    'Avengers',
    'Il buono, il brutto, il cattivo',
    'The Godfather',
    'The Shawshank Redemption',
    'Fight Club',
    'The Matrix',
  ];

  const randomIndex = getRandomInteger(0, titles.length - 1);

  return titles[randomIndex];
};

const generateGenre = () => {
  const genres = [
    'Comedy',
    'Action',
    'Drama',
    'Cartoon',
    'Horror',
    'Triller',
  ];

  const randomIndex = getRandomInteger(0, genres.length - 1);

  return genres[randomIndex];
};

export const generateCard = () => ({
  'id': '0',
  'comments': [
  ],
  'filmInfo': {
    'title': generateTitles(),
    'alternativeTitle': 'Laziness Who Sold Themselves',
    'totalRating': getRandomNumber(1, 10).toFixed(1),
    'poster': generatePosters(),
    'ageRating': 0,
    'director': 'Tom Ford',
    'writers': [
      'Takeshi Kitano'
    ],
    'actors': [
      'Morgan Freeman'
    ],
    'release': {
      'date': '2019-05-11T00:00:00.000Z',
      'releaseCountry': 'Finland'
    },
    'runtime': getRandomInteger(20, 245),
    'genre': [
      generateGenre()
    ],
    'description': generateDescription(),
  },
  'userDetails': {
    'watchlist': false,
    'alreadyWatched': true,
    'watchingDate': '2019-04-12T16:12:32.554Z',
    'favorite': false
  }
});


