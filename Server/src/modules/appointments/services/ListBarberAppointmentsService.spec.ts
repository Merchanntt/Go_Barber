import FakeCacheProvider from '@shared/container/providers/cacheProvider/fakes/FakeCacheProvider';
import ListBarberAppointmentsService from './ListBarberAppointmentsService';
import FakeAppointmetsRepository from '../repositories/fakes/FakeAppointmetsRepository';

let fakeAppointmetsRepository: FakeAppointmetsRepository;
let listBarberAppointmentsService: ListBarberAppointmentsService;
let fakeCacheProvider: FakeCacheProvider;

describe("Barber's Schedule", () => {
  beforeEach(() => {
    fakeAppointmetsRepository = new FakeAppointmetsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listBarberAppointmentsService = new ListBarberAppointmentsService(
      fakeAppointmetsRepository,
      fakeCacheProvider,
    );
  });

  it("Should be able to show barber's day schedule", async () => {
    const appointment1 = await fakeAppointmetsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2020, 5, 1, 8, 0, 0),
    });

    const appointment2 = await fakeAppointmetsRepository.create({
      provider_id: 'provider',
      user_id: 'user2',
      date: new Date(2020, 5, 1, 10, 0, 0),
    });

    const schedule = await listBarberAppointmentsService.execute({
      provider_id: 'provider',
      day: 1,
      month: 6,
      year: 2020,
    });

    expect(schedule).toEqual([appointment1, appointment2]);
  });
});
