import AbstractView from '../framework/view/abstract-view.js';
import { getFilters } from '../utils.js';

const createFilterItemTemplate = (filter) => `<a href="#${filter.name}" class="main-navigation__item">${filter.name.charAt(0).toUpperCase() + filter.name.slice(1)} <span class="main-navigation__item-count">${filter.count}</span></a>`;

const createMenuTemplate = (filters) => (`
  <nav class="main-navigation">
    <a href="#all" class="main-navigation__item main-navigation__item--active"> All movies</a>
    ${filters.map((filter) => createFilterItemTemplate(filter)).join('')}
  </nav>
  `);

export default class MenuView extends AbstractView {
  #filters = [];

  constructor(cards) {
    super();
    this.#filters = getFilters(cards);
  }

  get template() {
    return createMenuTemplate(this.#filters);
  }

}
