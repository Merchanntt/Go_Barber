import { Request, Response } from 'express';
import { container } from 'tsyringe';

import FindBarberDayAvaliabilityService from '@modules/appointments/services/FindBarberDayAvaliabilityService';

export default class FindBarberDayAvaliabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;
    const { month, year, day } = request.query;

    const findBarber = container.resolve(FindBarberDayAvaliabilityService);

    const appointment = await findBarber.execute({
      provider_id,
      year: Number(year),
      month: Number(month),
      day: Number(day),
    });

    return response.json(appointment);
  }
}
