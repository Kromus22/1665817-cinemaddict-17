import { render } from './render.js';
import MenuView from './view/menu-view.js';
import ProfileView from './view/profile-view.js';
import FiltersView from './view/filters-view.js';
import ContentPresenter from './presenter/main-content-presenter.js';
import FooterStats from './view/footer-stats-view.js';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const contentPresenter = new ContentPresenter;
const siteFooterElement = document.querySelector('.footer');

render(new ProfileView(), siteHeaderElement);
render(new MenuView(), siteMainElement);
render(new FiltersView(), siteMainElement);

contentPresenter.init(siteMainElement);

render(new FooterStats(), siteFooterElement);
