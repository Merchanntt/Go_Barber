import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import FindBarberService from '@modules/appointments/services/FindBarberService';

export default class BarbersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const findBarber = container.resolve(FindBarberService);

    const barber = await findBarber.execute({
      user_id,
    });

    return response.json(classToClass(barber));
  }
}
