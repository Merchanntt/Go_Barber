import AppError from '@shared/error/appError';

import FakeUsersRepository from '../repositories/fakes/FakeUserRepositories';
import ShowProfileService from './ShowProfileService';

let fakeUserRepositories: FakeUsersRepository;
let showProfileService: ShowProfileService;

describe('User profile update', () => {
  beforeEach(() => {
    fakeUserRepositories = new FakeUsersRepository();

    showProfileService = new ShowProfileService(fakeUserRepositories);
  });

  it('Should be able to show profile', async () => {
    const user = await fakeUserRepositories.create({
      name: 'Jane Doe',
      email: 'janedoe@gmail.com',
      password: '123456',
    });

    const profile = await showProfileService.execute({
      user_id: user.id,
    });

    expect(profile.name).toBe('Jane Doe');
    expect(profile.email).toBe('janedoe@gmail.com');
  });

  it("Shouldn't be able to show profile from a nonexisting user", async () => {
    await expect(
      showProfileService.execute({
        user_id: '123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
