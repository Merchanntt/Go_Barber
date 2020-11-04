import IEmailProvider from '../models/IEmailProvider';
import ISendMail from '../dtos/ISendMail';

export default class FakeMailProvider implements IEmailProvider {
  private massage: ISendMail[] = [];

  public async sendMail(message: ISendMail): Promise<void> {
    this.massage.push(message);
  }
}
