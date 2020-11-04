import { ObjectID } from 'mongodb';

import INotificationRepositories from '@modules/notifications/repositories/INotificationsRepository';
import ICreateNotificationDTO from '@modules/notifications/dtos/INotificationsRepositoryDTO';

import Notifications from '../../infra/typeorm/schemas/Notifications';

class FakeNotificationRepository implements INotificationRepositories {
  private notifications: Notifications[] = [];

  public async create({
    content,
    recipient_id,
  }: ICreateNotificationDTO): Promise<Notifications> {
    const notification = new Notifications();

    Object.assign(notification, { id: new ObjectID(), content, recipient_id });

    this.notifications.push(notification);

    return notification;
  }
}

export default FakeNotificationRepository;
