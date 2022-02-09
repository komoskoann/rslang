interface IAuthirozationRequestInfo {
  email: string;
  password: string;
  name?: string;
}

export default class AutorizationService {
  async signIn(user: IAuthirozationRequestInfo): Promise<Response> {
    return fetch('https://rslangapplication.herokuapp.com/signin', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
  }

  async signUp(user: IAuthirozationRequestInfo): Promise<Response> {
    return fetch('https://rslangapplication.herokuapp.com/users', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
  }
}
