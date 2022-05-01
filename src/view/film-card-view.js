import { createElement } from '../render.js';
import { humanizeDate } from '../utils.js';

const createFilmCardTemplate = (card) => {
  const { filmInfo, userDetails } = card;

  const releaseDate = filmInfo.release.date !== null
    ? humanizeDate(filmInfo.release.date)
    : '';

  const watchlistCheck = (userDetails.watchlist === true)
    ? 'film-card__controls-item--active'
    : '';

  const watchedCheck = (userDetails.alreadyWatched === true)
    ? 'film-card__controls-item--active'
    : '';

  const favoriteCheck = (userDetails.favorite === true)
    ? 'film-card__controls-item--active'
    : '';

  const durationHours = Math.floor(filmInfo.runtime / 60);
  const durationMinutes = filmInfo.runtime - durationHours * 60;

  return (`
  <article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${filmInfo.title}</h3>
      <p class="film-card__rating">${filmInfo.totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseDate}</span>
        <span class="film-card__duration">${durationHours}h${durationMinutes}m</span>
        <span class="film-card__genre">${filmInfo.genre}</span>
      </p>
      <img src="./images/posters/${filmInfo.poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${filmInfo.description}</p>
      <span class="film-card__comments">0 comments</span>
    </a>
    <div class="film-card__controls">
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${watchlistCheck}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${watchedCheck}" type="button">Mark as watched</button>
      <button class="film-card__controls-item film-card__controls-item--favorite ${favoriteCheck}" type="button">Mark as favorite</button>
    </div>
  </article>
  `);
};

export default class FilmCardView {
  constructor(card) {
    this.card = card;
  }

  getTemplate() {
    return createFilmCardTemplate(this.card);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
