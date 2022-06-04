import FilmsSectionView from '../view/films-section-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import FilmCardView from '../view/film-card-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import { Titles, SortType, UpdateType, FilterType } from '../consts.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import CardPresenter from './card-presenter.js';
import NoResultsView from '../view/no-results-view.js';
import SortView from '../view/sorts-view.js';
import CardsModel from '../model/cards-model.js';
import { sortDateDown, sortRatingDown, filters } from '../utils.js';


const CARD_COUNT_PER_STEP = 5;
const TOP_FILMS_COUNT = 2;

export default class ContentPresenter {
  #mainContainer = null;
  #cardsModel = null;
  #movies = [];
  #noResultsComponent = null;

  #mainComponent = new FilmsSectionView();
  #sortComponent = null;
  #filmsSectionList = new FilmsContainerView(Titles.COM);
  #topFilmsListContainer = new FilmsContainerView(Titles.TOP, 'films-list--extra');
  #mostCommsListContainer = new FilmsContainerView(Titles.MOST, 'films-list--extra');
  #showMoreBtnComponent = new ShowMoreButtonView();
  #cards = new CardsModel();

  #listCards = [];
  #renderCardCount = CARD_COUNT_PER_STEP;
  #cardPresenter = new Map();
  #sourceCards = [];
  #currentSortType = SortType.DEFAULT;
  #filterModel = null;
  #filterType = FilterType.ALL;

  constructor(mainContainer, cardsModel, filterModel) {
    this.#mainContainer = mainContainer;
    this.#cardsModel = cardsModel;
    this.#movies = cardsModel.cards;
    this.#sourceCards = [...this.#cardsModel.cards];
    this.#cardsModel.founded = false;
    this.#filterModel = filterModel;
    this.#cardsModel.addObserver(this.#handleMovieEvent);
    this.#filterModel.addObserver(this.#handleMovieEvent);
  }

  get cards() {
    this.#filterType = this.#filterModel.filter;
    const cards = this.#cardsModel.cards;
    const filteredCards = filters[this.#filterType](cards);

    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredCards.sort(sortDateDown);
      case SortType.RATING:
        return filteredCards.sort(sortRatingDown);
    }

    return filteredCards;
  }

  init = () => {
    this.#renderBoard();
  };

  #renderCards = (cards) => {
    cards.forEach((card) => this.#renderCard(card));
  };

  #renderNoResults = () => {
    render(this.#mainComponent, this.#mainContainer);
    this.#noResultsComponent = new NoResultsView(this.#filterType);
    render(this.#noResultsComponent, this.#mainComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderLoadMoreButton = () => {
    render(this.#showMoreBtnComponent, this.#mainComponent.element);
    this.#showMoreBtnComponent.setClickHandler(this.#handleShowMoreBtnClick);
  };

  #handleShowMoreBtnClick = () => {
    const cardsCount = this.cards.length;
    const newRernderedCardCount = Math.min(cardsCount, (this.#renderCardCount + CARD_COUNT_PER_STEP));
    const cards = this.cards.slice(this.#renderCardCount, newRernderedCardCount);

    this.#renderCards(cards);
    this.#renderCardCount = newRernderedCardCount;

    if (this.#renderCardCount >= cardsCount) {
      remove(this.#showMoreBtnComponent);
    }
  };

  #handleViewAction = (updateType, update) => {
    if (update.deletedCommentId) { this.#cardsModel.deleteComment(updateType, update); }
    if (update.newComment) { this.#cardsModel.addComment(updateType, update); }
    this.#cardsModel.updateCard(updateType, update);
  };

  #handleModeChange = () => {
    this.#cardPresenter.forEach((presenter) => presenter.resetView());
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortComponent, this.#mainComponent.element, RenderPosition.AFTERBEGIN);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearCardList({ resetRenderedCardsCount: true });
    this.#renderBoard();
  };

  #renderCardList = () => {
    const cardCount = this.cards.length;
    const cards = this.cards.slice(0, Math.min(cardCount, CARD_COUNT_PER_STEP));

    render(this.#mainComponent, this.#mainContainer);
    render(this.#filmsSectionList, this.#mainComponent.element);
    this.#renderCards(cards);

    if (cardCount > CARD_COUNT_PER_STEP) {
      this.#renderLoadMoreButton();
    }
  };

  #renderTops = () => {
    render(this.#topFilmsListContainer, this.#mainComponent.element);
    render(this.#mostCommsListContainer, this.#mainComponent.element);

    for (let i = 0; i < Math.min(this.cards.length, TOP_FILMS_COUNT); i++) {
      render(new FilmCardView(this.cards[i]), this.#topFilmsListContainer.container);
    }
    for (let i = 0; i < Math.min(this.cards.length, TOP_FILMS_COUNT); i++) {
      render(new FilmCardView(this.cards[i]), this.#mostCommsListContainer.container);
    }
  };

  #renderCard = (card, place) => {
    const cardPresenter = new CardPresenter(this.#filmsSectionList, this.#cards, this.#handleViewAction, this.#handleModeChange, this.#filterModel);
    cardPresenter.init(card, place);
    this.#cardPresenter.set(card.id, cardPresenter);
  };

  #clearCardList = ({ resetRenderedCardsCount = false, resetSortType = false } = {}) => {

    const cardsCount = this.cards.length;

    this.#cardPresenter.forEach((presenter) => presenter.destroy());
    this.#cardPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#showMoreBtnComponent);
    remove(this.#topFilmsListContainer);
    remove(this.#mostCommsListContainer);

    if (this.#noResultsComponent) {
      remove(this.#noResultsComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }

    if (resetRenderedCardsCount) {
      this.#renderCardCount = CARD_COUNT_PER_STEP;
    } else {
      this.#renderCardCount = Math.min(cardsCount, this.#renderCardCount);
    }
  };

  #renderBoard = () => {
    render(this.#mainComponent, this.#mainContainer);

    if (!this.cards.length) {
      this.#renderNoResults();
      return;
    }
    this.#renderSort();
    this.#renderCardList();
    this.#renderTops();
  };

  #handleMovieEvent = (updateType, update) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#cardPresenter.get(update.id).init(update);
        break;
      case UpdateType.MINOR:
        this.#clearCardList();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearCardList({ resetRenderedCardsCount: true, resetSortType: true });
        this.#renderBoard();
        break;
    }
  };
}
