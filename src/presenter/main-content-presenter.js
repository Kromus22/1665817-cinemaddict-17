import FilmsSectionView from '../view/films-section-view.js';
import RandomFilmsSectionView from '../view/random-films-view.js';
import FilmsSectionTitleView from '../view/films-section-title-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import FilmCardView from '../view/film-card-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import TopFilmsSectionView from '../view/top-films-section-view.js';
import TopFilmsTitleView from '../view/top-films-title-view.js';
import MostCommsFilmsTitleView from '../view/most-comms-films-title-view.js';
import { render } from '../render.js';

const CARD_COUNT = 5;


export default class ContentPresenter {
  mainComponent = new FilmsSectionView();
  filmsSectionList = new RandomFilmsSectionView();
  cardListContainer = new FilmsContainerView();
  topFilmsListContainer = new TopFilmsSectionView();

  init = (mainContainer) => {
    this.mainContainer = mainContainer;

    render(this.mainComponent, this.mainContainer);
    render(this.filmsSectionList, this.mainComponent.getElement());
    render(new FilmsSectionTitleView(), this.filmsSectionList.getElement());
    render(new FilmsContainerView(), this.filmsSectionList.getElement());

    for (let i = 0; i < CARD_COUNT; i++) {
      render(new FilmCardView(), this.cardListContainer.getElement());
    }

    render(new ShowMoreButtonView(), this.filmsSectionList.getElement());
    render(this.topFilmsListContainer, this.mainComponent.getElement());
    render(new TopFilmsTitleView(), this.topFilmsListContainer.getElement());
    render(new FilmCardView(), this.topFilmsListContainer.getElement());
    render(this.topFilmsListContainer, this.mainComponent.getElement());
    render(new MostCommsFilmsTitleView(), this.topFilmsListContainer.getElement());
    render(new FilmCardView(), this.topFilmsListContainer.getElement());
  };
}
