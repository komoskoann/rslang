import Control from '../../controls/control';

export default class DictionarySection extends Control {
  constructor(parentNode: HTMLElement) {
    super(parentNode, 'section', 'dictionary-section', 'test dictionary');
  }
}
