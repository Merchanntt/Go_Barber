import { container } from 'tsyringe';
import { Request, Response } from 'express';
import { classToClass } from 'class-transformer';

import UserUpdateService from '@modules/users/services/UserProfileUpdateService';
import ShowProfileService from '@modules/users/services/ShowProfileService';

export default class UserUpdateProfile {
  public async show(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const userRequest = container.resolve(ShowProfileService);

    const user = await userRequest.execute({ user_id });

    return response.json(classToClass(user));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { name, email, old_password, password } = request.body;

    const userUpdate = container.resolve(UserUpdateService);

    const user = await userUpdate.execute({
      user_id,
      name,
      email,
      old_password,
      password,
    });

    return response.json(classToClass(user));
  }
}
