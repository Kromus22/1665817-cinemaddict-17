import Observable from '../framework/observable.js';
import { generateCard } from '../fish/film-card.js';
import { UpdateType } from '../consts.js';

export default class CardsModel extends Observable {
  #cards = Array.from({ length: 23 }, generateCard);

  init = () => {
    this._notify(UpdateType.INIT);
  };

  popupScrollPosition;

  get cards() {
    return this.#cards;
  }

  updateCard = (updateType, update) => {
    const index = this.#cards.findIndex((card) => card.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting movie');
    }

    this.#cards = [
      ...this.#cards.slice(0, index),
      update,
      ...this.#cards.slice(index + 1),
    ];
    this._notify(updateType, update);
  };


}
