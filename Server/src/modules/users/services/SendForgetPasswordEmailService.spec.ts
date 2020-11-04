import AppError from '@shared/error/appError';

import FakeEmailProvider from '@shared/container/providers/mailProvider/fakes/FakeMailProvider';
import FakeUserRepository from '../repositories/fakes/FakeUserRepositories';
import FakeUserTolkenRepository from '../repositories/fakes/FakeUserTolkenRepositories';
import SendForgetPasswordEmailService from './SendForgetPasswordEmailService';

let fakeUserRespository: FakeUserRepository;
let fakeUserTolkenRepository: FakeUserTolkenRepository;
let fakeEmailProvider: FakeEmailProvider;
let sendForgetPasswordEmailService: SendForgetPasswordEmailService;

describe('SendForgetPasswordEmailService', () => {
  beforeEach(() => {
    fakeUserRespository = new FakeUserRepository();
    fakeEmailProvider = new FakeEmailProvider();
    fakeUserTolkenRepository = new FakeUserTolkenRepository();

    sendForgetPasswordEmailService = new SendForgetPasswordEmailService(
      fakeUserRespository,
      fakeEmailProvider,
      fakeUserTolkenRepository,
    );
  });

  it('Should be able recover password using the email', async () => {
    const sendMail = jest.spyOn(fakeEmailProvider, 'sendMail');

    await fakeUserRespository.create({
      name: 'Jane Doe',
      email: 'janedoe@gmail.com',
      password: '123456',
    });

    await sendForgetPasswordEmailService.execute({
      email: 'janedoe@gmail.com',
    });
    expect(sendMail).toBeCalled();
  });
  it("Shoudn't be able to recover password from a nonexisting email", async () => {
    await expect(
      sendForgetPasswordEmailService.execute({
        email: 'janedoe@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('Should be able to create a recover tolken', async () => {
    const generate = jest.spyOn(fakeUserTolkenRepository, 'generate');

    const user = await fakeUserRespository.create({
      name: 'Jane Doe',
      email: 'janedoe@gmail.com',
      password: '123456',
    });

    await sendForgetPasswordEmailService.execute({
      email: 'janedoe@gmail.com',
    });
    expect(generate).toBeCalledWith(user.id);
  });
});
