import Users from '@modules/users/infra/typeorm/entities/users';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/error/appError';
import IUserRepository from '../repositories/IUserRepositories';

interface IRequest {
  user_id: string;
}

@injectable()
class ShowUserProfileService {
  constructor(
    @inject('CreateUsersRepository')
    private usersRepository: IUserRepository,
  ) {}

  public async execute({ user_id }: IRequest): Promise<Users> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found.');
    }

    return user;
  }
}

export default ShowUserProfileService;
