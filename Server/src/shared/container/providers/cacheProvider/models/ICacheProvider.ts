export default interface ICacheProvider {
  save(key: string, value: any): Promise<void>;
  recover<t>(key: string): Promise<t | null>;
  invalidate(key: string): Promise<void>;
  invalidatePrefix(prefix: string): Promise<void>;
}
