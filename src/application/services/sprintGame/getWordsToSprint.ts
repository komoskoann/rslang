import { IWordCard } from '../../eBookPage/ebookInterface';

export default class GetWordsToSprint {
  private url: string = 'https://rslangapplication.herokuapp.com';

  async getWordstoSprint(page: number, group: number): Promise<IWordCard[]> {
    const rawResponse = await fetch(`${this.url}/words?page=${page}&group=${group}`);
    return rawResponse.json();
  }
}
