import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/middleWare/ensureAuthenticated';
import AppointmentsController from '../controller/appointmentsController';
import BarberAppointmentsController from '../controller/BarberAppointmentsController';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();
const barberAppointmentsController = new BarberAppointmentsController();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      provider_id: Joi.string().uuid().required(),
      date: Joi.date(),
    },
  }),
  appointmentsController.create,
);
appointmentsRouter.get('/schedule', barberAppointmentsController.index);

export default appointmentsRouter;
