import { generateCard } from '../fish/film-card.js';

export default class CardsModel {
  cards = Array.from({ length: 15 }, generateCard);

  getCards = () => this.cards;
}
