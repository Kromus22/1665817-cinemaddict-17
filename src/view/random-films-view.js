import { createElement } from '../render.js';

const createRandomFilmsSectionTemplate = () => (`
  <section class="films-list">
  </section>
  `);

export default class RandomFilmsSectionView {
  getTemplate() {
    return createRandomFilmsSectionTemplate();
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
