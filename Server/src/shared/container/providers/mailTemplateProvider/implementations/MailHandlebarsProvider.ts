import handlebars from 'handlebars';
import fs from 'fs';

import IMailTemplate from '../models/IMailTemplate';
import IParseProviderDTO from '../dtos/IParseProviderDTO';

class MailHandlebarsTemplateProvider implements IMailTemplate {
  public async parse({ file, variables }: IParseProviderDTO): Promise<string> {
    const templateContent = await fs.promises.readFile(file, {
      encoding: 'UTF-8',
    });

    const mailTemplate = handlebars.compile(templateContent);

    return mailTemplate(variables);
  }
}

export default MailHandlebarsTemplateProvider;
