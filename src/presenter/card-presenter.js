import { render, replace, remove } from '../framework/render.js';
import PopupView from '../view/popup-view.js';
import FilmCardView from '../view/film-card-view.js';

const siteBodyElement = document.querySelector('body');

export default class CardPresenter {
  #filmsSectionList = null;
  #changeData = null;
  #cardComponent = null;
  #popupComponent = null;
  #card = null;
  #cardsModel = null;
  #place = null;
  #listComments = [];

  constructor(filmsSectionList, cardsModel, changeData) {
    this.#filmsSectionList = filmsSectionList;
    this.#cardsModel = cardsModel;
    this.#changeData = changeData;
  }

  init = (card, place) => {
    this.#card = card;
    this.#place = place;

    const prevCardComponent = this.#cardComponent;
    const prevPopupComponent = this.#popupComponent;

    this.#listComments = [...this.#cardsModel.comments];
    this.#cardComponent = new FilmCardView(card);
    this.#popupComponent = new PopupView(card, this.#listComments);
    this.#cardComponent.setOpenHandler(this.#openPopup);
    this.#cardComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#cardComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
    this.#cardComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#popupComponent.setClosePopupButtonHandler(this.#closePopup);

    if (prevCardComponent === null || prevPopupComponent === null) {
      render(this.#cardComponent, this.#filmsSectionList.container);
      return;
    }

    if (this.#filmsSectionList.contains(prevCardComponent.element)) {
      replace(this.#cardComponent, prevCardComponent);
    }

    if (this.#filmsSectionList.contains(prevPopupComponent.element)) {
      replace(this.#popupComponent, prevPopupComponent);
    }

    remove(prevCardComponent);
    remove(prevPopupComponent);
  };

  destroy = () => {
    remove(this.#cardComponent);
    remove(this.#popupComponent);
  };

  #handleWatchlistClick = () => {
    this.#changeData({ ...this.card, userDetails: { ...this.card.userDetails, watchlist: true } });
  };

  #handleAlreadyWatchedClick = () => {
    this.#changeData({ ...this.card, userDetails: { ...this.card.userDetails, alreadyWatched: true } });
  };

  #handleFavoriteClick = () => {
    this.#changeData({ ...this.card, userDetails: { ...this.card.userDetails, favorite: true } });
  };

  #openPopup = () => {
    siteBodyElement.appendChild(this.#popupComponent.element);
    siteBodyElement.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#onEscKeyDown);
  };

  #closePopup = (card) => {
    siteBodyElement.removeChild(this.#popupComponent.element);
    siteBodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this.#changeData(card);
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#closePopup();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };
}

