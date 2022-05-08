import AbstractView from '../framework/view/abstract-view.js';
import { Titles } from '../utils.js';

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
      case Titles.com:
        return SectionType.common;
      case Titles.top:
        return SectionType.topRated;
      case Titles.most:
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

export default class FilmsContainerView extends AbstractView {
  constructor(title, extra) {
    super();
    this.title = title;
    this.extra = extra;
  }

  get template() {
    return createFilmsSectionTemplate(this.title, this.extra);
  }

  get container() {
    return this.element.querySelector('.films-list__container');
  }

}
