import { createElement } from '../render.js';

const createTopFilmsSectionTemplate = () => (`
  <section class="films-list films-list--extra">
  </section>
  `);

export default class TopFilmsSectionView {
  getTemplate() {
    return createTopFilmsSectionTemplate();
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
