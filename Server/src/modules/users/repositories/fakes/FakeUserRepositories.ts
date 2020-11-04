import { uuid } from 'uuidv4';

import IUserRepositories from '@modules/users/repositories/IUserRepositories';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindBarbersDTO from '@modules/users/dtos/IFindBarbersDTO';

import User from '../../infra/typeorm/entities/users';

class FakeUsersRepositorys implements IUserRepositories {
  private user: User[] = [];

  public async findById(id: string): Promise<User | undefined> {
    const searchId = this.user.find(users => users.id === id);

    return searchId;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const searchEmail = this.user.find(users => users.email === email);

    return searchEmail;
  }

  public async findBarbers({
    except_user_id,
  }: IFindBarbersDTO): Promise<User[]> {
    let users = this.user;

    if (except_user_id) {
      users = this.user.filter(user => user.id !== except_user_id);
    }

    return users;
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, { id: uuid() }, userData);

    this.user.push(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    const findIndex = this.user.findIndex(
      userIndex => userIndex.id === user.id,
    );

    this.user[findIndex] = user;

    return user;
  }
}

export default FakeUsersRepositorys;
