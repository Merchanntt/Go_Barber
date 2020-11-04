import { getMongoRepository, MongoRepository } from 'typeorm';

import INotificationRepositories from '@modules/notifications/repositories/INotificationsRepository';
import ICreateNotificationDTO from '@modules/notifications/dtos/INotificationsRepositoryDTO';

import Notifications from '../schemas/Notifications';

class NotificationRepository implements INotificationRepositories {
  private ormRepository: MongoRepository<Notifications>;

  constructor() {
    this.ormRepository = getMongoRepository(Notifications, 'mongo');
  }

  public async create({
    content,
    recipient_id,
  }: ICreateNotificationDTO): Promise<Notifications> {
    const notification = this.ormRepository.create({
      content,
      recipient_id,
    });

    await this.ormRepository.save(notification);

    return notification;
  }
}

export default NotificationRepository;
