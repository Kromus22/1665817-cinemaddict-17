import Observable from '../framework/observable.js';
import { UpdateType } from '../consts.js';

export default class CommsModel extends Observable {
  #moviesApiService = null;
  #comments = [];

  constructor(moviesApiService) {
    super();
    this.#moviesApiService = moviesApiService;
  }

  init = async (card) => {
    try {
      this.#comments = await this.#moviesApiService.getComments(card);
    } catch (err) {
      this.#comments = [];
    }
    this._notify(UpdateType.INIT);
  };

  get comments() {
    return this.#comments;
  }

  deleteComment = async (updateType, update) => {
    const index = this.#comments.findIndex((comment) => comment.id === update.deletedCommentId);
    if (index === -1) {
      throw new Error('Can\'t update unexisting comment');
    }

    try {
      await this.#moviesApiService.deleteComment(update.deletedCommentId);
      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1),
      ];
      delete update.deletedCommentId;
    } catch (err) {
      update.comments.push(update.deletedCommentId);
      this._notify(UpdateType.PATCH, update);
      throw new Error('Can\'t delete comment');
    }
  };

  addComment = async (updateType, update) => {
    try {
      const updatedComments = await this.#moviesApiService.addComment(update);
      this.#comments = [...updatedComments.comments];
      delete updatedComments.card;
    } catch (err) {
      this._notify(UpdateType.PATCH, update);
      throw new Error('Can\'t create new comment');
    }
  };
}
