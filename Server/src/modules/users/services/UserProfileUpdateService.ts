import Users from '@modules/users/infra/typeorm/entities/users';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/error/appError';
import IHashProvider from '../providers/hashProvider/model/IHashProvider';
import IUserRepository from '../repositories/IUserRepositories';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
class UpdateUserProfileService {
  constructor(
    @inject('CreateUsersRepository')
    private usersRepository: IUserRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    old_password,
    password,
  }: IRequest): Promise<Users> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found.');
    }

    const userUpdateWithEmail = await this.usersRepository.findByEmail(email);

    if (userUpdateWithEmail && userUpdateWithEmail.id !== user_id) {
      throw new AppError('E-Mail in use.');
    }

    user.name = name;
    user.email = email;

    if (password && !old_password) {
      throw new AppError('You need the old password, to set a new one');
    }

    if (password && old_password) {
      const compareHash = await this.hashProvider.compareHash(
        old_password,
        user.password,
      );

      if (!compareHash) {
        throw new AppError(
          'Your old password is wrong. Please, check and try again',
        );
      }

      user.password = await this.hashProvider.generateHash(password);
    }

    return this.usersRepository.save(user);
  }
}

export default UpdateUserProfileService;
