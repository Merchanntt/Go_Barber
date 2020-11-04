import { Request, Response } from 'express';
import { container } from 'tsyringe';

import FindBarberMonthAvaliabilityService from '@modules/appointments/services/FindBarberMonthAvaliabilityService';

export default class FindBarberMonthAvaliabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;
    const { month, year } = request.query;

    const findBarber = container.resolve(FindBarberMonthAvaliabilityService);

    const appointment = await findBarber.execute({
      provider_id,
      year: Number(year),
      month: Number(month),
    });

    return response.json(appointment);
  }
}
