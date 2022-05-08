import AbstractView from '../framework/view/abstract-view.js';

const createNoResultsTemplate = () => (`
  <h2 class="films-list__title">There are no movies in our database</h2>
  `);

export default class NoResultsView extends AbstractView {

  get template() {
    return createNoResultsTemplate();
  }
}
