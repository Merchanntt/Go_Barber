import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import ResetPassword from '../../pages/ResetPassword';

import api from '../../services/api';

const fakeApi = new MockAdapter(api);

const mockedHistoryPush = jest.fn();
const mockAddToast = jest.fn();

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: mockedHistoryPush,
  }),
  useLocation: () => ({
    search: () => ({
      replace: () => '',
    }),
  }),
}));

jest.mock('../../hooks/toast', () => ({
  useToast: () => ({
    addToast: mockAddToast,
  }),
}));

describe('ForgetPassword Functions', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
  });

  it('Should be able to reset password', async () => {
    fakeApi.onPost('/password/reset').reply(200);

    const { getByPlaceholderText, getByText } = render(<ResetPassword />);

    const passwordInput = getByPlaceholderText('Nova senha');
    const confirmationPasswordInput = getByPlaceholderText('Confirmar senha');

    const button = getByText('Recuperar');

    fireEvent.change(passwordInput, {
      target: { value: '123123' },
    });
    fireEvent.change(confirmationPasswordInput, {
      target: { value: '123123' },
    });

    fireEvent.click(button);

    await wait(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/');
    });
  });

  it("Shouldn't be able to send reset password invalid credentials", async () => {
    const { getByPlaceholderText, getByText } = render(<ResetPassword />);

    const passwordInput = getByPlaceholderText('Nova senha');
    const confirmationPasswordInput = getByPlaceholderText('Confirmar senha');

    const button = getByText('Recuperar');

    fireEvent.change(passwordInput, { target: { value: 'short' } });
    fireEvent.change(confirmationPasswordInput, {
      target: { value: 'pass' },
    });

    fireEvent.click(button);

    await wait(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled();
    });
  });

  it('Should throw a new error toast', async () => {
    fakeApi.onPost('/password/reset').networkError();

    const { getByPlaceholderText, getByText } = render(<ResetPassword />);

    const passwordInput = getByPlaceholderText('Nova senha');
    const confirmationPasswordInput = getByPlaceholderText('Confirmar senha');

    const button = getByText('Recuperar');

    fireEvent.change(passwordInput, { target: { value: '123123' } });
    fireEvent.change(confirmationPasswordInput, {
      target: { value: '123123' },
    });

    fireEvent.click(button);

    await wait(() => {
      expect(mockAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });
  });
});
