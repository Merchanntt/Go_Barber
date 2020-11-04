import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindBarbersDTO from '@modules/users/dtos/IFindBarbersDTO';
import User from '../infra/typeorm/entities/users';

export default interface ICreateUserRepository {
  findBarbers(data: IFindBarbersDTO): Promise<User[]>;
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  create(data: ICreateUserDTO): Promise<User>;
  save(user: User): Promise<User>;
}
