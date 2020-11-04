import FindBarberMonthAvaliabilityService from './FindBarberMonthAvaliabilityService';
import FakeAppointmetsRepository from '../repositories/fakes/FakeAppointmetsRepository';

let fakeAppointmetsRepository: FakeAppointmetsRepository;
let findBarberMonthAvaliabilityService: FindBarberMonthAvaliabilityService;

describe("Barber's Profile", () => {
  beforeEach(() => {
    fakeAppointmetsRepository = new FakeAppointmetsRepository();
    findBarberMonthAvaliabilityService = new FindBarberMonthAvaliabilityService(
      fakeAppointmetsRepository,
    );
  });

  it("Should be able to show barber's month availability", async () => {
    await fakeAppointmetsRepository.create({
      provider_id: 'user',
      user_id: '121212',
      date: new Date(2020, 5, 1, 8, 0, 0),
    });

    await fakeAppointmetsRepository.create({
      provider_id: 'user',
      user_id: '121212',
      date: new Date(2020, 5, 1, 9, 0, 0),
    });

    await fakeAppointmetsRepository.create({
      provider_id: 'user',
      user_id: '121212',
      date: new Date(2020, 5, 1, 10, 0, 0),
    });

    await fakeAppointmetsRepository.create({
      provider_id: 'user',
      user_id: '121212',
      date: new Date(2020, 5, 1, 11, 0, 0),
    });

    await fakeAppointmetsRepository.create({
      provider_id: 'user',
      user_id: '121212',
      date: new Date(2020, 5, 1, 12, 0, 0),
    });

    await fakeAppointmetsRepository.create({
      provider_id: 'user',
      user_id: '121212',
      date: new Date(2020, 5, 1, 13, 0, 0),
    });

    await fakeAppointmetsRepository.create({
      provider_id: 'user',
      user_id: '121212',
      date: new Date(2020, 5, 1, 14, 0, 0),
    });

    await fakeAppointmetsRepository.create({
      provider_id: 'user',
      user_id: '121212',
      date: new Date(2020, 5, 1, 15, 0, 0),
    });

    await fakeAppointmetsRepository.create({
      provider_id: 'user',
      user_id: '121212',
      date: new Date(2020, 5, 1, 16, 0, 0),
    });

    await fakeAppointmetsRepository.create({
      provider_id: 'user',
      user_id: '121212',
      date: new Date(2020, 5, 1, 17, 0, 0),
    });

    await fakeAppointmetsRepository.create({
      provider_id: 'user',
      user_id: '121212',
      date: new Date(2020, 5, 2, 8, 0, 0),
    });

    const available = await findBarberMonthAvaliabilityService.execute({
      provider_id: 'user',
      month: 6,
      year: 2020,
    });

    expect(available).toEqual(
      expect.arrayContaining([
        { day: 30, available: true },
        { day: 1, available: false },
        { day: 2, available: true },
        { day: 3, available: true },
      ]),
    );
  });
});
