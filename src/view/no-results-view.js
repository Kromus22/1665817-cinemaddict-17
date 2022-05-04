import { createElement } from '../render.js';

const createNoResultsTemplate = () => (`
  <h2 class="films-list__title">There are no movies in our database</h2>
  `);

export default class NoResultsView {
  #element = null;

  get template() {
    return createNoResultsTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
