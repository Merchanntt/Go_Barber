import AppError from '@shared/error/appError';

import FakeCacheProvider from '@shared/container/providers/cacheProvider/fakes/FakeCacheProvider';
import FakeUserRepository from '../repositories/fakes/FakeUserRepositories';
import FakeHashProvider from '../providers/hashProvider/fakes/FakeHashGenerator';
import CreateUserService from './CreateUserService';

let fakeUserRespository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateUserService', () => {
  beforeEach(() => {
    fakeUserRespository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();

    createUserService = new CreateUserService(
      fakeUserRespository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });
  it('Should be able to create a new user', async () => {
    const newUser = await createUserService.execute({
      name: 'Jane Doe',
      email: 'janedoe@gmail.com',
      password: '123456',
    });
    expect(newUser).toHaveProperty('id');
  });
  it("Shouldn't be able to create a new user, if an existing email", async () => {
    await createUserService.execute({
      name: 'Jane Doe',
      email: 'janedoe@gmail.com',
      password: '123456',
    });
    await expect(
      createUserService.execute({
        name: 'Jane Doe',
        email: 'janedoe@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
