import { render, replace, remove, RenderPosition } from '../framework/render.js';
import PopupView from '../view/popup-view.js';
import FilmCardView from '../view/film-card-view.js';
import { UpdateType } from '../consts.js';
import { Error } from '../services/api-service.js';

const siteBodyElement = document.querySelector('body');

export default class CardPresenter {
  #filmsSectionList = null;
  #changeData = null;
  #cardComponent = null;
  #popupComponent = null;
  #cardsModel = null;
  #commentsModel = null;
  #filterModel = null;
  #popupCard = null;

  constructor(container, cardsModel, changeData, filterModel, commentsModel) {
    this.#filmsSectionList = container;
    this.#cardsModel = cardsModel;
    this.#changeData = changeData;
    this.#filterModel = filterModel;
    this.#commentsModel = commentsModel;
  }

  init = (card) => {
    const prevCardComponent = this.#cardComponent;
    this.#cardComponent = new FilmCardView(card);

    this.#cardComponent.setClickHandler(this.#cardClickHandler);
    this.#cardComponent.setWatchlistClickHandler(this.#watchListClickHandler);
    this.#cardComponent.setAlreadyWatchedClickHandler(this.#alreadyWatchedClickHandler);
    this.#cardComponent.setFavoriteClickHandler(this.#favoriteClickHandler);

    if (prevCardComponent === null) {
      render(this.#cardComponent, this.#filmsSectionList);
    } else {
      if (this.#filmsSectionList.contains(prevCardComponent.element)) {
        replace(this.#cardComponent, prevCardComponent);
        remove(prevCardComponent);
      }
    }

    this.#popupCard = card;

    if (document.querySelector('.film-details') && this.#cardsModel.popupRerender) {
      this.#cardsModel.popupCard = this.#cardsModel.cards.find((item) => item.id === this.#cardsModel.popupId);
      this.#cardClickHandler(this.#cardsModel.popupCard);
      this.#popupComponent.setNewStateComments(this.#commentsModel.prevComm);
      this.#popupComponent.element.scrollTop = this.#cardsModel.popupScrollPosition;
      this.#cardsModel.popupRerender = false;
      this.#cardsModel.key = true;
    }
  };

  destroy = () => {
    remove(this.#cardComponent);
    document.removeEventListener('keydown', this.#popupEscPressHandler);
  };

  #cardClickHandler = async (card) => {
    if (document.querySelector('.film-details')) {
      if (!this.#cardsModel.popupRerender) { await this.#commentsModel.init(this.#cardComponent.card); }
      this.#closeClickHandler();
    } else {
      await this.#commentsModel.init(this.#cardComponent.card);
    }
    this.#renderPopup(card);
  };

  #watchListClickHandler = (scroll) => {
    this.#changeData(this.#filterModel.filter === 'all' ? UpdateType.PATCH : UpdateType.MAJOR,
      document.querySelector('.film-details') && this.#cardsModel.key ?
        { ...this.#cardsModel.popupCard, userDetails: { ...this.#cardsModel.popupCard.userDetails, watchlist: !this.#cardsModel.popupCard.userDetails.watchlist }, scrollTop: scroll } :
        { ...this.#popupCard, userDetails: { ...this.#popupCard.userDetails, watchlist: !this.#popupCard.userDetails.watchlist }, scrollTop: scroll });
    if (this.#popupComponent) {
      this.#commentsModel.prevComm = this.#popupComponent.getStateComments();
    }
  };

  #alreadyWatchedClickHandler = (scroll) => {
    this.#changeData(this.#filterModel.filter === 'all' ? UpdateType.PATCH : UpdateType.MAJOR,
      document.querySelector('.film-details') && this.#cardsModel.key ?
        { ...this.#cardsModel.popupCard, userDetails: { ...this.#cardsModel.popupCard.userDetails, alreadyWatched: !this.#cardsModel.popupCard.userDetails.alreadyWatched }, scrollTop: scroll } :
        { ...this.#popupCard, userDetails: { ...this.#popupCard.userDetails, alreadyWatched: !this.#popupCard.userDetails.alreadyWatched }, scrollTop: scroll });
    if (this.#popupComponent) {
      this.#commentsModel.prevComm = this.#popupComponent.getStateComments();
    }
  };

  #favoriteClickHandler = (scroll) => {
    this.#changeData(this.#filterModel.filter === 'all' ? UpdateType.PATCH : UpdateType.MAJOR,
      document.querySelector('.film-details') && this.#cardsModel.key ?
        { ...this.#cardsModel.popupCard, userDetails: { ...this.#cardsModel.popupCard.userDetails, favorite: !this.#cardsModel.popupCard.userDetails.favorite }, scrollTop: scroll } :
        { ...this.#popupCard, userDetails: { ...this.#popupCard.userDetails, favorite: !this.#popupCard.userDetails.favorite }, scrollTop: scroll });
    if (this.#popupComponent) {
      this.#commentsModel.prevComm = this.#popupComponent.getStateComments();
    }
  };

  #commentDeleteClickHandler = (deletedCommentId) => {
    this.#changeData(UpdateType.MAJOR,
      document.querySelector('.film-details') && this.#cardsModel.key ?
        { ...this.#cardsModel.popupCard, comments: [...this.#cardsModel.popupCard.comments.filter((item) => item !== deletedCommentId)], deletedCommentId: deletedCommentId, newComment: '' } :
        { ...this.#popupCard, comments: [...this.#popupCard.comments.filter((item) => item !== deletedCommentId)], deletedCommentId: deletedCommentId, newComment: '' });
    if (this.#popupComponent) {
      this.#commentsModel.prevComm = this.#popupComponent.getStateComments();
    }
  };

  #commentFormSubmitHandler = (newComment) => {
    this.#changeData(UpdateType.MAJOR,
      document.querySelector('.film-details') && this.#cardsModel.key ?
        { ...this.#cardsModel.popupCard, newComment: newComment, deletedCommentId: '' } :
        { ...this.#popupCard, newComment: newComment, deletedCommentId: '' });
    this.#commentsModel.prevComm = '';
  };

  #renderPopup = (card = this.#cardComponent.card) => {
    this.#popupComponent = new PopupView(card, this.#commentsModel.comments);
    this.#cardsModel.popupId = this.#popupComponent.element.dataset.filmId;
    this.#popupComponent.setCloseClickHandler(this.#closeClickHandler);
    this.#popupComponent.setWatchlistClickHandler(this.#watchListClickHandler);
    this.#popupComponent.setAlreadyWatchedClickHandler(this.#alreadyWatchedClickHandler);
    this.#popupComponent.setFavoriteClickHandler(this.#favoriteClickHandler);
    this.#popupComponent.setCommentDeleteClickHandler(this.#commentDeleteClickHandler);
    this.#popupComponent.setformSubmitHandler(this.#commentFormSubmitHandler);
    document.addEventListener('keydown', this.#popupEscPressHandler);
    siteBodyElement.classList.toggle('hide-overflow');
    render(this.#popupComponent, siteBodyElement, RenderPosition.AFTEREND);
    this.#popupComponent.element.scrollTop = this.#cardsModel.popupScrollPosition;
    Object.keys(Error).forEach((key) => { Error[key] = false; });
  };

  #closeClickHandler = () => {
    this.#cardsModel.key = false;
    if (document.querySelector('.film-details')) {
      document.querySelector('.film-details').remove();
    }
    siteBodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#popupEscPressHandler);
  };

  #popupEscPressHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#closeClickHandler();
    }
  };
}

