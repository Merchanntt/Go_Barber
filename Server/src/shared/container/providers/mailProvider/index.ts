import { container } from 'tsyringe';
import mailConfig from '@config/mail';
import IEmailProvider from './models/IEmailProvider';

import EtherialMailProvider from './implementations/EtherialMailProvider';
import SESMailProvider from './implementations/SESMailProvider';

const provider = {
  ethereal: container.resolve(EtherialMailProvider),
  ses: container.resolve(SESMailProvider),
};

container.registerInstance<IEmailProvider>(
  'MailProvider',
  provider[mailConfig.driver],
);
