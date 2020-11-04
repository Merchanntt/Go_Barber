import nodemailer, { Transporter } from 'nodemailer';
import { inject, injectable } from 'tsyringe';

import ISendMailDTO from '../dtos/ISendMail';
import IEmailProvider from '../models/IEmailProvider';
import IMailTemplateProvider from '../../mailTemplateProvider/models/IMailTemplate';

@injectable()
export default class EtherealMailProvider implements IEmailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'providenci.von52@ethereal.email',
        pass: 'uGaeV2TS4rWZzhkehk',
      },
    });

    this.client = transporter;
  }

  public async sendMail({
    to,
    from,
    subject,
    templateData,
  }: ISendMailDTO): Promise<void> {
    const message = await this.client.sendMail({
      from: {
        name: from?.name || 'Equipe GoBarber',
        address: from?.email || 'equipe@gobarber.com',
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await this.mailTemplateProvider.parse(templateData),
    });

    console.log('Message sent: %s', message.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
  }
}
