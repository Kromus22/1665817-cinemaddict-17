import { createElement } from '../render.js';

const createFilmsSectionTitleTemplate = () => (`
  <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
  `);

export default class FilmsSectionTitleView {
  getTemplate() {
    return createFilmsSectionTitleTemplate();
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
