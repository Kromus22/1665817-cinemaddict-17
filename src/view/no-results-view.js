import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../consts.js';

const createNoResultsTemplate = (currentFilter) => {
  const NoMoviesText = {
    [FilterType.ALL]: 'There are no movies in our database',
    [FilterType.WATCHLIST]: 'There are no movies to watch now',
    [FilterType.HISTORY]: 'There are no watched movies now',
    [FilterType.FAVORITES]: 'There are no favorite movies now',
  };

  return (`
  <h2 class="films-list__title">${NoMoviesText[currentFilter]}</h2>
  `);
};

export default class NoResultsView extends AbstractView {
  #currentFilter = null;

  constructor(currentFilterType = 'all') {
    super();
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return createNoResultsTemplate(this.#currentFilter);
  }
}
