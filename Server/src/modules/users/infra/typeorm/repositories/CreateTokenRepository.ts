import { getRepository, Repository } from 'typeorm';

import ITolkenRepository from '@modules/users/repositories/ITolkenRepository';

import UserTolken from '../entities/UserTolken';

class UserTolkenRepository implements ITolkenRepository {
  private ormRepository: Repository<UserTolken>;

  constructor() {
    this.ormRepository = getRepository(UserTolken);
  }

  public async findByToken(token: string): Promise<UserTolken | undefined> {
    const userToken = await this.ormRepository.findOne({ where: { token } });

    return userToken;
  }

  public async generate(user_id: string): Promise<UserTolken> {
    const userToken = this.ormRepository.create({
      user_id,
    });

    await this.ormRepository.save(userToken);

    return userToken;
  }
}

export default UserTolkenRepository;
