import AbstractView from '../framework/view/abstract-view.js';

const createFooterStatsTemplate = () => (`
  <section class="footer__statistics">
    <p>130 291 movies inside</p>
  </section>
  `);

export default class FooterStats extends AbstractView {

  get template() {
    return createFooterStatsTemplate();
  }
}
