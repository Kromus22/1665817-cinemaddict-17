import { render } from './framework/render.js';
import ProfileView from './view/profile-view.js';
import ContentPresenter from './presenter/main-content-presenter.js';
import FooterStats from './view/footer-stats-view.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/menu-presenter.js';

import CardsModel from './model/cards-model.js';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');


const cardsModel = new CardsModel();
const filterModel = new FilterModel();
const contentPresenter = new ContentPresenter(siteMainElement, cardsModel, filterModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, cardsModel);

render(new ProfileView(), siteHeaderElement);


contentPresenter.init();
filterPresenter.init();

render(new FooterStats(), siteFooterElement);


