import { render, replace, remove } from '../framework/render.js';
import PopupView from '../view/popup-view.js';
import FilmCardView from '../view/film-card-view.js';
import { UpdateType, UserAction } from '../consts.js';

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
  #filterModel = null;

  constructor(filmsSectionList, changeData, changeMode, filterModel, cardsModel) {
    this.#filmsSectionList = filmsSectionList;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    this.#filterModel = filterModel;
    this.#cardsModel = cardsModel;
  }

  init = (card, place) => {
    this.#card = card;
    this.#place = place;

    const prevCardComponent = this.#cardComponent;
    const prevPopupComponent = this.#popupComponent;

    this.#listComments = [...this.#cardsModel.comments];
    this.#cardComponent = new FilmCardView(card);


    this.#cardComponent.setOpenHandler(this.#openPopup);
    this.#cardComponent.setControlButtonClickHandler(this.#handleControlButtonClick);

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

  #handleControlButtonClick = (update) => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      update
    );
  };

  #createPopup = () => {
    this.#popupComponent = new PopupView(this.#card, this.#listComments);
    this.#popupComponent.setClosePopupButtonHandler(this.#closePopup);
    this.#popupComponent.setControlButtonClickHandler(this.#handleControlButtonClick);
    this.#popupComponent.setCommentDeleteClickHandler(this.#onCommentDeleteClick);
    this.#popupComponent.setformSubmitHandler(this.#onCommentFormSubmit);
  };

  #onCommentDeleteClick = (update, comment) => {
    this.#cardsModel.founded = true;
    this.#changeData(UserAction.DELETE_COMMENT,
      UpdateType.MINOR,
      update,
      comment);
  };

  #onCommentFormSubmit = (update, comment) => {
    this.#cardsModel.founded = true;
    this.#changeData(UserAction.ADD_COMMENT,
      UpdateType.MINOR,
      update,
      comment);
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

