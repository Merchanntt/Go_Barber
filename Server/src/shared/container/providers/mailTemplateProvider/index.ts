import { container } from 'tsyringe';

import IMailTemplateProvider from './models/IMailTemplate';
import MailHandlebarsProvider from './implementations/MailHandlebarsProvider';

const provider = {
  handlebars: MailHandlebarsProvider,
};

container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  provider.handlebars,
);
