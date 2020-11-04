import { inject, injectable } from 'tsyringe';
import { getDaysInMonth, getDate, isAfter } from 'date-fns';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
class FindBarberMonthAvaliabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllBarbersInMonth(
      {
        provider_id,
        month,
        year,
      },
    );

    const daysInMonth = getDaysInMonth(new Date(year, month - 1));

    const eachDayArray = Array.from(
      { length: daysInMonth },
      (_, index) => index + 1,
    );

    const availableDay = eachDayArray.map(day => {
      const compareDay = new Date(year, month - 1, day, 23, 59, 59);

      const appointmentsDay = appointments.filter(appointment => {
        return getDate(appointment.date) === day;
      });
      return {
        day,
        available:
          isAfter(compareDay, new Date()) && appointmentsDay.length < 10,
      };
    });

    return availableDay;
  }
}

export default FindBarberMonthAvaliabilityService;
