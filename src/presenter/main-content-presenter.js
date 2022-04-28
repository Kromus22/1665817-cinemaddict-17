import FilmsSectionView from '../view/films-section-view.js';
import { FilmsContainerView, SectionType } from '../view/films-container-view.js';
import FilmCardView from '../view/film-card-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';

import { render } from '../render.js';

const CARD_COUNT = 5;


export default class ContentPresenter {
  mainComponent = new FilmsSectionView();
  filmsSectionList = new FilmsContainerView(SectionType.common);
  topFilmsListContainer = new FilmsContainerView(SectionType.topRated, 'films-list--extra');
  mostCommsListContainer = new FilmsContainerView(SectionType.mostComm, 'films-list--extra');


  init = (mainContainer) => {
    this.mainContainer = mainContainer;

    render(this.mainComponent, this.mainContainer);
    render(this.filmsSectionList, this.mainComponent.getElement());

    render(new ShowMoreButtonView(), this.filmsSectionList.getElement());

    render(this.topFilmsListContainer, this.mainComponent.getElement());
    render(this.mostCommsListContainer, this.mainComponent.getElement());
    const filmsDivElement = document.querySelectorAll('.films-list__container');
    for (let i = 0; i < CARD_COUNT; i++) {
      render(new FilmCardView(), filmsDivElement[0]);
    }
    render(new FilmCardView(), filmsDivElement[1]);
    render(new FilmCardView(), filmsDivElement[2]);
  };
}
