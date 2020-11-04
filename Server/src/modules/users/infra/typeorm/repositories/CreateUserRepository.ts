import { getRepository, Repository, Not } from 'typeorm';

import IUserRepositories from '@modules/users/repositories/IUserRepositories';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindBarbersDTO from '@modules/users/dtos/IFindBarbersDTO';

import User from '../entities/users';

class UsersRepositorys implements IUserRepositories {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async findById(id: string): Promise<User | undefined> {
    const searchId = await this.ormRepository.findOne(id);

    return searchId;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const searchEmail = await this.ormRepository.findOne({ where: { email } });

    return searchEmail;
  }

  public async findBarbers({
    except_user_id,
  }: IFindBarbersDTO): Promise<User[]> {
    let users: User[];

    if (except_user_id) {
      users = await this.ormRepository.find({
        where: {
          id: Not(except_user_id),
        },
      });
    } else {
      users = await this.ormRepository.find();
    }

    return users;
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const appointment = this.ormRepository.create(userData);

    await this.ormRepository.save(appointment);

    return appointment;
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }
}

export default UsersRepositorys;
