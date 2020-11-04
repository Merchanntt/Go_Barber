import { container } from 'tsyringe';

import IHashProvider from './hashProvider/model/IHashProvider';
import BCryptProvider from './hashProvider/implementations/BCryptHashProvider';

container.registerSingleton<IHashProvider>('HashProvider', BCryptProvider);
