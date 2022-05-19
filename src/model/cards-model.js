import { generateCard, generateComment } from '../fish/film-card.js';
import { sort, handleRatingSort, handleDateSort } from '../utils.js';

export default class CardsModel {
  #cards = Array.from({ length: 23 }, generateCard);
  #comments = Array.from({ length: 200 }, generateComment);
  #moviesRatingSort = [];
  #moviesCommentsSort = [];

  get cards() {
    return this.#cards;
  }

  get comments() {
    return this.#comments;
  }

  get sortingDate() {
    if (!this.#moviesRatingSort.length) {
      this.#moviesRatingSort = sort(this.#cards, handleDateSort, this.#cards.length);
    }
    return this.#moviesRatingSort;
  }

  get sortingRating() {
    if (!this.#moviesCommentsSort.length) {
      this.#moviesCommentsSort = sort(this.#cards, handleRatingSort, this.#cards.length);
    }
    return this.#moviesCommentsSort;
  }
}
