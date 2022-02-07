export default class GetWords {
  private url: string = 'https://rslangapplication.herokuapp.com/words';

  async getWord(id: string) {
    const rawResponse = await fetch(`${this.url}/${id}`);
    const content = await rawResponse.json();
  }

  async getWords(page: number, group: number) {
    const rawResponse = await fetch(`${this.url}?page=${page}&group=${group}`);
    return await rawResponse.json();
  }
}
