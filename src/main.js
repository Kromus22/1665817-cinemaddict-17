import { render } from './render.js';
import MenuView from './view/menu-view.js';
import ProfileView from './view/profile-view.js';
import SortsView from './view/sorts-view.js';
import ContentPresenter from './presenter/main-content-presenter.js';
import FooterStats from './view/footer-stats-view.js';

import CardsModel from './model/cards-model.js';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');


const contentPresenter = new ContentPresenter;
const cardsModel = new CardsModel();

render(new ProfileView(), siteHeaderElement);
render(new MenuView(), siteMainElement);
render(new SortsView(), siteMainElement);

contentPresenter.init(siteMainElement, cardsModel);

render(new FooterStats(), siteFooterElement);


