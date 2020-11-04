import AppError from '@shared/error/appError';

import FakeHashGenerator from '../providers/hashProvider/fakes/FakeHashGenerator';
import FakeUsersRepository from '../repositories/fakes/FakeUserRepositories';
import UserProfileUpdateService from './UserProfileUpdateService';

let fakeHashGenerator: FakeHashGenerator;
let fakeUserRepositories: FakeUsersRepository;
let userProfileUpdateService: UserProfileUpdateService;

describe('User profile update', () => {
  beforeEach(() => {
    fakeHashGenerator = new FakeHashGenerator();
    fakeUserRepositories = new FakeUsersRepository();

    userProfileUpdateService = new UserProfileUpdateService(
      fakeUserRepositories,
      fakeHashGenerator,
    );
  });

  it('Should be able to update informations', async () => {
    const user = await fakeUserRepositories.create({
      name: 'Jane Doe',
      email: 'janedoe@gmail.com',
      password: '123456',
    });

    const userUpate = await userProfileUpdateService.execute({
      user_id: user.id,
      name: 'Jane',
      email: 'janedoe@outlook.com',
    });

    expect(userUpate.name).toBe('Jane');
    expect(userUpate.email).toBe('janedoe@outlook.com');
  });

  it("Shouldn't be able to update informations withou an user", async () => {
    await expect(
      userProfileUpdateService.execute({
        user_id: '123',
        name: 'Jane',
        email: 'janedoe@outlook.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("Shouldn't be able to update another email", async () => {
    await fakeUserRepositories.create({
      name: 'Jane Doe',
      email: 'janedoe@gmail.com',
      password: '123456',
    });

    const user = await fakeUserRepositories.create({
      name: 'Jhon Doe',
      email: 'jhondoe@gmail.com',
      password: '123456',
    });

    await expect(
      userProfileUpdateService.execute({
        user_id: user.id,
        name: 'Jane Doe',
        email: 'janedoe@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should be able to update password', async () => {
    const user = await fakeUserRepositories.create({
      name: 'Jane Doe',
      email: 'janedoe@gmail.com',
      password: '123456',
    });

    const userUpate = await userProfileUpdateService.execute({
      user_id: user.id,
      name: 'Jane',
      email: 'janedoe@outlook.com',
      old_password: '123456',
      password: '123123',
    });

    expect(userUpate.password).toBe('123123');
  });

  it("Shouldn't be able to update password without the older one", async () => {
    const user = await fakeUserRepositories.create({
      name: 'Jane Doe',
      email: 'janedoe@gmail.com',
      password: '123456',
    });

    await expect(
      userProfileUpdateService.execute({
        user_id: user.id,
        name: 'Jane',
        email: 'janedoe@outlook.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("Shouldn't be able to update password with a wrong old password", async () => {
    const user = await fakeUserRepositories.create({
      name: 'Jane Doe',
      email: 'janedoe@gmail.com',
      password: '123456',
    });

    await expect(
      userProfileUpdateService.execute({
        user_id: user.id,
        name: 'Jane',
        email: 'janedoe@outlook.com',
        old_password: 'wrong_password',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
