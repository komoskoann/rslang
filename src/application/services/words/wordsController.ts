import { IWordCard, IResponseWord } from '../../eBookPage/IWordCard';
import { app } from '../../..';

export default class WordsController {
  private url: string = 'https://rslangapplication.herokuapp.com/words';

  private userUrl: string = 'https://rslangapplication.herokuapp.com/users';

  async getWord(id: string): Promise<IWordCard> {
    const rawResponse = await fetch(`${this.url}/${id}`);
    return rawResponse.json();
  }

  async getWords(page: number, group: number): Promise<IWordCard[]> {
    const rawResponse = await fetch(`${this.url}?page=${page}&group=${group}`);
    return rawResponse.json();
  }

  async getHardUserWords(): Promise<IWordCard[]> {
    const rawResponse = await fetch(
      `${this.userUrl}/${app.currentUser.userId}/aggregatedWords?wordsPerPage=3600&filter={"userWord.difficulty":"hard"}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${app.currentUser.token}`,
          Accept: 'application/json',
        },
      },
    );
    return rawResponse.json().then((item) => item[0].paginatedResults.map((i: IResponseWord) => ({ ...i, id: i._id })));
  }

  async createUserWord(wordId: string, word: { difficulty: string; optional: {} }): Promise<Response> {
    const rawResponse = await fetch(`${this.userUrl}/${app.currentUser.userId}/words/${wordId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${app.currentUser.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(word),
    });
    return rawResponse;
  }

  async getUserWord(wordId: string): Promise<IWordCard[]> {
    const rawResponse = await fetch(`${this.userUrl}/${app.currentUser.userId}/words/${wordId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${app.currentUser.token}`,
        Accept: 'application/json',
      },
    });
    return rawResponse.json().then((item) => item[0].paginatedResults.map((i: IResponseWord) => ({ ...i, id: i._id })));
  }

  async changeUserWord(wordId: string, word: { difficulty: string; optional: {} }): Promise<Response> {
    const rawResponse = await fetch(`${this.userUrl}/${app.currentUser.userId}/words/${wordId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${app.currentUser.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(word),
    });
    return rawResponse.json();
  }

  async getUserAgrWord(wordId: string): Promise<IWordCard[]> {
    const rawResponse = await fetch(`${this.userUrl}/${app.currentUser.userId}/aggregatedWords/${wordId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${app.currentUser.token}`,
        Accept: 'application/json',
      },
    });
    return rawResponse.json();
  }
}
