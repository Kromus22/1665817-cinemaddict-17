import { render } from './framework/render.js';
import ProfileView from './view/profile-view.js';
import ContentPresenter from './presenter/main-content-presenter.js';
import FooterStats from './view/footer-stats-view.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/menu-presenter.js';
import CardsModel from './model/cards-model.js';
import CommsModel from './model/comments-model.js';
import MoviesApiService from './services/api-service.js';

const AUTHORIZATION = 'Basic jngf89gnei48gnw';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict';
const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');


const moviesApiService = new MoviesApiService(END_POINT, AUTHORIZATION);
const cardsModel = new CardsModel(moviesApiService);
const filterModel = new FilterModel();
const commentsModel = new CommsModel(moviesApiService);
const contentPresenter = new ContentPresenter(siteMainElement, cardsModel, filterModel, commentsModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, cardsModel);

render(new ProfileView(), siteHeaderElement);

filterPresenter.init();
contentPresenter.init();
cardsModel.init();

render(new FooterStats(cardsModel.cards.length), siteFooterElement);


