import { render } from './render.js';
import MenuView from './view/menu-view.js';
import ProfileView from './view/profile-view.js';
import ContentPresenter from './presenter/main-content-presenter.js';
import FooterStats from './view/footer-stats-view.js';

import CardsModel from './model/cards-model.js';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');


const cardsModel = new CardsModel();
const contentPresenter = new ContentPresenter(siteMainElement, cardsModel);

render(new ProfileView(), siteHeaderElement);
render(new MenuView(), siteMainElement);


contentPresenter.init();

render(new FooterStats(), siteFooterElement);


