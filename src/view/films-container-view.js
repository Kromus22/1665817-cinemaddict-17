import AbstractView from '../framework/view/abstract-view.js';
import { Titles } from '../consts.js';

const SectionType = {
  COMMON: '<h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>',
  RATED: '<h2 class="films-list__title">Top rated</h2>',
  COMMENTED: '<h2 class="films-list__title">Most commented</h2>',
};

const createFilmsSectionTemplate = (title, extra, top) => {

  let extraClass = '';

  if (top) {
    extraClass = top;
  }

  let filmClass = '';

  if (extra) {
    filmClass = 'films-list--extra';
  }
  const sectionTitle = () => {
    switch (title) {
      case Titles.COM:
        return SectionType.COMMON;
      case Titles.TOP:
        return SectionType.RATED;
      case Titles.MOST:
        return SectionType.COMMENTED;
    }
  };
  return `
    <section class="films-list ${filmClass} ${extraClass}">
      ${sectionTitle()}
      <div class="films-list__container">

      </div>
    </section>
  `;
};

export default class FilmsContainerView extends AbstractView {
  constructor(title, extra, top) {
    super();
    this.title = title;
    this.extra = extra;
    this.top = top;
  }

  get template() {
    return createFilmsSectionTemplate(this.title, this.extra, this.top);
  }

  get container() {
    return this.element.querySelector('.films-list__container');
  }

}
