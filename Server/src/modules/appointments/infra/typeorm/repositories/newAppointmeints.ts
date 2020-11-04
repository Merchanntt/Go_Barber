import { getRepository, Repository, Raw } from 'typeorm';

import IAppointmentsRepositories from '@modules/appointments/repositories/IAppointmentsRepository';
import IFindAllBarbersInMonthDTO from '@modules/appointments/dtos/IFindAllBarbersInMonthDTO';
import ICreateAppointmentsDTO from '@modules/appointments/dtos/ICreateAppointmentsDTO';
import IFindAllBarbersInDayDTO from '@modules/appointments/dtos/IFindAllBarbersInDayDTO';

import Appointments from '../entities/appointment';

class AppointmentsRepositorys implements IAppointmentsRepositories {
  private ormRepository: Repository<Appointments>;

  constructor() {
    this.ormRepository = getRepository(Appointments);
  }

  public async findByDate(
    date: Date,
    provider_id: string,
  ): Promise<Appointments | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { date, provider_id },
    });

    return findAppointment;
  }

  public async findAllBarbersInMonth({
    provider_id,
    month,
    year,
  }: IFindAllBarbersInMonthDTO): Promise<Appointments[]> {
    const parseMonth = String(month).padStart(2, '0');

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'MM-YYYY') = '${parseMonth}-${year}'`,
        ),
      },
    });

    return appointments;
  }

  public async findAllBarbersInDay({
    provider_id,
    day,
    month,
    year,
  }: IFindAllBarbersInDayDTO): Promise<Appointments[]> {
    const parseDay = String(day).padStart(2, '0');
    const parseMonth = String(month).padStart(2, '0');

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parseDay}-${parseMonth}-${year}'`,
        ),
      },
      relations: ['user'],
    });

    return appointments;
  }

  public async create({
    provider_id,
    user_id,
    date,
  }: ICreateAppointmentsDTO): Promise<Appointments> {
    const appointment = this.ormRepository.create({
      provider_id,
      user_id,
      date,
    });

    await this.ormRepository.save(appointment);

    return appointment;
  }
}

export default AppointmentsRepositorys;
