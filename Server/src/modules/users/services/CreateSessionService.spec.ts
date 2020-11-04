import AppError from '@shared/error/appError';

import FakeCacheProvider from '@shared/container/providers/cacheProvider/fakes/FakeCacheProvider';
import FakeUserRepository from '../repositories/fakes/FakeUserRepositories';
import CreateSessionService from './CreateSessionService';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/hashProvider/fakes/FakeHashGenerator';

let fakeUserRespository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;

let createUserService: CreateUserService;
let createSessionService: CreateSessionService;

describe('CreateSessionService', () => {
  beforeEach(() => {
    fakeUserRespository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();

    createUserService = new CreateUserService(
      fakeUserRespository,
      fakeHashProvider,
      fakeCacheProvider,
    );
    createSessionService = new CreateSessionService(
      fakeUserRespository,
      fakeHashProvider,
    );
  });

  it('Should be able to create an authenticated session', async () => {
    await createUserService.execute({
      name: 'Jane Doe',
      email: 'janedoe@gmail.com',
      password: '123456',
    });

    const newSession = await createSessionService.execute({
      email: 'janedoe@gmail.com',
      password: '123456',
    });
    expect(newSession).toHaveProperty('token');
  });
  it("Shouldn't be able to logIn without an user", async () => {
    await expect(
      createSessionService.execute({
        email: 'janedoe@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it("Shouldn't be able to logIn, with a wrong password", async () => {
    await createUserService.execute({
      name: 'Jane Doe',
      email: 'janedoe@gmail.com',
      password: '123456',
    });

    await expect(
      createSessionService.execute({
        email: 'janedoe@gmail.com',
        password: 'wrongPassword',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
