import MenuView from '../view/menu-view.js';
import { render, replace, remove } from '../framework/render.js';
import { filters } from '../utils.js';
import { FilterType, UpdateType } from '../consts.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #cardsModel = null;
  #filterComponent = null;

  constructor(filterContainer, filterModel, cardsModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#cardsModel = cardsModel;

    this.#cardsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const cards = this.#cardsModel.cards;

    return [
      {
        type: FilterType.ALL,
        name: 'All',
        count: filters[FilterType.ALL](cards).length,
      },
      {
        type: FilterType.WATCHLIST,
        name: 'Watchlist',
        count: filters[FilterType.WATCHLIST](cards).length,
      },
      {
        type: FilterType.HISTORY,
        name: 'History',
        count: filters[FilterType.HISTORY](cards).length,
      },
      {
        type: FilterType.FAVORITES,
        name: 'Favorites',
        count: filters[FilterType.FAVORITES](cards).length,
      },
    ];
  }

  init = () => {
    const filter = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new MenuView(filter, this.#filterModel.filter);
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }
    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  };

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
