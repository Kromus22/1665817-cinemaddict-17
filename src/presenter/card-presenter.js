import { render, replace, remove } from '../framework/render.js';
import PopupView from '../view/popup-view.js';
import FilmCardView from '../view/film-card-view.js';
import { UpdateType } from '../consts.js';

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
    this.#cardComponent.setWatchlistHandler(this.#handleWatchlistClick);
    this.#cardComponent.setWatchedHandler(this.#handleWatchedClick);
    this.#cardComponent.setFavoriteHandler(this.#handleFavoriteClick);

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

  #createPopup = () => {
    this.#popupComponent = new PopupView(this.#card, this.#listComments);
    this.#popupComponent.setClosePopupButtonHandler(this.#closePopup);
    this.#popupComponent.setWatchlistHandler(this.#handleWatchlistClick);
    this.#popupComponent.setWatchedHandler(this.#handleWatchedClick);
    this.#popupComponent.setFavoriteHandler(this.#handleFavoriteClick);
    this.#popupComponent.setCommentDeleteClickHandler(this.#onCommentDeleteClick);
    this.#popupComponent.setformSubmitHandler(this.#onCommentFormSubmit);
  };

  #handleWatchlistClick = () => {
    this.#cardsModel.founded = true;
    this.#changeData(this.#filterModel.filter === 'all' ? UpdateType.PATCH : UpdateType.MAJOR, {
      ...this.#card,
      userDetails: {
        ...this.#card.userDetails,
        watchlist: !this.#card.userDetails.watchlist
      }
    });
  };

  #handleWatchedClick = () => {
    this.#cardsModel.founded = true;
    this.#changeData(this.#filterModel.filter === 'all' ? UpdateType.PATCH : UpdateType.MAJOR, {
      ...this.#card,
      userDetails: {
        ...this.#card.userDetails,
        alreadyWatched: !this.#card.userDetails.alreadyWatched
      }
    });
  };

  #handleFavoriteClick = () => {
    this.#cardsModel.founded = true;
    this.#changeData(this.#filterModel.filter === 'all' ? UpdateType.PATCH : UpdateType.MAJOR, {
      ...this.#card,
      userDetails: {
        ...this.#card.userDetails,
        favorite: !this.#card.userDetails.favorite
      }
    });
  };

  #onCommentDeleteClick = (deletedCommentId) => {
    this.#cardsModel.founded = true;
    this.#changeData(UpdateType.MINOR, {
      ...this.#card,
      comments: [...this.#card.comments.filter((item) => item !== +deletedCommentId)],
      deletedCommentId: deletedCommentId, newComment: ''
    });
  };

  #onCommentFormSubmit = (newComment) => {
    this.#cardsModel.founded = true;
    this.#changeData(UpdateType.MINOR, {
      ...this.#card,
      comments: [...this.#card.comments, +newComment.newComment.id],
      newComment: newComment.newComment, deletedCommentId: ''
    });
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

