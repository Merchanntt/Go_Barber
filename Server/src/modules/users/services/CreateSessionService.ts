import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/error/appError';

import Secret from '@config/auth';
import User from '@modules/users/infra/typeorm/entities/users';
import IUserRepository from '../repositories/IUserRepositories';
import IHashProvider from '../providers/hashProvider/model/IHashProvider';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}

@injectable()
class SessionAuthenticate {
  constructor(
    @inject('CreateUsersRepository')
    private userRepository: IUserRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Invalid email/password', 401);
    }

    const validPassword = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!validPassword) {
      throw new AppError('Invalid email/password', 401);
    }

    const { secret, expiresIn } = Secret.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return {
      user,
      token,
    };
  }
}

export default SessionAuthenticate;
