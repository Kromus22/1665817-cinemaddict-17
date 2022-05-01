import { getRandomInteger, getRandomNumber, getArray } from '../utils.js';

const generateDescription = () => {
  const descriptions = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra.',
    'Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis.',
  ];

  const randomIndex = getRandomInteger(0, descriptions.length - 1);

  return descriptions[randomIndex];
};

const idCommentsForFilm = Array.from({ length: 200 }, (v, i) => i + 1);

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

const generateAgeRating = () => {
  const ages = [
    '0',
    '3+',
    '6+',
    '12+',
    '16+',
    '18+',
  ];

  const randomIndex = getRandomInteger(0, ages.length - 1);

  return ages[randomIndex];
};

const generateCountry = () => {
  const countries = [
    'USA',
    'Russia',
    'Italy',
    'Finland',
    'France',
    'United Kingdom',
  ];

  const randomIndex = getRandomInteger(0, countries.length - 1);

  return countries[randomIndex];
};

const generateDirector = () => {
  const directors = [
    'Tom Ford',
    'Никитос Михалков',
    'Some Guy',
    'Quentin Jerome Tarantino',
    'Guy Ritchie',
    'Peter Robert Jackson',
    'Steven Allan Spielberg',
  ];

  const randomIndex = getRandomInteger(0, directors.length - 1);

  return directors[randomIndex];
};

const generateRandomBoolean = () => {
  const boolean = [
    true,
    false,
  ];

  const randomIndex = getRandomInteger(0, boolean.length - 1);

  return boolean[randomIndex];
};

let idCounter = 1;
const getSomeId = () => idCounter++;

export const generateCard = () => ({
  'id': getSomeId(),
  'comments': [],
  'filmInfo': {
    'title': generateTitles(),
    'alternativeTitle': 'Laziness Who Sold Themselves',
    'totalRating': getRandomNumber(1, 10).toFixed(1),
    'poster': generatePosters(),
    'ageRating': generateAgeRating(),
    'director': generateDirector(),
    'writers': [
      'Takeshi Kitano'
    ],
    'actors': [
      'Morgan Freeman'
    ],
    'release': {
      'date': '2019-05-11T00:00:00.000Z',
      'releaseCountry': generateCountry(),
    },
    'runtime': getRandomInteger(20, 245),
    'genre': [
      generateGenre()
    ],
    'description': generateDescription(),
  },
  'userDetails': {
    'watchlist': generateRandomBoolean(),
    'alreadyWatched': generateRandomBoolean(),
    'watchingDate': '2019-04-12T16:12:32.554Z',
    'favorite': generateRandomBoolean(),
  }
});

export const generateComment = () => ({
  'id': getSomeId(),
  'author': 'Ilya O\'Reilly',
  'comment': 'a film that changed my life, a true masterpiece, post-credit scene was just amazing omg.',
  'date': '2019-05-11T16:12:32.554Z',
  'emotion': 'smile',
});
