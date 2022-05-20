import FilmsSectionView from '../view/films-section-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import FilmCardView from '../view/film-card-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import { Titles, SortType } from '../consts.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import CardPresenter from './card-presenter.js';
import NoResultsView from '../view/no-results-view.js';
import SortView from '../view/sorts-view.js';
import CardsModel from '../model/cards-model.js';
import { updateItem } from '../utils.js';


const CARD_COUNT_PER_STEP = 5;
const TOP_FILMS_COUNT = 2;

export default class ContentPresenter {
  #mainContainer = null;
  #cardsModel = null;
  #movies = [];

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
  #sourceCards = [];
  #currentSortType = SortType.DEFAULT;

  constructor(mainContainer, cardsModel) {
    this.#mainContainer = mainContainer;
    this.#cardsModel = cardsModel;
    this.#movies = cardsModel.cards;
    this.#sourceCards = [...this.#cardsModel.cards];
  }

  init = () => {
    this.#listCards = [...this.#cardsModel.cards];
    this.#renderBoard();
  };

  #renderCards = (from, to) => {
    this.#movies
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

  #handleModeChange = () => {
    this.#cardPresenter.forEach((presenter) => presenter.resetView());
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#mainComponent.element, RenderPosition.AFTERBEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #sortCards = (sortType) => {
    switch (sortType) {
      case SortType.DATE:
        this.#movies = this.#movies.sort((el, el2) => new Date(el.filmInfo.release.date).getTime() - new Date(el2.filmInfo.release.date).getTime());
        break;
      case SortType.RATING:
        this.#movies = this.#movies.sort((el, el2) => +el.filmInfo.totalRating - +el2.filmInfo.totalRating);
        break;
      default:
        this.#movies = this.#sourceCards;
    }

    this.#currentSortType = sortType;
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortCards(sortType);
    this.#clearCardList();
    this.#renderCardList();
    this.#renderTops();
  };

  #renderCardList = () => {
    render(this.#mainComponent, this.#mainContainer);
    render(this.#filmsSectionList, this.#mainComponent.element);
    this.#renderCards(0, Math.min(this.#movies.length, CARD_COUNT_PER_STEP));

    if (this.#listCards.length > CARD_COUNT_PER_STEP) {
      this.#renderLoadMoreButton();
    }
  };

  #renderTops = () => {
    render(this.#topFilmsListContainer, this.#mainComponent.element);
    render(this.#mostCommsListContainer, this.#mainComponent.element);

    for (let i = 0; i < Math.min(this.#listCards.length, TOP_FILMS_COUNT); i++) {
      render(new FilmCardView(this.#listCards[i]), this.#topFilmsListContainer.container);
    }
    for (let i = 0; i < Math.min(this.#listCards.length, TOP_FILMS_COUNT); i++) {
      render(new FilmCardView(this.#listCards[i]), this.#mostCommsListContainer.container);
    }
  };

  #renderCard = (card, place) => {
    const cardPresenter = new CardPresenter(this.#filmsSectionList, this.#cards, this.#handleCardChange, this.#handleModeChange);
    cardPresenter.init(card, place);
    this.#cardPresenter.set(card.id, cardPresenter);
  };

  #clearCardList = () => {
    this.#cardPresenter.forEach((presenter) => presenter.destroy());
    this.#cardPresenter.clear();
    this.#renderCardCount = CARD_COUNT_PER_STEP;
    remove(this.#topFilmsListContainer);
    remove(this.#mostCommsListContainer);
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
