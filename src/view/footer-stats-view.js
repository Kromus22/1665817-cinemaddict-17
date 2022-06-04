import AbstractView from '../framework/view/abstract-view.js';

const createFooterStatsTemplate = (count) => (`
  <section class="footer__statistics">
    <p>${count} movies inside</p>
  </section>
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
