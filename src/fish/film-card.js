import { getRandomInteger, getRandomNumber } from '../utils.js';
import { nanoid } from 'nanoid';

const Emoji = ['smile', 'sleeping', 'puke', 'angry'];

const Descriptions = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis.',
];

const Posters = [
  'made-for-each-other.png',
  'popeye-meets-sinbad.png',
  'sagebrush-trail.jpg',
  'santa-claus-conquers-the-martians.jpg',
  'the-dance-of-life.jpg',
  'the-great-flamarion.jpg',
  'the-man-with-the-golden-arm.jpg',
];

const Titles = [
  'Avengers',
  'Il buono, il brutto, il cattivo',
  'The Godfather',
  'The Shawshank Redemption',
  'Fight Club',
  'The Matrix',
];

const Genres = [
  'Comedy',
  'Action',
  'Drama',
  'Cartoon',
  'Horror',
  'Triller',
];

const Ages = [
  '0',
  '3+',
  '6+',
  '12+',
  '16+',
  '18+',
];

const Countries = [
  'USA',
  'Russia',
  'Italy',
  'Finland',
  'France',
  'United Kingdom',
];

const Directors = [
  'Tom Ford',
  'Никитос Михалков',
  'Some Guy',
  'Quentin Jerome Tarantino',
  'Guy Ritchie',
  'Peter Robert Jackson',
  'Steven Allan Spielberg',
];

const Comments = [
  'Awesome film!',
  'Didn\'t understand anything about this movie.Watched this for nothing.',
  'The acting is just top notch! I have watched this movie hundreds of times and will watch it hundreds more times!',
  'What was this movie all about?',
  'Why doesn\'t this movie win an Oscar yet ???',
];

const CommsAutors = [
  'Ilya O\'Reilly',
  'Kevin',
  'Vutin Put',
  'Some guy',
  'Nick Name',
];

const generateRandomItem = (item) => {


  const randomIndex = getRandomInteger(0, item.length - 1);

  return item[randomIndex];
};


const generateRandomBoolean = () => {
  const boolean = [
    true,
    false,
  ];

  const randomIndex = getRandomInteger(0, boolean.length - 1);

  return boolean[randomIndex];
};

let idComm = 0;

export const generateCard = () => ({
  'id': nanoid(),
  'comments': [201, 215, 234, 223, 348],
  'filmInfo': {
    'title': generateRandomItem(Titles),
    'alternativeTitle': 'Laziness Who Sold Themselves',
    'totalRating': getRandomNumber(1, 10).toFixed(1),
    'poster': generateRandomItem(Posters),
    'ageRating': generateRandomItem(Ages),
    'director': generateRandomItem(Directors),
    'writers': [
      'Takeshi Kitano'
    ],
    'actors': [
      'Morgan Freeman'
    ],
    'release': {
      'date': '2019-05-11T00:00:00.000Z',
      'releaseCountry': generateRandomItem(Countries),
    },
    'runtime': getRandomInteger(20, 245),
    'genre': [
      generateRandomItem(Genres)
    ],
    'description': generateRandomItem(Descriptions),
  },
  'userDetails': {
    'watchlist': generateRandomBoolean(),
    'alreadyWatched': generateRandomBoolean(),
    'watchingDate': '2019-04-12T16:12:32.554Z',
    'favorite': generateRandomBoolean(),
  }
});

export const generateComment = () => ({
  'id': idComm++,
  'author': generateRandomItem(CommsAutors),
  'comment': generateRandomItem(Comments),
  'date': '2019-05-11T16:12:32.554Z',
  'emotion': generateRandomItem(Emoji),
});
