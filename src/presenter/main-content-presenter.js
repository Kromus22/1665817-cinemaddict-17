import FilmsSectionView from '../view/films-section-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import FilmCardView from '../view/film-card-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import { Titles } from '../utils.js';
import { render } from '../render.js';
import PopupView from '../view/popup-view.js';

const siteBodyElement = document.querySelector('body');

export default class ContentPresenter {
  #mainContainer = null;
  #cardsModel = null;

  #mainComponent = new FilmsSectionView();
  #filmsSectionList = new FilmsContainerView(Titles.com);
  #topFilmsListContainer = new FilmsContainerView(Titles.top, 'films-list--extra');
  #mostCommsListContainer = new FilmsContainerView(Titles.most, 'films-list--extra');

  #listCards = [];
  #listComments = [];


  init = (mainContainer, cardsModel) => {
    this.#mainContainer = mainContainer;
    this.#cardsModel = cardsModel;
    this.#listCards = [...this.#cardsModel.cards];
    this.#listComments = [...this.#cardsModel.comments];

    render(this.#mainComponent, this.#mainContainer);
    render(this.#filmsSectionList, this.#mainComponent.element);

    render(new ShowMoreButtonView(), this.#filmsSectionList.element);

    render(this.#topFilmsListContainer, this.#mainComponent.element);
    render(this.#mostCommsListContainer, this.#mainComponent.element);
    const filmsDivElement = document.querySelectorAll('.films-list__container');
    for (let i = 0; i < this.#listCards.length; i++) {
      this.#renderCards(this.#listCards[i], filmsDivElement[0]);
    }
    render(new FilmCardView(this.#listCards[0]), filmsDivElement[1]);
    render(new FilmCardView(this.#listCards[0]), filmsDivElement[2]);

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
