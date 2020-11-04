import ICacheProvider from '../models/ICacheProvider';

interface IResponseData {
  [key: string]: string;
}

export default class FakeCacheProvider implements ICacheProvider {
  private cache: IResponseData = {};

  public async save(key: string, value: string): Promise<void> {
    this.cache[key] = JSON.stringify(value);
  }

  public async recover<t>(key: string): Promise<t | null> {
    const data = this.cache[key];

    if (!data) {
      return null;
    }

    const parseData = JSON.parse(data) as t;

    return parseData;
  }

  public async invalidate(key: string): Promise<void> {
    delete this.cache[key];
  }

  public async invalidatePrefix(prefix: string): Promise<void> {
    const keys = Object.keys(this.cache).filter(key =>
      key.startsWith(`${prefix}:`),
    );

    keys.forEach(key => {
      delete this.cache[key];
    });
  }
}
