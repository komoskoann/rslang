import Control from '../../controls/control';
import WordCard from './wordCard';
import eBook from './eBook.html';
import '../../css/eBook.css';
import { IWordCard } from './IWordCard';

export default class EBookSection extends Control {
  wordCards: WordCard[];

  private defaultEnglishLevel: number = 0;

  private currentEnglishLevel: number;

  private defaultWordsPage: number = 0;

  private numOfLevels: number = 6;

  private wordsPerPage: number = 20;

  private numOfPages: number = 30;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'section', 'e-book', '');
    this.node.innerHTML = eBook;
    this.getWords(this.defaultWordsPage, this.defaultEnglishLevel);
    this.navLevels();
  }

  async getWord(id: string) {
    const rawResponse = await fetch(`https://rslangapplication.herokuapp.com/words/${id}`);
    const content = await rawResponse.json();
    console.log(content);
  }

  // getWord('5e9f5ee35eb9e72bc21af4a0');

  async getWords(page: number, group: number) {
    const rawResponse = await fetch(`https://rslangapplication.herokuapp.com/words?page=${page}&group=${group}`);
    const words: IWordCard[] = await rawResponse.json();
    console.log(words);
    this.wordCards = words.map((word: IWordCard) => new WordCard(this.node, word));
    this.wordCards.forEach((word) => word.render());
    console.log(this.wordCards);
  }

  navLevels() {
    this.node.querySelectorAll("[data-level]").forEach(level => {
      level.addEventListener('click', function(instance: EBookSection) {
        instance.currentEnglishLevel = +level.getAttribute('data-level');
        console.log(instance.currentEnglishLevel);
        instance.getWords(instance.defaultWordsPage, instance.currentEnglishLevel);
      }.bind(null, this),);
    })
  }
}
