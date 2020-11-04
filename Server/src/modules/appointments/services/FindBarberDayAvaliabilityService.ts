import { inject, injectable } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

type IResponse = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
class FindBarberDayAvaliabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    day,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointment = await this.appointmentsRepository.findAllBarbersInDay({
      provider_id,
      day,
      month,
      year,
    });

    const startHour = 8;

    const hourArray = Array.from(
      { length: 10 },
      (_, index) => index + startHour,
    );

    const currentDate = new Date(Date.now());

    const availability = hourArray.map(hour => {
      const hasAppointment = appointment.find(
        appointmentHour => getHours(appointmentHour.date) === hour,
      );

      const compareDate = new Date(year, month - 1, day, hour);

      return {
        hour,
        available: !hasAppointment && isAfter(compareDate, currentDate),
      };
    });

    return availability;
  }
}

export default FindBarberDayAvaliabilityService;
