import Observable from '../framework/observable.js';
import { generateCard, generateComment } from '../fish/film-card.js';

export default class CardsModel extends Observable {
  #cards = Array.from({ length: 23 }, generateCard);
  #comments = Array.from({ length: 200 }, generateComment);

  get cards() {
    return this.#cards;
  }

  get comments() {
    return this.#comments;
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

  deleteComment = (updateType, update) => {
    const index = this.#comments.findIndex((comment) => comment.id === +update.deletedCommentId);
    if (index === -1) {
      throw new Error('Can\'t update unexisting comment');
    }

    this.#comments = [
      ...this.#comments.slice(0, index),
      ...this.#comments.slice(index + 1),
    ];
    this._notify(updateType, update);
  };

  addComment = (updateType, update) => {
    this.#comments = [update.newComment, ...this.#comments];
    this._notify(updateType, update);
  };
}
