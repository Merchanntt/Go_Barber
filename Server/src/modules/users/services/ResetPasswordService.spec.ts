import AppError from '@shared/error/appError';

import FakeUserRepository from '../repositories/fakes/FakeUserRepositories';
import FakeUserTolkenRepository from '../repositories/fakes/FakeUserTolkenRepositories';
import FakeHashProvider from '../providers/hashProvider/fakes/FakeHashGenerator';
import ResetPasswordService from './ResetPasswordService';

let fakeUserRespository: FakeUserRepository;
let fakeUserTolkenRepository: FakeUserTolkenRepository;
let resetPasswordService: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;

describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeUserRespository = new FakeUserRepository();
    fakeUserTolkenRepository = new FakeUserTolkenRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPasswordService = new ResetPasswordService(
      fakeUserRespository,
      fakeUserTolkenRepository,
      fakeHashProvider,
    );
  });

  it('Should be able to change password', async () => {
    const user = await fakeUserRespository.create({
      name: 'Jane Doe',
      email: 'janedoe@gmail.com',
      password: '123456',
    });

    const { token } = await fakeUserTolkenRepository.generate(user.id);

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPasswordService.execute({
      password: '123123',
      token,
    });

    const resetedUser = await fakeUserRespository.findById(user.id);

    expect(generateHash).toHaveBeenCalledWith('123123');
    expect(resetedUser?.password).toBe('123123');
  });

  it("Shouldn't be able to change password with a nonexisting tolken", async () => {
    await expect(
      resetPasswordService.execute({
        password: '123123',
        token: 'NonExisting',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("Shouldn't be able to change password with a nonexisting user", async () => {
    const { token } = await fakeUserTolkenRepository.generate(
      'nonExistingToken',
    );

    await expect(
      resetPasswordService.execute({
        password: '123123',
        token,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("Shouldn't be able to reset password after 2 hours", async () => {
    const user = await fakeUserRespository.create({
      name: 'Jane Doe',
      email: 'janedoe@gmail.com',
      password: '123456',
    });

    const { token } = await fakeUserTolkenRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPasswordService.execute({
        password: '123123',
        token,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
