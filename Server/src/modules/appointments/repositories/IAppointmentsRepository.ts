import Appointments from '../infra/typeorm/entities/appointment';
import ICreateAppointmentsDTO from '../dtos/ICreateAppointmentsDTO';
import IFindAllBarbersInMonthDTO from '../dtos/IFindAllBarbersInMonthDTO';
import IFindAllBarbersInDayDTO from '../dtos/IFindAllBarbersInDayDTO';

export default interface IAppointmentsRepositories {
  create(data: ICreateAppointmentsDTO): Promise<Appointments>;
  findByDate(
    date: Date,
    provider_id: string,
  ): Promise<Appointments | undefined>;
  findAllBarbersInMonth(
    data: IFindAllBarbersInMonthDTO,
  ): Promise<Appointments[]>;
  findAllBarbersInDay(data: IFindAllBarbersInDayDTO): Promise<Appointments[]>;
}
