import { createElement } from '../render.js';

const createTopFilmsTitleTemplate = () => (`
  <h2 class="films-list__title">Top rated</h2>
  `);

export default class TopFilmsTitleView {
  getTemplate() {
    return createTopFilmsTitleTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
