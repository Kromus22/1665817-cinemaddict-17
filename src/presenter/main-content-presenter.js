import FilmsSectionView from '../view/films-section-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import FilmCardView from '../view/film-card-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import { Titles, SortType, UpdateType } from '../consts.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import CardPresenter from './card-presenter.js';
import NoResultsView from '../view/no-results-view.js';
import SortView from '../view/sorts-view.js';
import CardsModel from '../model/cards-model.js';


const CARD_COUNT_PER_STEP = 5;
const TOP_FILMS_COUNT = 2;

export default class ContentPresenter {
  #mainContainer = null;
  #cardsModel = null;
  #movies = [];
  #noResultsComponent = null;

  #mainComponent = new FilmsSectionView();
  #sortComponent = new SortView();
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
  #filterModel = null;

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
    switch (this.#currentSortType) {
      case SortType.DATE:
        return [...this.#cardsModel.cards].sort((el, el2) => new Date(el.filmInfo.release.date).getTime() - new Date(el2.filmInfo.release.date).getTime());
      case SortType.RATING:
        return [...this.#cardsModel.cards].sort((el, el2) => +el.filmInfo.totalRating - +el2.filmInfo.totalRating);
    }

    return this.#cardsModel.cards;
  }

  init = () => {
    this.#renderBoard();
  };

  #renderCards = (cards) => {
    cards.forEach((card) => this.#renderCard(card));
  };

  #renderNoResults = (currentFilter) => {
    render(this.#mainComponent, this.#mainContainer);
    this.#noResultsComponent = new NoResultsView(currentFilter);
    render(this.#noResultsComponent, this.#mainComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderLoadMoreButton = () => {
    render(this.#showMoreBtnComponent, this.#mainComponent.element);
    this.#showMoreBtnComponent.setClickHandler(this.#handleShowMoreBtnClick);
  };

  #handleShowMoreBtnClick = () => {
    const cardsCount = this.cards.length;
    const newRernderedCardCount = Math.min(cardsCount, this.#renderCardCount + CARD_COUNT_PER_STEP);
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
    render(this.#sortComponent, this.#mainComponent.element, RenderPosition.AFTERBEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearCardList();
    this.#renderCardList();
    this.#renderTops();
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

  #clearCardList = ({ resetRenderedCardsCount = false, resetSortType = false, renderTop = false } = {}) => {
    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
    if (this.cards.length === 0) {
      remove(this.#noResultsComponent);
      remove(this.#sortComponent);
      this.#renderNoResults(this.#filterModel.filter);
    } else {
      remove(this.#noResultsComponent);
      this.#renderSort();
    }

    const cardsCount = this.cards.length;

    if (renderTop) {
      remove(this.#topFilmsListContainer);
      remove(this.#mostCommsListContainer);
    }

    this.#cardPresenter.forEach((presenter) => presenter.destroy());
    this.#cardPresenter.clear();

    remove(this.#showMoreBtnComponent);

    if (resetRenderedCardsCount) {
      this.#renderCardCount = CARD_COUNT_PER_STEP;
    } else {
      this.#renderCardCount = cardsCount;
    }
  };

  #renderBoard = () => {
    render(this.#mainComponent, this.#mainContainer);

    if (!this.cards.length) {
      this.#renderNoResults();
    }
    this.#renderSort();
    this.#renderCardList();
    this.#renderTops();
  };

  #handleMovieEvent = (updateType, update) => {
    switch (updateType) {
      case UpdateType.PATCH:
        if (this.#cardPresenter.get(update.id)) {
          this.#cardPresenter.get(update.id).init(update);
        }
        break;
      case UpdateType.MINOR:
        this.#clearCardList({ resetRenderedCardsCount: true });
        this.#renderCardList();
        break;
      case UpdateType.MAJOR:
        this.#clearCardList({ resetRenderedCardsCount: false, resetSortType: true, renderTop: true });
        this.#renderCardList();
        this.#renderTops();
        break;
    }
  };
}
