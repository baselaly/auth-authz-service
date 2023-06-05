import { IUser } from '../interfaces/index.interface';

export class LoginSerializer {
  public name: string;
  public email: string;
  public id: string;
  public token: string;

  constructor(user: IUser, token: string) {
    this.email = user.email;
    this.name = user.name;
    this.id = user.id;
    this.token = token;
  }
}
