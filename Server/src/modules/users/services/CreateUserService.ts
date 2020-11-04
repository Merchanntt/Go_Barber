import User from '@modules/users/infra/typeorm/entities/users';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/error/appError';
import IUserRepositories from '@modules/users/repositories/IUserRepositories';
import ICacheProvider from '@shared/container/providers/cacheProvider/models/ICacheProvider';
import IHashProvider from '../providers/hashProvider/model/IHashProvider';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUser {
  constructor(
    @inject('CreateUsersRepository')
    private userRepository: IUserRepositories,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ name, email, password }: IRequest): Promise<User> {
    const checkUserExists = await this.userRepository.findByEmail(email);
    if (checkUserExists) {
      throw new AppError('Email already exists!');
    }

    const hashPassword = await this.hashProvider.generateHash(password);

    const user = await this.userRepository.create({
      name,
      email,
      password: hashPassword,
    });

    await this.cacheProvider.invalidatePrefix(`provider-list`);

    return user;
  }
}

export default CreateUser;
