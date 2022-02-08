import { IWordCard } from '../../eBookPage/IWordCard';

export default class GetWords {
  private url: string = 'https://rslangapplication.herokuapp.com/words';

  async getWord(id: string): Promise<IWordCard> {
    const rawResponse = await fetch(`${this.url}/${id}`);
    return rawResponse.json();
  }

  async getWords(page: number, group: number): Promise<IWordCard[]> {
    const rawResponse = await fetch(`${this.url}?page=${page}&group=${group}`);
    return rawResponse.json();
  }
}
