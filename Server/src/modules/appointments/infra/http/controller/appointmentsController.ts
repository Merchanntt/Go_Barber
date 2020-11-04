import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateAppointments from '@modules/appointments/services/CreateAppointments';

export default class AppointmentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { provider_id, date } = request.body;

    const createNewAppointmente = container.resolve(CreateAppointments);

    const appointment = await createNewAppointmente.execute({
      date,
      provider_id,
      user_id,
    });

    return response.json(appointment);
  }
}
