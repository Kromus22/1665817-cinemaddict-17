import { render, RenderPosition } from './render.js';
import MenuView from './view/menu-view.js';
import ProfileView from './view/profile-view.js';
import FiltersView from './view/filters-view.js';
import ContentPresenter from './presenter/main-content-presenter.js';
import FooterStats from './view/footer-stats-view.js';
import PopupView from './view/popup-view.js';
import PopupWithoutCommView from './view/popup-without-comm-view.js';
import PopupCommView from './view/popup-comm-view.js';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const contentPresenter = new ContentPresenter;
const siteFooterElement = document.querySelector('.footer');
const siteBodyElement = document.querySelector('body');

render(new ProfileView(), siteHeaderElement);
render(new MenuView(), siteMainElement);
render(new FiltersView(), siteMainElement);

contentPresenter.init(siteMainElement);

render(new FooterStats(), siteFooterElement);
render(new PopupView(), siteBodyElement, RenderPosition.BEFOREEND);
render(new PopupWithoutCommView(), siteBodyElement, RenderPosition.BEFOREEND);
render(new PopupCommView(), siteBodyElement, RenderPosition.BEFOREEND);


