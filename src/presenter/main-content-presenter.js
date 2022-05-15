import FilmsSectionView from '../view/films-section-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import FilmCardView from '../view/film-card-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import { Titles } from '../consts.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import CardPresenter from './card-presenter.js';
import NoResultsView from '../view/no-results-view.js';
import SortView from '../view/sorts-view.js';
import CardsModel from '../model/cards-model.js';
import { updateItem } from '../utils.js';


const CARD_COUNT_PER_STEP = 5;


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
  #cards = new CardsModel();

  #listCards = [];
  #renderCardCount = CARD_COUNT_PER_STEP;
  #cardPresenter = new Map();

  constructor(mainContainer, cardsModel) {
    this.#mainContainer = mainContainer;
    this.#cardsModel = cardsModel;
  }

  init = () => {
    this.#listCards = [...this.#cardsModel.cards];
    this.#renderBoard();
  };

  #renderCards = (from, to) => {

    this.#listCards
      .slice(from, to)
      .forEach((card) => this.#renderCard(card, this.#filmsSectionList.container));
  };

  #renderNoResults = () => {
    render(this.#mainComponent, this.#mainContainer);
    render(this.#noResultsComponent, this.#mainComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderLoadMoreButton = () => {

    render(this.#showMoreBtnComponent, this.#mainComponent.element);
    this.#showMoreBtnComponent.setClickHandler(this.#handleShowMoreBtnClick);
  };

  #handleShowMoreBtnClick = () => {

    this.#renderCards(this.#renderCardCount, this.#renderCardCount + CARD_COUNT_PER_STEP);

    this.#renderCardCount += CARD_COUNT_PER_STEP;

    if (this.#renderCardCount >= this.#listCards.length) {
      remove(this.#showMoreBtnComponent);
    }
  };

  #handleCardChange = (updatedCard) => {
    this.#listCards = updateItem(this.#listCards, updatedCard);
    this.#cardPresenter.get(updatedCard.id).init(updatedCard);
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#mainComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderCardList = () => {

    render(this.#mainComponent, this.#mainContainer);
    render(this.#filmsSectionList, this.#mainComponent.element);
    this.#renderCards(0, Math.min(this.#listCards.length, CARD_COUNT_PER_STEP));

    if (this.#listCards.length > CARD_COUNT_PER_STEP) {
      this.#renderLoadMoreButton();
    }
  };

  #renderTops = () => {
    render(this.#topFilmsListContainer, this.#mainComponent.element);
    render(this.#mostCommsListContainer, this.#mainComponent.element);

    for (let i = 0; i < Math.min(this.#listCards.length, 2); i++) {
      render(new FilmCardView(this.#listCards[i]), this.#topFilmsListContainer.container);
    }
    for (let i = 0; i < Math.min(this.#listCards.length, 2); i++) {
      render(new FilmCardView(this.#listCards[i]), this.#mostCommsListContainer.container);
    }
  };

  #renderCard = (card, place) => {
    const cardPresenter = new CardPresenter(this.#filmsSectionList, this.#cards, this.#handleCardChange);
    cardPresenter.init(card, place);
    this.#cardPresenter.set(card.id, cardPresenter);
  };

  #clearCardList = () => {
    this.#cardPresenter.forEach((presenter) => presenter.destroy());
    this.#cardPresenter.clear();
    this.#renderCardCount = CARD_COUNT_PER_STEP;
    remove(this.#showMoreBtnComponent);
  };

  #renderBoard = () => {
    render(this.#mainComponent, this.#mainContainer);

    if (!this.#listCards.length) {
      this.#renderNoResults();
    }

    this.#renderSort();
    this.#renderCardList();
    this.#renderTops();
  };
}
