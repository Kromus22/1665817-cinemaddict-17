import AbstractView from '../framework/view/abstract-view.js';
import { humanizeDate } from '../utils.js';
const MAX_DESCR_LENGTH = 139;

const createFilmCardTemplate = (card) => {
  if (card) {
    const {
      filmInfo: { title, totalRating, release, runtime, genre, poster, description },
      userDetails: { watchlist, alreadyWatched, favorite }
    } = card;

    const descriptionFilm = description.length > MAX_DESCR_LENGTH
      ? `${description.slice(0, MAX_DESCR_LENGTH)}...` : description;

    const releaseDate = release.date !== null
      ? humanizeDate(release.date)
      : '';

    const getControlClassName = (option) => option
      ? 'film-card__controls-item--active'
      : '';

    const durationHours = Math.floor(runtime / 60);
    const durationMinutes = runtime - durationHours * 60;

    const commentsCount = card.comments.length;

    return (`
  <article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseDate}</span>
        <span class="film-card__duration">${durationHours}h${durationMinutes}m</span>
        <span class="film-card__genre">${genre[0]}</span>
      </p>
      <img src="./${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${descriptionFilm}</p>
      <span class="film-card__comments">${commentsCount} comments</span>
    </a>
    <div class="film-card__controls">
      <button data-control-type="watchlist" class="film-card__controls-item film-card__controls-item--add-to-watchlist ${getControlClassName(watchlist)}" type="button">Add to watchlist</button>
      <button data-control-type="watched" class="film-card__controls-item film-card__controls-item--mark-as-watched ${getControlClassName(alreadyWatched)}" type="button">Mark as watched</button>
      <button data-control-type="favorite" class="film-card__controls-item film-card__controls-item--favorite ${getControlClassName(favorite)}" type="button">Mark as favorite</button>
    </div>
  </article>
  `);
  }
};

export default class FilmCardView extends AbstractView {
  constructor(card) {
    super();
    this.card = card;
  }

  get template() {
    return createFilmCardTemplate(this.card);
  }

  setClickHandler = (callback) => {
    this._callback.movieCardClick = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', this.#clickHandler);
  };

  #clickHandler = () => {
    this._callback.movieCardClick();
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.toWatchListClick = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#watchListClickHandler);
  };

  #watchListClickHandler = () => {
    this._callback.toWatchListClick();
  };

  setAlreadyWatchedClickHandler = (callback) => {
    this._callback.alreadyWatchedClick = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#alreadyWatchedClickHandler);
  };

  #alreadyWatchedClickHandler = () => {
    this._callback.alreadyWatchedClick();
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#favoriteClickHandler);
  };

  #favoriteClickHandler = () => {
    this._callback.favoriteClick();
  };
}
