export default class GetWords {
  private url: string = 'https://rslangapplication.herokuapp.com/words';

  async getWord(id: string) {
    const rawResponse = await fetch(`${this.url}/${id}`);
    return rawResponse.json();
  }

  async getWords(page: number, group: number) {
    const rawResponse = await fetch(`${this.url}?page=${page}&group=${group}`);
    return rawResponse.json();
  }
}
