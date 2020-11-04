import FindBarberDayAvaliabilityService from './FindBarberDayAvaliabilityService';
import FakeAppointmetsRepository from '../repositories/fakes/FakeAppointmetsRepository';

let fakeAppointmetsRepository: FakeAppointmetsRepository;
let findBarberDayAvaliabilityService: FindBarberDayAvaliabilityService;

describe("Barber's Profile", () => {
  beforeEach(() => {
    fakeAppointmetsRepository = new FakeAppointmetsRepository();
    findBarberDayAvaliabilityService = new FindBarberDayAvaliabilityService(
      fakeAppointmetsRepository,
    );
  });

  it("Should be able to show barber's day availability", async () => {
    await fakeAppointmetsRepository.create({
      user_id: '121212',
      provider_id: 'user',
      date: new Date(2020, 5, 1, 14, 0, 0),
    });

    await fakeAppointmetsRepository.create({
      user_id: '121212',
      provider_id: 'user',
      date: new Date(2020, 5, 1, 15, 0, 0),
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 1, 11).getTime();
    });

    const available = await findBarberDayAvaliabilityService.execute({
      provider_id: 'user',
      day: 1,
      month: 6,
      year: 2020,
    });

    expect(available).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: false },
        { hour: 10, available: false },
        { hour: 11, available: false },
        { hour: 12, available: true },
        { hour: 14, available: false },
        { hour: 15, available: false },
        { hour: 16, available: true },
      ]),
    );
  });
});
