import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/middleWare/ensureAuthenticated';
import FindBarbersController from '../controller/FindBarbersController';
import BarberMonthAvaliabilityController from '../controller/BarberMonthAvaliabilityController';
import BarberDayAvaliabilityController from '../controller/BarberDayAvaliabilityController';

const BarbersRouter = Router();
const findBarbersController = new FindBarbersController();
const barberMonthAvaliabilityController = new BarberMonthAvaliabilityController();
const barberDayAvaliabilityController = new BarberDayAvaliabilityController();

BarbersRouter.use(ensureAuthenticated);

BarbersRouter.get('/', findBarbersController.index);
BarbersRouter.get(
  '/:provider_id/month-availability',
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required(),
    },
  }),
  barberMonthAvaliabilityController.index,
);
BarbersRouter.get(
  '/:provider_id/day-availability',
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required(),
    },
  }),
  barberDayAvaliabilityController.index,
);

export default BarbersRouter;
