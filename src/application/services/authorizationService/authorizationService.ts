interface IAuthorizationRequestInfo {
  email: string;
  password: string;
  name?: string;
}

export default class AuthorizationService {
  async signIn(user: IAuthorizationRequestInfo): Promise<Response> {
    return fetch('https://rslangapplication.herokuapp.com/signin', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
  }

  async signUp(user: IAuthorizationRequestInfo): Promise<Response> {
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
