import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import ListBarberAppointmentsService from '@modules/appointments/services/ListBarberAppointmentsService';

export default class BarberAppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const provider_id = request.user.id;
    const { day, year, month } = request.query;

    const ListAppointmentsInDay = container.resolve(
      ListBarberAppointmentsService,
    );

    const appointments = await ListAppointmentsInDay.execute({
      provider_id,
      day: Number(day),
      month: Number(month),
      year: Number(year),
    });

    return response.json(classToClass(appointments));
  }
}
