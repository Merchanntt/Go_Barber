import Tolken from '../infra/typeorm/entities/UserTolken';

export default interface IUserTolkenRepository {
  generate(user_id: string): Promise<Tolken>;
  findByToken(token: string): Promise<Tolken | undefined>;
}
