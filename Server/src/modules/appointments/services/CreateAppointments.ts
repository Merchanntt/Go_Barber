import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/error/appError';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICacheProvider from '@shared/container/providers/cacheProvider/models/ICacheProvider';
import IAppointmentsRepositories from '../repositories/IAppointmentsRepository';
import Appointments from '../infra/typeorm/entities/appointment';

interface IRequest {
  provider_id: string;
  user_id: string;
  date: Date;
}

@injectable()
class CreateAppointments {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepositories,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    provider_id,
    date,
    user_id,
  }: IRequest): Promise<Appointments> {
    const parseDate = startOfHour(date);

    if (isBefore(parseDate, Date.now())) {
      throw new AppError("You can't book an appointment in a past date.");
    }

    if (user_id === provider_id) {
      throw new AppError("You can't book an appointment with yourself.");
    }

    if (getHours(parseDate) < 8 || getHours(parseDate) > 17) {
      throw new AppError(
        'You just can create an appointment between 8am and 17pm',
      );
    }

    const findAppointmentHourIsAvailable = await this.appointmentsRepository.findByDate(
      parseDate,
      provider_id,
    );

    if (findAppointmentHourIsAvailable) {
      throw new AppError('Booked is not Available');
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: parseDate,
    });

    const formatedDate = format(parseDate, "dd/MM/yyyy 'às' HH:mm'h'");

    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para o dia ${formatedDate}`,
    });

    await this.cacheProvider.invalidate(
      `provider-appointments:${provider_id}:${format(parseDate, 'yyyy-M-d')}`,
    );

    return appointment;
  }
}

export default CreateAppointments;
