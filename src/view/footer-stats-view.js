import { createElement } from '../render.js';

const createFooterStatsTemplate = () => (`
  <section class="footer__statistics">
    <p>130 291 movies inside</p>
  </section>
  `);

export default class FooterStats {
  #element = null;

  get template() {
    return createFooterStatsTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
