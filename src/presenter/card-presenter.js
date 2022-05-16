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
    this.#popupComponent = new PopupView(card, this.#listComments);

    this.#cardComponent.setOpenHandler(this.#openPopup);
    this.#cardComponent.setControlClickHandler(this.#handleControlClick);

    this.#popupComponent.setClosePopupButtonHandler(this.#closePopup);
    this.#popupComponent.setControlButtonClickHandler(this.#handleControlClick);

    if (prevCardComponent === null || prevPopupComponent === null) {
      render(this.#cardComponent, this.#filmsSectionList.container);
      return;
    }

    if (this.#mode === Mode.CLOSE) {
      replace(this.#cardComponent, prevCardComponent);
    }

    if (this.#mode === Mode.OPEN) {
      replace(this.#popupComponent, prevPopupComponent);
    }

    remove(prevCardComponent);
    remove(prevPopupComponent);
  };

  destroy = () => {
    remove(this.#cardComponent);
    remove(this.#popupComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.CLOSE) {
      this.#openPopup();
    }
  };

  #handleControlClick = (controlType) => {
    this.#changeData({ ...this.#card, [controlType]: !this.#card[controlType] });
  };

  #openPopup = () => {
    siteBodyElement.appendChild(this.#popupComponent.element);
    siteBodyElement.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#changeMode();
  };

  #closePopup = (card) => {
    siteBodyElement.removeChild(this.#popupComponent.element);
    siteBodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this.#changeData(card);
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

