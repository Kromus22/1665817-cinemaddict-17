import { render, replace, remove, RenderPosition } from '../framework/render.js';
import PopupView from '../view/popup-view.js';
import FilmCardView from '../view/film-card-view.js';
import { UpdateType } from '../consts.js';
import { Error } from '../services/api-service.js';

const siteBodyElement = document.querySelector('body');
// const Mode = {
//   OPEN: 'OPEN',
//   CLOSE: 'CLOSE',
// };

export default class CardPresenter {
  #filmsSectionList = null;
  #changeData = null;
  #cardComponent = null;
  #popupComponent = null;
  #cardsModel = null;
  #commentsModel = null;
  #filterModel = null;
  #popupCard = null;
  // #changeMode = null;
  // #mode = Mode.CLOSE;


  constructor(container, cardsModel, changeData, filterModel, commentsModel, changeMode) {
    this.#filmsSectionList = container;
    this.#cardsModel = cardsModel;
    this.#changeData = changeData;
    this.#filterModel = filterModel;
    this.#commentsModel = commentsModel;
    // this.#changeMode = changeMode;
  }

  init = (card) => {
    const prevCardComponent = this.#cardComponent;
    //const prevPopupComponent = this.#popupComponent;
    this.#cardComponent = new FilmCardView(card);

    this.#cardComponent.setClickHandler(this.#onCardClick);
    this.#cardComponent.setWatchlistClickHandler(this.#onWatchListClick);
    this.#cardComponent.setAlreadyWatchedClickHandler(this.#onAlreadyWatchedClick);
    this.#cardComponent.setFavoriteClickHandler(this.#onFavoriteClick);

    if (prevCardComponent === null) {
      render(this.#cardComponent, this.#filmsSectionList);
    } else {
      if (this.#filmsSectionList.contains(prevCardComponent.element)) {
        replace(this.#cardComponent, prevCardComponent);
        remove(prevCardComponent);
      }
    }

    // if (this.#mode === Mode.OPEN) {
    //   if (!prevPopupComponent) { this.#createPopup(card); }
    // }

    // remove(prevPopupComponent);

    this.#popupCard = card;

    if (document.querySelector('.film-details') && this.#cardsModel.popupRerender) {
      this.#cardsModel.popupCard = this.#cardsModel.cards.find((item) => item.id === this.#cardsModel.popupId);
      this.#onCardClick(this.#cardsModel.popupCard);
      this.#popupComponent.setNewStateComments(this.#commentsModel.prevComm);
      this.#popupComponent.element.scrollTop = this.#cardsModel.popupScrollPosition;
      this.#cardsModel.popupRerender = false;
      this.#cardsModel.key = true;
    }
  };

  destroy = () => {
    remove(this.#cardComponent);
    document.removeEventListener('keydown', this.#onEscKeyDown);
  };

  // resetView = () => {
  //   if (this.#mode !== Mode.CLOSE) {
  //     this.#closePopup();
  //   }
  // };

  #onCardClick = async (card) => {
    if (document.querySelector('.film-details')) {
      if (!this.#cardsModel.popupRerender) { await this.#commentsModel.init(this.#cardComponent.card); }
      this.#closePopup();
    } else {
      await this.#commentsModel.init(this.#cardComponent.card);
    }
    this.#createPopup(card);
  };

  #onWatchListClick = (scroll) => {
    this.#changeData(this.#filterModel.filter === 'all' ? UpdateType.PATCH : UpdateType.MAJOR,
      document.querySelector('.film-details') && this.#cardsModel.key ?
        { ...this.#cardsModel.popupCard, userDetails: { ...this.#cardsModel.popupCard.userDetails, watchlist: !this.#cardsModel.popupCard.userDetails.watchlist }, scrollTop: scroll } :
        { ...this.#popupCard, userDetails: { ...this.#popupCard.userDetails, watchlist: !this.#popupCard.userDetails.watchlist }, scrollTop: scroll });
    if (this.#popupComponent) {
      this.#commentsModel.prevComm = this.#popupComponent.getStateComments();
    }
  };

  #onAlreadyWatchedClick = (scroll) => {
    this.#changeData(this.#filterModel.filter === 'all' ? UpdateType.PATCH : UpdateType.MAJOR,
      document.querySelector('.film-details') && this.#cardsModel.key ?
        { ...this.#cardsModel.popupCard, userDetails: { ...this.#cardsModel.popupCard.userDetails, alreadyWatched: !this.#cardsModel.popupCard.userDetails.alreadyWatched }, scrollTop: scroll } :
        { ...this.#popupCard, userDetails: { ...this.#popupCard.userDetails, alreadyWatched: !this.#popupCard.userDetails.alreadyWatched }, scrollTop: scroll });
    if (this.#popupComponent) {
      this.#commentsModel.prevComm = this.#popupComponent.getStateComments();
    }
  };

  #onFavoriteClick = (scroll) => {
    this.#changeData(this.#filterModel.filter === 'all' ? UpdateType.PATCH : UpdateType.MAJOR,
      document.querySelector('.film-details') && this.#cardsModel.key ?
        { ...this.#cardsModel.popupCard, userDetails: { ...this.#cardsModel.popupCard.userDetails, favorite: !this.#cardsModel.popupCard.userDetails.favorite }, scrollTop: scroll } :
        { ...this.#popupCard, userDetails: { ...this.#popupCard.userDetails, favorite: !this.#popupCard.userDetails.favorite }, scrollTop: scroll });
    if (this.#popupComponent) {
      this.#commentsModel.prevComm = this.#popupComponent.getStateComments();
    }
  };

  #onCommentDeleteClick = (deletedCommentId) => {
    this.#changeData(UpdateType.MAJOR,
      document.querySelector('.film-details') && this.#cardsModel.key ?
        { ...this.#cardsModel.popupCard, comments: [...this.#cardsModel.popupCard.comments.filter((item) => item !== deletedCommentId)], deletedCommentId: deletedCommentId, newComment: '' } :
        { ...this.#popupCard, comments: [...this.#popupCard.comments.filter((item) => item !== deletedCommentId)], deletedCommentId: deletedCommentId, newComment: '' });
    if (this.#popupComponent) {
      this.#commentsModel.prevComm = this.#popupComponent.getStateComments();
    }
  };

  #onCommentFormSubmit = (newComment) => {
    this.#changeData(UpdateType.MAJOR,
      document.querySelector('.film-details') && this.#cardsModel.key ?
        { ...this.#cardsModel.popupCard, newComment: newComment, deletedCommentId: '' } :
        { ...this.#popupCard, newComment: newComment, deletedCommentId: '' });
    this.#commentsModel.prevComm = '';
  };

  #createPopup = (card = this.#cardComponent.card) => {
    //this.#changeMode();
    this.#popupComponent = new PopupView(card, this.#commentsModel.comments);
    this.#cardsModel.popupId = this.#popupComponent.element.dataset.filmId;
    this.#popupComponent.setCloseClickHandler(this.#closePopup);
    this.#popupComponent.setWatchlistClickHandler(this.#onWatchListClick);
    this.#popupComponent.setAlreadyWatchedClickHandler(this.#onAlreadyWatchedClick);
    this.#popupComponent.setFavoriteClickHandler(this.#onFavoriteClick);
    this.#popupComponent.setCommentDeleteClickHandler(this.#onCommentDeleteClick);
    this.#popupComponent.setformSubmitHandler(this.#onCommentFormSubmit);
    document.addEventListener('keydown', this.#onEscKeyDown);
    siteBodyElement.classList.toggle('hide-overflow');
    render(this.#popupComponent, siteBodyElement, RenderPosition.AFTEREND);
    this.#popupComponent.element.scrollTop = this.#cardsModel.popupScrollPosition;
    Object.keys(Error).forEach((key) => { Error[key] = false; });
    //this.#mode = Mode.OPEN;
  };

  #closePopup = () => {
    this.#cardsModel.key = false;
    document.querySelector('.film-details').remove();
    siteBodyElement.classList.toggle('hide-overflow');
    document.removeEventListener('keydown', this.#onEscKeyDown);
    //this.#mode = Mode.CLOSE;
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#closePopup();
    }
  };
}

