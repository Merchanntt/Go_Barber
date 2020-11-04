import { container } from 'tsyringe';
import { Request, Response } from 'express';
import { classToClass } from 'class-transformer';

import CreateUser from '@modules/users/services/CreateUserService';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const createNewUser = container.resolve(CreateUser);

    const user = await createNewUser.execute({
      name,
      email,
      password,
    });

    return response.json(classToClass(user));
  }
}
