import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { humanizePopupDate, humanizeCommDate } from '../utils.js';
import { getRandomInteger } from '../utils.js';

const createPopupTemplate = (card, commentsForPopup) => {
  const { id, comments, filmInfo, userDetails } = card;

  const releaseDate = filmInfo.release.date !== null
    ? humanizePopupDate(filmInfo.release.date)
    : '';

  const watchlistCheck = (userDetails.watchlist === true)
    ? 'film-details__control-button--active'
    : '';

  const watchedCheck = (userDetails.alreadyWatched === true)
    ? 'film-details__control-button--active'
    : '';

  const favoriteCheck = (userDetails.favorite === true)
    ? 'film-details__control-button--active'
    : '';

  const durationHours = Math.floor(filmInfo.runtime / 60);
  const durationMinutes = filmInfo.runtime - durationHours * 60;

  const genres = card.filmInfo.genre.reduce((acc, genre) => `${acc}<span class="film-details__genre">${genre}</span>`, '');

  const commentsCount = card.comments.length;

  const idCommentsThisFilm = commentsForPopup.filter(({ id }) => comments.some((idComm) => idComm === Number(id)));

  const commentsForFilm = () => idCommentsThisFilm.map(({ id, author, comment, date, emotion }) =>
    `<li class="film-details__comment">
        <span class="film-details__comment-emoji">
          <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
        </span>
        <div>
          <p class="film-details__comment-text">${comment}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${author}</span>
            <span class="film-details__comment-day">${humanizeCommDate(date)}</span>
            <button class="film-details__comment-delete" data-comment-id=${id}>Delete</button>
          </p>
        </div>
      </li>`
  ).join('');

  const selectedEmoji = card.emojiForComm ?
    `<img src="images/emoji/${card.emojiForComm}.png" width="55" height="55" alt="emoji-${card.emojiForComm}}"></img>`
    : '';

  return (`
    <section class="film-details" data-film-id=${id}>
      <form class="film-details__inner" action="" method="get">
        <div class="film-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="./images/posters/${filmInfo.poster}" alt="">

              <p class="film-details__age">${filmInfo.ageRating}</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${filmInfo.title}</h3>
                  <p class="film-details__title-original">${filmInfo.alternativeTitle}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${filmInfo.totalRating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${filmInfo.director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${filmInfo.writers.map((writer) => writer).join(', ')}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${filmInfo.actors.map((actor) => actor).join(', ')}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${releaseDate}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${durationHours}h ${durationMinutes}m</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${filmInfo.release.releaseCountry}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Genres</td>
                  <td class="film-details__cell">
                    ${genres}
                </tr>
              </table>

              <p class="film-details__film-description">
                ${filmInfo.description}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            <button type="button" data-control-type="watchlist" class="film-details__control-button film-details__control-button--watchlist ${watchlistCheck}" id="watchlist" name="watchlist">Add to watchlist</button>
            <button type="button" data-control-type="watched" class="film-details__control-button film-details__control-button--watched ${watchedCheck}" id="watched" name="watched">Already watched</button>
            <button type="button" data-control-type="favorite" class="film-details__control-button film-details__control-button--favorite ${favoriteCheck}" id="favorite" name="favorite">Add to favorites</button>
          </section>
        </div>

        <div class="film-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsCount}</span></h3>

            <ul class="film-details__comments-list">
              ${commentsForFilm()}
            </ul>

            <div class="film-details__new-comment">
              <div class="film-details__add-emoji-label">${selectedEmoji}</div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${card.commentText ? card.commentText : ''}</textarea>
              </label>

              <div class="film-details__emoji-list">
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
                <label class="film-details__emoji-label" for="emoji-smile">
                  <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
                <label class="film-details__emoji-label" for="emoji-sleeping">
                  <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
                <label class="film-details__emoji-label" for="emoji-puke">
                  <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
                <label class="film-details__emoji-label" for="emoji-angry">
                  <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                </label>
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>
  `);
};

const createNewCommentTemplate = (evt) => ({
  'id': `${getRandomInteger(349, 400)}`,
  'author': 'Some Guy',
  'comment': evt.target.value,
  'date': new Date(),
  'emotion': 'smile'
});

export default class PopupView extends AbstractStatefulView {
  #comment = null;

  constructor(card, comment) {
    super();
    this._state = this.#convertCardToState(card);
    this.#comment = comment;
    this.#setInnerHandlers();
  }

  get template() {
    return createPopupTemplate(this._state, this.#comment);
  }

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.#setOuterHandlers();
  };

  setClosePopupButtonHandler = (callback) => {
    this._callback.closePopupButtonHandler = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closePopupButtonHandler);
  };

  setWatchlistHandler = (callback) => {
    this._callback.popupWatchlistHandler = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#popupWatchlistHandler);
  };

  setWatchedHandler = (callback) => {
    this._callback.popupWatchedHandler = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#popupWatchedHandler);
  };

  setFavoriteHandler = (callback) => {
    this._callback.popupFavoriteHandler = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#popupFavoriteHandler);
  };

  #closePopupButtonHandler = (evt) => {
    evt.preventDefault();
    this._callback.closePopupButtonHandler();
  };

  #popupWatchlistHandler = (evt) => {
    evt.preventDefault();
    this._callback.popupWatchlistHandler();
    this.updateElement({
      ...this._state,
      userDetails: {
        ...this._state.userDetails,
        watchlist: !this._state.userDetails.watchlist
      },
      scrollTop: this.element.scrollTop
    });
  };

  #popupWatchedHandler = (evt) => {
    evt.preventDefault();
    this._callback.popupWatchedHandler();
    this.updateElement({
      ...this._state,
      userDetails: {
        ...this._state.userDetails,
        alreadyWatched: !this._state.userDetails.alreadyWatched
      },
      scrollTop: this.element.scrollTop
    });
  };

  #popupFavoriteHandler = (evt) => {
    evt.preventDefault();
    this._callback.popupFavoriteHandler();
    this.updateElement({
      ...this._state,
      userDetails: {
        ...this._state.userDetails,
        favorite: !this._state.userDetails.favorite
      },
      scrollTop: this.element.scrollTop
    });
  };

  #convertCardToState = (card) => ({
    ...card,
    emojiForComm: null,
    commentText: null,
    scrollTop: null,
  });

  #convertStateToCard = (state) => {
    const card = { ...state };
    delete card.emojiForComm;
    delete card.commentText;
    delete card.scrollTop;

    return card;
  };

  #localCommentEmojiClickHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      emojiForComm: evt.target.value,
      scrollTop: this.element.scrollTop
    });
  };

  #localCommentInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      commentText: evt.target.value,
      scrollTop: this.element.scrollTop,
    });
  };

  setCommentDeleteClickHandler = (callback) => {
    this._callback.commentDeleteClick = callback;
    this.element.querySelector('.film-details__comments-list').addEventListener('click', this.#commentDeleteClickHandler);
  };

  #commentDeleteClickHandler = (evt) => {
    if (evt.target.nodeName === 'BUTTON') {
      evt.preventDefault();
      this._callback.commentDeleteClick(evt.target.dataset.commentId);
    }
  };

  setformSubmitHandler = (callback) => {
    this._callback.commentFormSubmit = callback;
    this.element.querySelector('.film-details__comment-input').addEventListener('keydown', this.#formSubmitHandler);
  };

  #formSubmitHandler = (evt) => {
    if ((evt.keyCode === 10 || evt.keyCode === 13) && (evt.ctrlKey || evt.metaKey)) {
      evt.preventDefault();
      this._callback.commentFormSubmit(createNewCommentTemplate(evt));
      evt.target.value = '';
    }
  };

  #setInnerHandlers = () => {
    this.element.querySelectorAll('.film-details__emoji-item')
      .forEach((element) => element.addEventListener('click', this.#localCommentEmojiClickHandler));
    this.element.querySelector('.film-details__comment-input')
      .addEventListener('input', this.#localCommentInputHandler);
  };

  #setOuterHandlers = () => {
    this.setClosePopupButtonHandler(this._callback.closePopupButtonHandler);
    this.setWatchlistHandler(this._callback.popupWatchlistHandler);
    this.setWatchedHandler(this._callback.popupWatchedHandler);
    this.setFavoriteHandler(this._callback.popupFavoriteHandler);
    this.setCommentDeleteClickHandler(this._callback.commentDeleteClick);
    this.setformSubmitHandler(this._callback.commentFormSubmit);
  };
}
