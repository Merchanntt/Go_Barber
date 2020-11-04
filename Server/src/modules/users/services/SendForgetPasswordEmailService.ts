import { inject, injectable } from 'tsyringe';
import path from 'path';

import IUserRepositories from '@modules/users/repositories/IUserRepositories';
import IEmailProvider from '@shared/container/providers/mailProvider/models/IEmailProvider';
import AppError from '@shared/error/appError';
import IUserTolkenRepositories from '../repositories/ITolkenRepository';

interface IRequest {
  email: string;
}

@injectable()
class SendForgetPasswordEmail {
  constructor(
    @inject('CreateUsersRepository')
    private userRepository: IUserRepositories,

    @inject('MailProvider')
    private mailProvider: IEmailProvider,

    @inject('CreateTokenRepository')
    private tolkenRepository: IUserTolkenRepositories,
  ) {}

  public async execute({ email }: IRequest): Promise<void> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError("Email doesn't existis");
    }

    const { token } = await this.tolkenRepository.generate(user.id);

    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'Forgot_password.hbs',
    );

    await this.mailProvider.sendMail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: '[Go Barber] Recuperação de senha.',
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: user.name,
          link: `${process.env.APP_WEB_URL}/reset_password?token=${token}`,
        },
      },
    });
  }
}

export default SendForgetPasswordEmail;
