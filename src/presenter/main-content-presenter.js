import FilmsSectionView from '../view/films-section-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import { Titles, SortType, UpdateType, FilterType } from '../consts.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import CardPresenter from './card-presenter.js';
import NoResultsView from '../view/no-results-view.js';
import SortView from '../view/sorts-view.js';
import CardsModel from '../model/cards-model.js';
import { sortDateDown, sortRatingDown, filters } from '../utils.js';
import LoadingView from '../view/loading-view.js';
import FooterStats from '../view/footer-stats-view.js';
import { Error } from '../services/api-service.js';


const CARD_COUNT_PER_STEP = 5;
const TOP_FILMS_COUNT = 2;
const siteFooterElement = document.querySelector('.footer__statistics');

export default class ContentPresenter {
  #mainContainer = null;
  #cardsModel = null;
  #noResultsComponent = null;
  #commentsModel = null;

  #mainComponent = new FilmsSectionView();
  #sortComponent = null;
  #filmsSectionList = new FilmsContainerView(Titles.COM);
  #topFilmsListContainer = new FilmsContainerView(Titles.TOP, 'films-list--extra', 'films-list--rated');
  #mostCommsListContainer = new FilmsContainerView(Titles.MOST, 'films-list--extra', 'films-list--commented');
  #showMoreBtnComponent = new ShowMoreButtonView();
  #loadingComponent = new LoadingView();
  #cards = new CardsModel();

  #renderCardCount = CARD_COUNT_PER_STEP;
  #cardPresenter = new Map();
  #topRatedPresenter = new Map();
  #topCommPresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  #filterModel = null;
  #filterType = FilterType.ALL;
  #isLoading = true;

  constructor(mainContainer, cardsModel, filterModel, commentsModel) {
    this.#mainContainer = mainContainer;
    this.#cardsModel = cardsModel;
    this.#cardsModel.founded = false;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;
    this.#cardsModel.addObserver(this.#handleMovieEvent);
    this.#filterModel.addObserver(this.#handleMovieEvent);
    this.#commentsModel.addObserver(this.#handleMovieEvent);
  }

  get cards() {
    this.#filterType = this.#filterModel.filter;
    const cards = this.#cardsModel.cards;
    const filteredCards = filters[this.#filterType](cards);

    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredCards.slice().sort(sortDateDown);
      case SortType.RATING:
        return filteredCards.slice().sort(sortRatingDown);
    }

    return [...filteredCards];
  }

  init = () => {
    this.#renderBoard();
  };


  #renderNoResults = () => {
    render(this.#mainComponent, this.#mainContainer);
    this.#noResultsComponent = new NoResultsView(this.#filterType);
    render(this.#noResultsComponent, this.#filmsSectionList.element, RenderPosition.AFTERBEGIN);
  };

  #renderLoadMoreButton = () => {
    render(this.#showMoreBtnComponent, this.#filmsSectionList.element);
    this.#showMoreBtnComponent.setClickHandler(this.#handleShowMoreBtnClick);
  };

  #handleShowMoreBtnClick = () => {
    this.cards.slice(this.#renderCardCount, this.#renderCardCount + CARD_COUNT_PER_STEP)
      .forEach((card) => this.#renderCard(card, this.#filmsSectionList.container));

    this.#renderCardCount += CARD_COUNT_PER_STEP;

    if (this.#renderCardCount >= this.cards.length) {
      remove(this.#showMoreBtnComponent);
    }
  };

  #handleViewAction = async (updateType, update) => {
    this.#cardsModel.popupRerender = true;
    Object.keys(Error).forEach((key) => { Error[key] = false; });
    if (document.querySelector('.film-details')) {
      this.#cardsModel.popupScrollPosition = update.scrollTop;
    }
    if (update.deletedCommentId) { await this.#commentsModel.deleteComment(updateType, update); }
    if (update.newComment) { await this.#commentsModel.addComment(updateType, update); }
    this.#cardsModel.updateCard(updateType, update);
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortComponent, this.#mainContainer);
    this.isSorting = false;
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#handleMovieEvent(UpdateType.MINOR, this.isSorting = true);
  };

  #handleModeChange = () => {
    this.#cardPresenter.forEach((presenter) => presenter.resetView());
  };

  #renderCardList = () => {
    render(this.#mainComponent, this.#mainContainer);
    render(this.#filmsSectionList, this.#mainComponent.element, RenderPosition.AFTERBEGIN);
    for (let i = 0; i < Math.min(this.#cardsModel.cards.length, this.#renderCardCount); i++) {
      this.#renderCard(this.cards[i], this.#filmsSectionList.container);
    }
    if (this.cards.length > CARD_COUNT_PER_STEP) {
      this.#renderLoadMoreButton();
    }
  };

  #renderTops = () => {
    const ratedMovies = this.#cardsModel.cards.slice().sort(sortRatingDown);
    if (ratedMovies.length) {
      if (!document.querySelector('.films-list--rated')) {
        render(this.#topFilmsListContainer, this.#mainComponent.element);
      }
      for (let i = 0; i < Math.min(ratedMovies.length, TOP_FILMS_COUNT); i++) {
        this.#renderCard(ratedMovies[i], this.#topFilmsListContainer.container, 'rated');
      }
    } else {
      this.#topFilmsListContainer.element.remove();
    }

    const commentedMovies = this.#cardsModel.cards.slice().sort((a, b) =>
      b.comments.length - a.comments.length).filter((item) => item.comments.length !== 0);
    if (commentedMovies.length) {
      if (!document.querySelector('.films-list--commented')) {
        render(this.#mostCommsListContainer, this.#mainComponent.element);
      }
      for (let i = 0; i < Math.min(commentedMovies.length, TOP_FILMS_COUNT); i++) {
        this.#renderCard(commentedMovies[i], this.#mostCommsListContainer.container, 'commented');
      }
    } else {
      this.#mostCommsListContainer.element.remove();
    }
  };

  #renderSiteFooter = (component, container, position) => {
    render(component, container, position);
  };

  #renderCard = (card, place, extra) => {
    const cardPresenter = new CardPresenter(place, this.#cardsModel, this.#handleViewAction, this.#filterModel, this.#commentsModel, this.#handleModeChange);
    cardPresenter.init(card);
    switch (extra) {
      case 'rated':
        this.#topRatedPresenter.set(card.id, cardPresenter);
        break;
      case 'commented':
        this.#topCommPresenter.set(card.id, cardPresenter);
        break;
      default:
        this.#cardPresenter.set(card.id, cardPresenter);
    }
  };

  #clearCardList = ({ resetRenderedCardsCount = false, resetSortType = true, resetTops = false } = {}) => {

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }

    remove(this.#sortComponent);

    if (this.cards.length === 0) {
      remove(this.#noResultsComponent);
      this.#renderNoResults();
    } else {
      remove(this.#noResultsComponent);
      this.#renderSort();
    }

    if (resetTops) {
      this.#topRatedPresenter.forEach((presenter) => presenter.destroy());
      this.#topRatedPresenter.clear();
      this.#topCommPresenter.forEach((presenter) => presenter.destroy());
      this.#topCommPresenter.clear();
    }

    this.#cardPresenter.forEach((presenter) => presenter.destroy());
    this.#cardPresenter.clear();
    remove(this.#showMoreBtnComponent);

    if (resetRenderedCardsCount) {
      this.#renderCardCount = CARD_COUNT_PER_STEP;
    }
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#mainContainer);
  };

  #renderBoard = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    this.#renderSort(this.#sortComponent, this.#mainContainer);
    render(this.#mainComponent, this.#mainContainer);
    this.#renderSiteFooter(new FooterStats(this.cards.length), siteFooterElement);

    if (!this.cards.length) {
      remove(this.#sortComponent);
      this.#renderNoResults();
      return;
    }
    this.#renderCardList();
    this.#renderTops();
  };

  #handleMovieEvent = (updateType, update) => {
    switch (updateType) {
      case UpdateType.PATCH:
        if (this.#cardPresenter.get(update.id)) {
          this.#cardPresenter.get(update.id).init(update);
        }
        if (this.#topRatedPresenter.get(update.id)) {
          this.#topRatedPresenter.get(update.id).init(update);
        }
        if (this.#topCommPresenter.get(update.id)) {
          this.#topCommPresenter.get(update.id).init(update);
        }
        break;
      case UpdateType.MINOR:
        this.#clearCardList({ resetRenderedCardsCount: true, resetSortType: !this.isSorting });
        if (this.cards.length) {
          this.#renderCardList();
        }
        break;
      case UpdateType.MAJOR:
        this.#clearCardList({ resetRenderedCardsCount: false, resetSortType: !update, resetTops: true });
        this.#renderCardList();
        this.#renderTops();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  };
}
