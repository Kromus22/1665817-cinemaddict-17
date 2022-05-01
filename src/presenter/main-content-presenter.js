import FilmsSectionView from '../view/films-section-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import FilmCardView from '../view/film-card-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import { Titles } from '../utils.js';
import { render, RenderPosition } from '../render.js';
import PopupView from '../view/popup-view.js';


export default class ContentPresenter {
  mainComponent = new FilmsSectionView();
  filmsSectionList = new FilmsContainerView(Titles.com);
  topFilmsListContainer = new FilmsContainerView(Titles.top, 'films-list--extra');
  mostCommsListContainer = new FilmsContainerView(Titles.most, 'films-list--extra');


  init = (mainContainer, cardsModel) => {
    this.mainContainer = mainContainer;
    this.cardsModel = cardsModel;
    this.listCards = [...this.cardsModel.getCards()];
    this.listComments = [...this.cardsModel.getComments()];

    render(this.mainComponent, this.mainContainer);
    render(this.filmsSectionList, this.mainComponent.getElement());

    render(new ShowMoreButtonView(), this.filmsSectionList.getElement());

    render(this.topFilmsListContainer, this.mainComponent.getElement());
    render(this.mostCommsListContainer, this.mainComponent.getElement());
    const filmsDivElement = document.querySelectorAll('.films-list__container');
    for (let i = 0; i < this.listCards.length; i++) {
      render(new FilmCardView(this.listCards[i]), filmsDivElement[0]);
    }
    render(new FilmCardView(this.listCards[0]), filmsDivElement[1]);
    render(new FilmCardView(this.listCards[0]), filmsDivElement[2]);

    render(new PopupView(this.listCards[0]), this.mainContainer, RenderPosition.BEFOREEND);
  };
}
