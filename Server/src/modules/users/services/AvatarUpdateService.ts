import Users from '@modules/users/infra/typeorm/entities/users';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/error/appError';
import IStorageProvider from '@shared/container/providers/storageProvider/models/IStorageProvider';
import IUserRepository from '../repositories/IUserRepositories';

interface IRequest {
  user_id: string;
  avatarFileName: string;
}

@injectable()
class UpdateAvatarService {
  constructor(
    @inject('CreateUsersRepository')
    private usersRepository: IUserRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({ user_id, avatarFileName }: IRequest): Promise<Users> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Need to be Authenticated, to change an Avatar', 401);
    }
    if (user.avatar) {
      await this.storageProvider.deleteFile(user.avatar);
    }

    const newAvatar = await this.storageProvider.saveFile(avatarFileName);

    user.avatar = newAvatar;

    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateAvatarService;
