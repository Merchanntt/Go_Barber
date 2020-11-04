import { uuid } from 'uuidv4';
import { isEqual, getYear, getMonth, getDate } from 'date-fns';

import IAppointmentsRepositories from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentsDTO from '@modules/appointments/dtos/ICreateAppointmentsDTO';
import IFindAllBarbersInMonthDTO from '@modules/appointments/dtos/IFindAllBarbersInMonthDTO';
import IFindAllBarbersInDayDTO from '@modules/appointments/dtos/IFindAllBarbersInDayDTO';

import Appointments from '../../infra/typeorm/entities/appointment';

class AppointmentsRepositorys implements IAppointmentsRepositories {
  private appointments: Appointments[] = [];

  public async findByDate(
    date: Date,
    provider_id: string,
  ): Promise<Appointments | undefined> {
    const findAppointment = this.appointments.find(
      appointment =>
        isEqual(appointment.date, date) && appointment.id === provider_id,
    );

    return findAppointment;
  }

  public async findAllBarbersInMonth({
    provider_id,
    month,
    year,
  }: IFindAllBarbersInMonthDTO): Promise<Appointments[]> {
    const appointments = this.appointments.filter(
      appointment =>
        appointment.provider_id === provider_id &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year,
    );

    return appointments;
  }

  public async findAllBarbersInDay({
    provider_id,
    day,
    month,
    year,
  }: IFindAllBarbersInDayDTO): Promise<Appointments[]> {
    const appointments = this.appointments.filter(
      appointment =>
        appointment.provider_id === provider_id &&
        getDate(appointment.date) === day &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year,
    );

    return appointments;
  }

  public async create({
    provider_id,
    user_id,
    date,
  }: ICreateAppointmentsDTO): Promise<Appointments> {
    const appointment = new Appointments();

    Object.assign(appointment, { id: uuid(), date, provider_id, user_id });

    this.appointments.push(appointment);

    return appointment;
  }
}

export default AppointmentsRepositorys;
