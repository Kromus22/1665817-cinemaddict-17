import { render, replace, remove } from '../framework/render.js';
import PopupView from '../view/popup-view.js';
import FilmCardView from '../view/film-card-view.js';

const siteBodyElement = document.querySelector('body');
const Mode = {
  OPEN: 'OPEN',
  CLOSE: 'CLOSE',
};


export default class CardPresenter {
  #filmsSectionList = null;
  #changeData = null;
  #cardComponent = null;
  #popupComponent = null;
  #card = null;
  #cardsModel = null;
  #place = null;
  #listComments = [];
  #changeMode = null;
  #mode = Mode.CLOSE;

  constructor(filmsSectionList, cardsModel, changeData, changeMode) {
    this.#filmsSectionList = filmsSectionList;
    this.#cardsModel = cardsModel;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (card, place) => {
    this.#card = card;
    this.#place = place;

    const prevCardComponent = this.#cardComponent;
    const prevPopupComponent = this.#popupComponent;

    this.#listComments = [...this.#cardsModel.comments];
    this.#cardComponent = new FilmCardView(card);


    this.#cardComponent.setOpenHandler(this.#openPopup);
    this.#cardComponent.setWatchlistHandler(this.#handleWatchlistClick);
    this.#cardComponent.setWatchedHandler(this.#handleWatchedClick);
    this.#cardComponent.setFavoriteHandler(this.#handleFavoriteClick);

    if (prevCardComponent === null) {
      render(this.#cardComponent, this.#filmsSectionList.container);
      return;
    }
    replace(this.#cardComponent, prevCardComponent);

    if (this.#mode === Mode.OPEN) {
      if (!prevPopupComponent) { this.#openPopup(); }
    }

    remove(prevCardComponent);
  };

  destroy = () => {
    remove(this.#cardComponent);
    remove(this.#popupComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.CLOSE) {
      this.#closePopup();
    }
  };

  #createPopup = () => {
    this.#popupComponent = new PopupView(this.#card, this.#listComments);
    this.#popupComponent.setClosePopupButtonHandler(this.#closePopup);
    this.#popupComponent.setWatchlistHandler(this.#handleWatchlistClick);
    this.#popupComponent.setWatchedHandler(this.#handleWatchedClick);
    this.#popupComponent.setFavoriteHandler(this.#handleFavoriteClick);
  };

  #handleWatchlistClick = () => {
    this.#changeData({
      ...this.#card,
      userDetails: {
        ...this.#card.userDetails,
        watchlist: !this.#card.userDetails.watchlist
      }
    });
  };

  #handleWatchedClick = () => {
    this.#changeData({
      ...this.#card,
      userDetails: {
        ...this.#card.userDetails,
        alreadyWatched: !this.#card.userDetails.alreadyWatched
      }
    });
  };

  #handleFavoriteClick = () => {
    this.#changeData({
      ...this.#card,
      userDetails: {
        ...this.#card.userDetails,
        favorite: !this.#card.userDetails.favorite
      }
    });
  };

  #openPopup = () => {
    this.#changeMode();
    this.#createPopup(this.prevPopupComponent);
    siteBodyElement.appendChild(this.#popupComponent.element);
    siteBodyElement.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#mode = Mode.OPEN;
  };

  #closePopup = () => {
    siteBodyElement.removeChild(this.#popupComponent.element);
    siteBodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this.#popupComponent = null;
    this.#mode = Mode.CLOSE;
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#closePopup(this.#card);
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };
}

