import FakeCacheProvider from '@shared/container/providers/cacheProvider/fakes/FakeCacheProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUserRepositories';
import FindBarberService from './FindBarberService';

let fakeUserRepositories: FakeUsersRepository;
let findBarberService: FindBarberService;
let fakeCacheProvider: FakeCacheProvider;

describe("Barber's Profile", () => {
  beforeEach(() => {
    fakeUserRepositories = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();

    findBarberService = new FindBarberService(
      fakeUserRepositories,
      fakeCacheProvider,
    );
  });

  it('Should be able to show barbers', async () => {
    const user1 = await fakeUserRepositories.create({
      name: 'Jane Doe',
      email: 'janedoe@gmail.com',
      password: '123456',
    });

    const user2 = await fakeUserRepositories.create({
      name: 'Jhon Doe',
      email: 'jhondoe@gmail.com',
      password: '123456',
    });

    const LoggedUser = await fakeUserRepositories.create({
      name: 'James Doe',
      email: 'jamesdoe@gmail.com',
      password: '123456',
    });

    const profile = await findBarberService.execute({
      user_id: LoggedUser.id,
    });

    expect(profile).toEqual([user1, user2]);
  });
});
