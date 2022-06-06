import AbstractView from '../framework/view/abstract-view.js';
import { humanizeDate } from '../utils.js';

const createFilmCardTemplate = (card) => {
  const MAX_DESCR_LENGTH = 139;

  const { filmInfo, userDetails } = card;

  const description = filmInfo.description.length > MAX_DESCR_LENGTH
    ? `${filmInfo.description.slice(0, MAX_DESCR_LENGTH)}...` : filmInfo.description;

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

  const commentsCount = card.comments.length;

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
      <p class="film-card__description">${description}</p>
      <span class="film-card__comments">${commentsCount} comments</span>
    </a>
    <div class="film-card__controls">
      <button data-control-type="watchlist" class="film-card__controls-item film-card__controls-item--add-to-watchlist ${watchlistCheck}" type="button">Add to watchlist</button>
      <button data-control-type="watched" class="film-card__controls-item film-card__controls-item--mark-as-watched ${watchedCheck}" type="button">Mark as watched</button>
      <button data-control-type="favorite" class="film-card__controls-item film-card__controls-item--favorite ${favoriteCheck}" type="button">Mark as favorite</button>
    </div>
  </article>
  `);
};

export default class FilmCardView extends AbstractView {
  constructor(card) {
    super();
    this.card = card;
  }

  get template() {
    return createFilmCardTemplate(this.card);
  }

  setOpenHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-card__poster').addEventListener('click', this.#openClickHandler);
  };

  setControlButtonClickHandler = (callback) => {
    this._callback.controlButtonClick = callback;

    this.element.querySelector('.film-card__controls').addEventListener('click', (evt) => {
      evt.preventDefault();
      let update;
      switch (evt.target) {
        case this.element.querySelector('.film-card__controls-item--add-to-watchlist'):
          update = { ...this.card, userDetails: { ...this.card.userDetails, watchlist: !this.card.userDetails.watchlist } };
          break;
        case this.element.querySelector('.film-card__controls-item--mark-as-watched'):
          update = { ...this.card, userDetails: { ...this.card.userDetails, alreadyWatched: !this.card.userDetails.alreadyWatched } };
          break;
        case this.element.querySelector('.film-card__controls-item--favorite'):
          update = { ...this.card, userDetails: { ...this.card.userDetails, favorite: !this.card.userDetails.favorite } };
          break;
      }

      this._callback.controlButtonClick(update);
    });
  };

  #openClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };
}
