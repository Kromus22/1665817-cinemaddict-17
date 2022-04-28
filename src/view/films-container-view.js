import { createElement } from '../render.js';

const SectionType = {
  common: '<h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>',
  topRated: '<h2 class="films-list__title">Top rated</h2>',
  mostComm: '<h2 class="films-list__title">Most commented</h2>',
};

const createFilmsSectionTemplate = (title, extra) => {

  let filmClass = '';

  if (extra) {
    filmClass = 'films-list--extra';
  }
  const sectionTitle = () => {
    switch (title) {
      case SectionType.common:
        return SectionType.common;
      case SectionType.topRated:
        return SectionType.topRated;
      case SectionType.mostComm:
        return SectionType.mostComm;
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

class FilmsContainerView {
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

export { FilmsContainerView, SectionType };
