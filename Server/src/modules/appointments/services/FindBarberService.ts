import Users from '@modules/users/infra/typeorm/entities/users';
import { inject, injectable } from 'tsyringe';
import { classToClass } from 'class-transformer';

import ICacheProvider from '@shared/container/providers/cacheProvider/models/ICacheProvider';
import IUserRepository from '@modules/users/repositories/IUserRepositories';

interface IRequest {
  user_id: string;
}

@injectable()
class ShowBarberProfileService {
  constructor(
    @inject('CreateUsersRepository')
    private usersRepository: IUserRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ user_id }: IRequest): Promise<Users[]> {
    let users = await this.cacheProvider.recover<Users[]>(
      `providers-list:${user_id}`,
    );

    if (!users) {
      users = await this.usersRepository.findBarbers({
        except_user_id: user_id,
      });

      await this.cacheProvider.save(
        `providers-list:${user_id}`,
        classToClass(users),
      );
    }

    return users;
  }
}

export default ShowBarberProfileService;
