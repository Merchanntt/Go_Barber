import IMailTemplateDTO from '@shared/container/providers/mailTemplateProvider/dtos/IParseProviderDTO';

interface IMailContact {
  name: string;
  email: string;
}

export default interface ISendMail {
  to: IMailContact;
  from?: IMailContact;
  subject: string;
  templateData: IMailTemplateDTO;
}
