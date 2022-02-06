interface IUser {
  "email": string,
  "password": string,
  "name"?: string
}

export default class autorizationService {
  constructor() {}
  async signInUserRequest(user: IUser): Promise<Response> {
    return await fetch('https://rslangapplication.herokuapp.com/signin', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });
  }
  async signUpUserRequest(user: IUser): Promise<Response> {
    return await fetch('https://rslangapplication.herokuapp.com/users', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });
  }
}