import { IWordCard, IResponseWord } from '../../eBookPage/ebookInterface';
import { getAuthorizedUser } from '../authorizationService/authorizedUser';

export default class GameWordsController {
  private url: string = 'https://rslangapplication.herokuapp.com';

  async getUserAgrWord(wordId: string): Promise<IWordCard[]> {
    const rawResponse = await fetch(`${this.url}/users/${getAuthorizedUser().userId}/aggregatedWords/${wordId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${getAuthorizedUser().token}`,
        Accept: 'application/json',
      },
    });
    return rawResponse.json().then((item) => item.map((i: IResponseWord) => ({ ...i, id: i._id })));
  }

  async createUserWord(wordId: string, word: { difficulty: string; optional: {} }): Promise<Response> {
    const rawResponse = await fetch(`${this.url}/users/${getAuthorizedUser().userId}/words/${wordId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getAuthorizedUser().token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(word),
    });
    return rawResponse;
  }

  async changeUserWord(wordId: string, word: { difficulty: string; optional?: {} }): Promise<Response> {
    const rawResponse = await fetch(`${this.url}/users/${getAuthorizedUser().userId}/words/${wordId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${getAuthorizedUser().token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(word),
    });
    return rawResponse.json();
  }
}
