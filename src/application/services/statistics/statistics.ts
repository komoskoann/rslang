import { IStatistics } from '../../statisticsPage/IStatistics';

export default class Statistics {
  private readonly url: string = 'https://rslangapplication.herokuapp.com/users';

  async getStatistics(userID: string, token: string): Promise<IStatistics> {
    const rawResponse = await fetch(`${this.url}/${userID}/statistics`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      }
    });
    return rawResponse.json();
  }

  async putStatistics(userID: string, token: string, statistics: IStatistics): Promise<IStatistics> {
    console.log(statistics)
    const rawResponse = await fetch(`${this.url}/${userID}/statistics`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(statistics)
    });
    return rawResponse.json();
  }
}
