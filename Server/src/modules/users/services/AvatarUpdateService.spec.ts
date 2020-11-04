import AppError from '@shared/error/appError';

import FakeStorageProvider from '@shared/container/providers/storageProvider/fakes/FakeDiskProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUserRepositories';
import UpdateUserAvatar from './AvatarUpdateService';

let fakeStorageProvider: FakeStorageProvider;
let fakeUserRepositories: FakeUsersRepository;

let updateUserAvatar: UpdateUserAvatar;

describe('Avatar image update', () => {
  beforeEach(() => {
    fakeStorageProvider = new FakeStorageProvider();
    fakeUserRepositories = new FakeUsersRepository();

    updateUserAvatar = new UpdateUserAvatar(
      fakeUserRepositories,
      fakeStorageProvider,
    );
  });

  it('Should be able to change and store a new avatar image', async () => {
    const user = await fakeUserRepositories.create({
      name: 'Jane Doe',
      email: 'janedoe@gmail.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'avatar.jpg',
    });

    expect(user.avatar).toBe('avatar.jpg');
  });
  it("Shouldn't be able to change avatar image, from a nonexistent user", async () => {
    await expect(
      updateUserAvatar.execute({
        user_id: 'none',
        avatarFileName: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('Should be able to change and store a new avatar image', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUserRepositories.create({
      name: 'Jane Doe',
      email: 'janedoe@gmail.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'avatar.jpg',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'avatar2.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
    expect(user.avatar).toBe('avatar2.jpg');
  });
});
