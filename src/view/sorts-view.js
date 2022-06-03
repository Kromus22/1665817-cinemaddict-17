import AbstractView from '../framework/view/abstract-view.js';
import { SortType } from '../consts.js';

const createSortsTemplate = () => (`
  <ul class="sort">
    <li><a href="#" data-sort-type="${SortType.DEFAULT}" class="sort__button sort__button--active">Sort by default</a></li>
    <li><a href="#" data-sort-type="${SortType.DATE}" class="sort__button">Sort by date</a></li>
    <li><a href="#" data-sort-type="${SortType.RATING}" class="sort__button">Sort by rating</a></li>
  </ul>
  `);

export default class SortView extends AbstractView {

  get template() {
    return createSortsTemplate();
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  };

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    document.querySelectorAll('.sort__button').forEach((item) => (item.className = 'sort__button'));
    evt.target.classList.toggle('sort__button--active');
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  };

}
