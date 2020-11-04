import { Request, Response } from 'express';

import { container } from 'tsyringe';

import sendForgetPasswordEmailService from '@modules/users/services/SendForgetPasswordEmailService';

export default class ForgotPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;

    const userAuthentication = container.resolve(
      sendForgetPasswordEmailService,
    );

    await userAuthentication.execute({
      email,
    });

    return response.status(204).json();
  }
}
