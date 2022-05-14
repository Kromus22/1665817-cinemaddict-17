import { render } from '../framework/render.js';
import PopupView from '../view/popup-view.js';
import FilmCardView from '../view/film-card-view.js';

const siteBodyElement = document.querySelector('body');

export default class CardPresenter {
  #filmsSectionList = null;
  #cardComponent = null;
  #popupComponent = null;
  #card = null;
  #cardsModel = null;
  #place = null;
  #listComments = [];

  constructor(filmsSectionList, cardsModel) {
    this.#filmsSectionList = filmsSectionList;
    this.#cardsModel = cardsModel;
  }

  init = (card, place) => {
    this.#card = card;
    this.#place = place;
    this.#listComments = [...this.#cardsModel.comments];

    this.#cardComponent = new FilmCardView(card);
    this.#popupComponent = new PopupView(card, this.#listComments);
    this.#cardComponent.setOpenHandler(this.#openPopup);
    this.#popupComponent.setClosePopupButtonHandler(this.#closePopup);

    render(this.#cardComponent, this.#filmsSectionList.container);
  };

  #openPopup = () => {
    siteBodyElement.appendChild(this.#popupComponent.element);
    siteBodyElement.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#onEscKeyDown);
  };

  #closePopup = () => {
    siteBodyElement.removeChild(this.#popupComponent.element);
    siteBodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onEscKeyDown);
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#closePopup();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };
}

