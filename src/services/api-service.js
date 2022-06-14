import ApiService from '../framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  DELETE: 'DELETE',
  POST: 'POST'
};

export default class MoviesApiService extends ApiService {
  get cards() {
    return this._load({ url: 'movies' })
      .then(ApiService.parseResponse);
  }

  getComments = (card) => this._load({ url: `comments/${card.id}` }).then(ApiService.parseResponse);

  deleteComment = async (comment) => await this._load({
    url: `comments/${comment}`,
    method: Method.DELETE,
    headers: new Headers({ 'Content-Type': 'application/json' }),
  });

  addComment = async (card) => {
    const response = await this._load({
      url: `comments/${card.id}`,
      method: Method.POST,
      body: JSON.stringify(card.newComment),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    const parsedResponse = await ApiService.parseResponse(response);
    return parsedResponse;
  };

  #adaptToServer = (card) => {
    const adaptedCard = {
      ...card,
      'film_info': {
        ...card.filmInfo,
        'age_rating': card.filmInfo.ageRating,
        'alternative_title': card.filmInfo.alternativeTitle,
        'total_rating': card.filmInfo.totalRating,
        release: {
          date: card.filmInfo.release.date,
          'release_country': card.filmInfo.release.releaseCountry
        }
      },
      'user_details': {
        favorite: card.userDetails.favorite,
        'already_watched': card.userDetails.alreadyWatched,
        'watching_date': card.userDetails.watchingDate,
        watchlist: card.userDetails.watchlist
      }
    };

    delete adaptedCard.filmInfo;
    delete adaptedCard.userDetails;
    delete adaptedCard['film_info'].ageRating;
    delete adaptedCard['film_info'].alternativeTitle;
    delete adaptedCard['film_info'].totalRating;

    return adaptedCard;
  };

  updateCard = async (card) => {
    const response = await this._load({
      url: `movies/${card.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(card)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };
}
