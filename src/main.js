import ContentPresenter from './presenter/main-content-presenter.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/menu-presenter.js';
import CardsModel from './model/cards-model.js';
import CommsModel from './model/comments-model.js';
import MoviesApiService from './services/api-service.js';

const AUTHORIZATION = 'Basic mfwiomf394ff3mg';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict';
const siteMainElement = document.querySelector('.main');


const moviesApiService = new MoviesApiService(END_POINT, AUTHORIZATION);
const cardsModel = new CardsModel(moviesApiService);
const filterModel = new FilterModel();
const commentsModel = new CommsModel(moviesApiService);
const contentPresenter = new ContentPresenter(siteMainElement, cardsModel, filterModel, commentsModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, cardsModel);


filterPresenter.init();
contentPresenter.init();
cardsModel.init();


