import AbstractView from '../framework/view/abstract-view.js';

const createNoCardsTemplate = () => (
  `<p class="board__no-movies">
    Loading movies...
  </p>`
);

export default class LoadingView extends AbstractView {
  get template() {
    return createNoCardsTemplate();
  }
}
