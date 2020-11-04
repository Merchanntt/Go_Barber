import { container } from 'tsyringe';

import '@modules/users/providers/index';
import '@shared/container/providers';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import CreateAppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/newAppointmeints';

import IUsersRepositories from '@modules/users/repositories/IUserRepositories';
import CreateUsersRepository from '@modules/users/infra/typeorm/repositories/CreateUserRepository';

import ITolkenRepository from '@modules/users/repositories/ITolkenRepository';
import CreateTokenRepository from '@modules/users/infra/typeorm/repositories/CreateTokenRepository';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import NotificationsRepository from '@modules/notifications/infra/typeorm/repositories/NotificationsRepositories';

container.registerSingleton<IAppointmentsRepository>(
  'AppointmentsRepository',
  CreateAppointmentsRepository,
);

container.registerSingleton<IUsersRepositories>(
  'CreateUsersRepository',
  CreateUsersRepository,
);

container.registerSingleton<ITolkenRepository>(
  'CreateTokenRepository',
  CreateTokenRepository,
);

container.registerSingleton<INotificationsRepository>(
  'NotificationsRepository',
  NotificationsRepository,
);
