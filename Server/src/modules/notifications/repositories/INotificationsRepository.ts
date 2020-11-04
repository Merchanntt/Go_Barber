import INotificationsRepositoryDTO from '../dtos/INotificationsRepositoryDTO';
import Notification from '../infra/typeorm/schemas/Notifications';

export default interface INotificationsRepository {
  create(data: INotificationsRepositoryDTO): Promise<Notification>;
}
