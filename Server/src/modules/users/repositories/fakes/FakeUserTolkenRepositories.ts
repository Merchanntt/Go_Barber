import { uuid } from 'uuidv4';

import ITolkenRepository from '@modules/users/repositories/ITolkenRepository';

import UserTolken from '../../infra/typeorm/entities/UserTolken';

class FakeUserTolkenRepositories implements ITolkenRepository {
  private userTolkens: UserTolken[] = [];

  public async generate(user_id: string): Promise<UserTolken> {
    const userToken = new UserTolken();

    Object.assign(userToken, {
      id: uuid(),
      token: uuid(),
      user_id,
      created_at: new Date(),
      updated_at: new Date(),
    });

    this.userTolkens.push(userToken);

    return userToken;
  }

  public async findByToken(token: string): Promise<UserTolken | undefined> {
    const userToken = await this.userTolkens.find(
      newToken => newToken.token === token,
    );

    return userToken;
  }
}

export default FakeUserTolkenRepositories;
