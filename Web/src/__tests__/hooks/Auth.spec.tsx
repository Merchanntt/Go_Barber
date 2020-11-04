import { act, renderHook } from '@testing-library/react-hooks';
import MockAdapter from 'axios-mock-adapter';

import { AuthProvider, useAuth } from '../../hooks/authContext';
import api from '../../services/api';

const fakeApi = new MockAdapter(api);

describe('Auth hook', () => {
  it('Should be able to sign In', async () => {
    const apiResponse = {
      user: {
        id: 'user-123',
        name: 'Jane Doe',
        email: 'janedoe@test.com',
      },
      token: 'token-123',
    };

    fakeApi.onPost('sessions').reply(200, apiResponse);

    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    result.current.signIn({
      email: 'janedoe@test.com',
      password: '123123',
    });

    await waitForNextUpdate();

    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:token',
      apiResponse.token,
    );
    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(apiResponse.user),
    );

    expect(result.current.user.email).toEqual('janedoe@test.com');
  });

  it('Should be able to restore user from the storage', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      switch (key) {
        case '@GoBarber:token':
          return 'token-123';

        case '@GoBarber:user':
          return JSON.stringify({
            id: 'user-123',
            name: 'Jane Doe',
            email: 'janedoe@test.com',
          });

        default:
          return null;
      }
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.user.email).toEqual('janedoe@test.com');
  });

  it('Should be able to delete user from the storage', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      switch (key) {
        case '@GoBarber:token':
          return 'token-123';

        case '@GoBarber:user':
          return JSON.stringify({
            id: 'user-123',
            name: 'Jane Doe',
            email: 'janedoe@test.com',
          });

        default:
          return null;
      }
    });

    const deleteItemSpy = jest.spyOn(Storage.prototype, 'removeItem');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.signOut();
    });

    expect(deleteItemSpy).toHaveBeenCalledTimes(2);
    expect(result.current.user).toBeUndefined();
  });

  it('Should be able to update user data', () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    const user = {
      id: 'user-123',
      name: 'Jane Doe',
      email: 'janedoe@test.com',
      avatar_url: 'avatar.jpg',
    };

    act(() => {
      result.current.updateUser(user);
    });

    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(user),
    );
    expect(result.current.user).toEqual(user);
  });
});
