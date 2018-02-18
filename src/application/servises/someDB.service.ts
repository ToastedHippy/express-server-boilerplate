import * as bcrypt from "bcrypt";
import {IUser} from "../models/User.model";

class SomeDBService {

  private pswdSaltRounds = 12;

  private users: IUser[] = [
    {id: 1, login: 'user1', password: 'passwordU1'},
    {id: 2, login: 'user2', password: 'passwordU2'}
  ];

  constructor() {
    for(let user of this.users) {
      let hashedPswd = bcrypt.hashSync(user.password, this.pswdSaltRounds)
      user.password = hashedPswd;
    }
  }

  
  getUserByLogin(login: string): Promise<IUser> {
    return new Promise((resolve, reject) => {
      setTimeout(()=>resolve(this.users.find(u => u.login === login)), 1000)
    })
  }

  getUserById(id: number) {
    return new Promise((resolve, reject) => {
      setTimeout(()=>resolve(this.users.find(u => u.id === id)), 1000)
    })
  }

}

export const someDBService = new SomeDBService();