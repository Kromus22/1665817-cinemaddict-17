import FilmsSectionView from '../view/films-section-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import FilmCardView from '../view/film-card-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import { Titles } from '../utils.js';
import { render } from '../render.js';
import PopupView from '../view/popup-view.js';
import NoResultsView from '../view/no-results-view.js';
import SortView from '../view/sorts-view.js';

const CARD_COUNT_PER_STEP = 5;

const siteBodyElement = document.querySelector('body');

export default class ContentPresenter {
  #mainContainer = null;
  #cardsModel = null;

  #mainComponent = new FilmsSectionView();
  #sortComponent = new SortView();
  #noResultsComponent = new NoResultsView();
  #filmsSectionList = new FilmsContainerView(Titles.com);
  #topFilmsListContainer = new FilmsContainerView(Titles.top, 'films-list--extra');
  #mostCommsListContainer = new FilmsContainerView(Titles.most, 'films-list--extra');
  #showMoreBtnComponent = new ShowMoreButtonView();

  #listCards = [];
  #listComments = [];
  #renderCardCount = CARD_COUNT_PER_STEP;


  init = (mainContainer, cardsModel) => {
    this.#mainContainer = mainContainer;
    this.#cardsModel = cardsModel;
    this.#listCards = [...this.#cardsModel.cards];
    this.#listComments = [...this.#cardsModel.comments];

    if (!this.#listCards.length) {
      render(this.#mainComponent, this.#mainContainer);
      render(this.#noResultsComponent, this.#mainComponent.element);
    } else {
      render(this.#sortComponent, this.#mainComponent.element);
      render(this.#mainComponent, this.#mainContainer);
      render(this.#filmsSectionList, this.#mainComponent.element);

      if (this.#listCards.length > CARD_COUNT_PER_STEP) {
        render(this.#showMoreBtnComponent, this.#filmsSectionList.element);

        this.#showMoreBtnComponent.element.addEventListener('click', this.#handleShowMoreBtnClick);

      }

      render(this.#topFilmsListContainer, this.#mainComponent.element);
      render(this.#mostCommsListContainer, this.#mainComponent.element);

      for (let i = 0; i < Math.min(this.#listCards.length, CARD_COUNT_PER_STEP); i++) {
        this.#renderCards(this.#listCards[i], this.#filmsSectionList.container);
      }
      render(new FilmCardView(this.#listCards[0]), this.#topFilmsListContainer.container);
      render(new FilmCardView(this.#listCards[0]), this.#mostCommsListContainer.container);
    }
  };

  #handleShowMoreBtnClick = (evt) => {
    evt.preventDefault();
    this.#listCards.slice(this.#renderCardCount, this.#renderCardCount + CARD_COUNT_PER_STEP)
      .forEach((card) => this.#renderCards(card, this.#filmsSectionList.container));

    this.#renderCardCount += CARD_COUNT_PER_STEP;

    if (this.#renderCardCount >= this.#listCards.length) {
      this.#showMoreBtnComponent.element.remove();
      this.#showMoreBtnComponent.removeElement();
    }
  };

  #renderCards = (card, place) => {
    const cardComponent = new FilmCardView(card);
    const popupComponent = new PopupView(card, this.#listComments);

    const openPopup = () => {
      siteBodyElement.appendChild(popupComponent.element);
      siteBodyElement.classList.add('hide-overflow');
    };

    const closePopup = () => {
      siteBodyElement.removeChild(popupComponent.element);
      siteBodyElement.classList.remove('hide-overflow');
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        closePopup();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    cardComponent.element.querySelector('.film-card__poster').addEventListener('click', () => {
      openPopup();
      document.addEventListener('keydown', onEscKeyDown);
    });

    popupComponent.element.querySelector('.film-details__close-btn').addEventListener('click', () => {
      closePopup();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(cardComponent, place);
  };
}
