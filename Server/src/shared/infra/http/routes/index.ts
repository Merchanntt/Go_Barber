import { Router } from 'express';

import appointmentRouter from '@modules/appointments/infra/http/routes/appointments.routes';
import barbersRouter from '@modules/appointments/infra/http/routes/Barber.routes';
import usersRouter from '@modules/users/infra/http/routes/CreateUser.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import passwordRouter from '@modules/users/infra/http/routes/Password.routes';
import profileRouter from '@modules/users/infra/http/routes/Profile.routes';

const route = Router();

route.use('/appointments', appointmentRouter);
route.use('/users', usersRouter);
route.use('/barbers', barbersRouter);
route.use('/sessions', sessionsRouter);
route.use('/password', passwordRouter);
route.use('/profile', profileRouter);

export default route;
