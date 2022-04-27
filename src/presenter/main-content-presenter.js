import FilmsSectionView from '../view/films-section-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import FilmCardView from '../view/film-card-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';

import { render } from '../render.js';

const CARD_COUNT = 5;


export default class ContentPresenter {
  mainComponent = new FilmsSectionView();
  filmsSectionList = new FilmsContainerView(1);
  topFilmsListContainer = new FilmsContainerView(2, 'films-list--extra');
  mostCommsListContainer = new FilmsContainerView(3, 'films-list--extra');


  init = (mainContainer) => {
    this.mainContainer = mainContainer;

    render(this.mainComponent, this.mainContainer);
    render(this.filmsSectionList, this.mainComponent.getElement());
    for (let i = 0; i < CARD_COUNT; i++) {
      render(new FilmCardView(), this.filmsSectionList.getElement());
    }

    render(new ShowMoreButtonView(), this.filmsSectionList.getElement());

    render(this.topFilmsListContainer, this.mainComponent.getElement());
    render(new FilmCardView(), this.topFilmsListContainer.getElement());
    render(this.mostCommsListContainer, this.mainComponent.getElement());
    render(new FilmCardView(), this.mostCommsListContainer.getElement());
  };
}
