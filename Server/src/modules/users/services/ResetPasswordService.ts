import { inject, injectable } from 'tsyringe';
import { addHours, isAfter } from 'date-fns';

import IUserRepositories from '@modules/users/repositories/IUserRepositories';
import AppError from '@shared/error/appError';
import IUserTolkenRepositories from '../repositories/ITolkenRepository';
import IHashProvider from '../providers/hashProvider/model/IHashProvider';

interface IRequest {
  password: string;
  token: string;
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject('CreateUsersRepository')
    private userRepository: IUserRepositories,

    @inject('CreateTokenRepository')
    private tolkenRepository: IUserTolkenRepositories,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ password, token }: IRequest): Promise<void> {
    const userToken = await this.tolkenRepository.findByToken(token);

    if (!userToken) {
      throw new AppError("User token doesn't exists");
    }

    const user = await this.userRepository.findById(userToken.user_id);

    if (!user) {
      throw new AppError("User doesn't exists");
    }

    const createdToken = userToken.created_at;
    const tokenAddHours = addHours(createdToken, 2);

    if (isAfter(Date.now(), tokenAddHours)) {
      throw new AppError('Token expire');
    }

    user.password = await this.hashProvider.generateHash(password);

    await this.userRepository.save(user);
  }
}

export default ResetPasswordService;
