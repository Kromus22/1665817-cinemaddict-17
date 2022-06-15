import AbstractView from '../framework/view/abstract-view.js';

const createFooterStatsTemplate = (count) => (`

    <p>${count} movies inside</p>
  
  `);

export default class FooterStats extends AbstractView {

  constructor(count) {
    super();
    this.count = count;
  }

  get template() {
    return createFooterStatsTemplate(this.count);
  }
}
