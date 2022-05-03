import { generateCard, generateComment } from '../fish/film-card.js';

export default class CardsModel {
  #cards = Array.from({ length: 15 }, generateCard);
  #comments = Array.from({ length: 200 }, generateComment);

  get cards() {
    return this.#cards;
  }

  get comments() {
    return this.#comments;
  }
}
