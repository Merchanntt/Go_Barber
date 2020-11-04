import AppError from '@shared/error/appError';

import FakeNotificationRepository from '@modules/notifications/repositories/fakes/FakeNotificationRepository';
import FakeCacheProvider from '@shared/container/providers/cacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRepositories from '../repositories/fakes/FakeAppointmetsRepository';
import CreateAppointments from './CreateAppointments';

let fakeAppointmentsRepositories: FakeAppointmentsRepositories;
let fakeNotificationRepository: FakeNotificationRepository;
let createAppointments: CreateAppointments;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateAppointments', () => {
  beforeEach(() => {
    fakeAppointmentsRepositories = new FakeAppointmentsRepositories();
    fakeNotificationRepository = new FakeNotificationRepository();
    fakeCacheProvider = new FakeCacheProvider();

    createAppointments = new CreateAppointments(
      fakeAppointmentsRepositories,
      fakeNotificationRepository,
      fakeCacheProvider,
    );
  });
  it('Should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 1, 12).getTime();
    });

    const newAppointments = await createAppointments.execute({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2020, 5, 1, 13),
    });

    expect(newAppointments).toHaveProperty('id');
    expect(newAppointments.provider_id).toBe('provider_id');
  });
  it("Shouldn't be able to create an new appointment in same date", async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 1, 12).getTime();
    });

    await createAppointments.execute({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2020, 5, 1, 13),
    });

    await expect(
      createAppointments.execute({
        provider_id: 'provider_id',
        user_id: 'user_id',
        date: new Date(2020, 5, 1, 13),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it("Shouldn't be able to create an new appointment in a past date", async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 1, 12).getTime();
    });

    await expect(
      createAppointments.execute({
        provider_id: 'provider_id',
        user_id: 'user_id',
        date: new Date(2020, 4, 1, 11),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it("Shouldn't be able to create an new appointment with same user/provider", async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 1, 12).getTime();
    });

    await expect(
      createAppointments.execute({
        provider_id: 'provider_id',
        user_id: 'provider_id',
        date: new Date(2020, 4, 1, 13),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it("Shouldn't be able to create an new appointment before 8am and after 5pm", async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 1, 12).getTime();
    });

    await expect(
      createAppointments.execute({
        provider_id: 'provider_id',
        user_id: 'user_id',
        date: new Date(2020, 4, 2, 7),
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointments.execute({
        provider_id: 'provider_id',
        user_id: 'user_id',
        date: new Date(2020, 4, 2, 18),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
