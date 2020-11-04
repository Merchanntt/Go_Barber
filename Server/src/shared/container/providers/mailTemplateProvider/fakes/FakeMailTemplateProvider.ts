import IMailTemplate from '../models/IMailTemplate';

export default class FakeMailTemplateProvider implements IMailTemplate {
  public async parse(): Promise<string> {
    return 'Messsage';
  }
}
