import { createElement } from '../render.js';

const createFilmsSectionTemplate = (title, extra) => {

  let filmClass = '';

  if (extra) {
    filmClass = 'films-list--extra';
  }
  const sectionTitle = () => {
    switch (title) {
      case 1:
        return '<h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>';
      case 2:
        return '<h2 class="films-list__title">Top rated</h2>';
      case 3:
        return '<h2 class="films-list__title">Most commented</h2>';
    }
  };
  return `
    <section class="films-list ${filmClass}">
      ${sectionTitle()}
      <div class="films-list__container">

      </div>
    </section>
  `;
};

export default class FilmsContainerView {
  constructor(title, extra) {
    this.title = title;
    this.extra = extra;
  }

  getTemplate() {
    return createFilmsSectionTemplate(this.title, this.extra);
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
