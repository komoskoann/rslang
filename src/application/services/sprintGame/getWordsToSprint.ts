import { ISprint } from '../../gamesPage/sprintGame/ISprint';
import { getAuthorizedUser } from '../authorizationService/authorizedUser';

export default class GetWordsToSprint {
  private url: string = 'https://rslangapplication.herokuapp.com';

  async getWordstoSprint(page: number, group: number): Promise<ISprint[]> {
    const rawResponse = await fetch(`${this.url}/words?page=${page}&group=${group}`);
    return rawResponse.json();
  }

  async changeUserWord(wordId: string, word: { difficulty: string; optional: {} }): Promise<Response> {
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
