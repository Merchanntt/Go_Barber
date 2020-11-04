import { inject, injectable } from 'tsyringe';
import { classToClass } from 'class-transformer';

import ICacheProvider from '@shared/container/providers/cacheProvider/models/ICacheProvider';
import Appointments from '../infra/typeorm/entities/appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

@injectable()
class FindBarberAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    provider_id,
    day,
    month,
    year,
  }: IRequest): Promise<Appointments[]> {
    const cacheKey = `provider-appointments:${provider_id}:${year}-${month}-${day}`;
    let appointment = await this.cacheProvider.recover<Appointments[]>(
      cacheKey,
    );

    if (!appointment) {
      appointment = await this.appointmentsRepository.findAllBarbersInDay({
        provider_id,
        day,
        month,
        year,
      });
      await this.cacheProvider.save(cacheKey, classToClass(appointment));
    }

    return appointment;
  }
}

export default FindBarberAppointmentsService;
