import ISendMailDTO from '@shared/container/providers/mailProvider/dtos/ISendMail';

export default interface IEmailProvider {
  sendMail(data: ISendMailDTO): Promise<void>;
}
