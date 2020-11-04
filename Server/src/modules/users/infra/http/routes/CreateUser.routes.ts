import Router from 'express';
import multer from 'multer';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/middleWare/ensureAuthenticated';
import upload from '@config/upload';
import UsersController from '../controller/UsersController';
import AvatarController from '../controller/avatarController';

const usersRouter = Router();

const userController = new UsersController();
const avatarController = new AvatarController();
const uploadAvatar = multer(upload.multer);

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  userController.create,
);

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  uploadAvatar.single('avatar'),
  avatarController.update,
);

export default usersRouter;
