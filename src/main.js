import { render, RenderPosition } from './render.js';
import MenuView from './view/menu-view.js';
import ProfileView from './view/profile-view.js';
import SortsView from './view/sorts-view.js';
import ContentPresenter from './presenter/main-content-presenter.js';
import FooterStats from './view/footer-stats-view.js';
import PopupView from './view/popup-view.js';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const contentPresenter = new ContentPresenter;
const siteFooterElement = document.querySelector('.footer');
const siteBodyElement = document.querySelector('body');

render(new ProfileView(), siteHeaderElement);
render(new MenuView(), siteMainElement);
render(new SortsView(), siteMainElement);

contentPresenter.init(siteMainElement);

render(new FooterStats(), siteFooterElement);
//render(new PopupView(), siteBodyElement, RenderPosition.BEFOREEND);

