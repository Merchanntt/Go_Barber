import IParseTemplateProvider from '../dtos/IParseProviderDTO';

export default interface IMailTemplate {
  parse(data: IParseTemplateProvider): Promise<string>;
}
