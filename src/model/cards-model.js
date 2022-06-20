import Observable from '../framework/observable.js';
import { UpdateType } from '../consts.js';
import { Error } from '../services/api-service.js';

export default class CardsModel extends Observable {
  #cards = [];
  #moviesApiService = null;

  constructor(moviesApiService) {
    super();
    this.#moviesApiService = moviesApiService;
  }

  init = async () => {
    try {
      const cards = await this.#moviesApiService.cards;
      this.#cards = cards.map(this.#adaptToClient);
    } catch (err) {
      this.#cards = [];
    }
    this._notify(UpdateType.INIT);
  };

  #adaptToClient = (card) => {
    const adaptedCard = {
      ...card,
      userDetails: {
        ...card['user_details'],
        alreadyWatched: card['user_details']['already_watched'],
        watchingDate: card['user_details']['watching_date'],
      },
      filmInfo: {
        ...card['film_info'],
        ageRating: card['film_info']['age_rating'],
        alternativeTitle: card['film_info']['alternative_title'],
        totalRating: card['film_info']['total_rating'],
        release: {
          date: card['film_info']['release']['date'],
          releaseCountry: card['film_info']['release']['release_country']
        }
      }
    };

    delete adaptedCard['film_info'];
    delete adaptedCard.userDetails['watching_date'];
    delete adaptedCard.userDetails['already_watched'];
    delete adaptedCard['user_details'];
    delete adaptedCard.filmInfo['age_rating'];
    delete adaptedCard.filmInfo['alternative_title'];
    delete adaptedCard.filmInfo['total_rating'];

    return adaptedCard;
  };

  popupScrollPosition;
  popupRerender = false;

  get cards() {
    return this.#cards;
  }

  updateCard = async (updateType, update) => {
    const index = this.#cards.findIndex((card) => card.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting movie');
    }

    try {
      const response = await this.#moviesApiService.updateCard(update);
      const updatedCard = this.#adaptToClient(response);
      this.#cards = [
        ...this.#cards.slice(0, index),
        updatedCard,
        ...this.#cards.slice(index + 1),
      ];
      this._notify(updateType, update);
    } catch (err) {
      Error.CHANGING = true;
      update = this.cards.find((item) => item.id === update.id);
      this._notify(UpdateType.PATCH, update);
      throw new Error('Can\'t update unexisting movie');
    }
  };
}
