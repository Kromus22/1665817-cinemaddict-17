import { createElement } from '../render.js';

const createMostCommsFilmsTitleTemplate = () => (`
  <h2 class="films-list__title">Most commented</h2>
  `);

export default class MostCommsFilmsTitleView {
  getTemplate() {
    return createMostCommsFilmsTitleTemplate();
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
