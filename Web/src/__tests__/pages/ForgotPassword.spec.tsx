import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import ForgotPassword from '../../pages/ForgotPassword';

import api from '../../services/api';

const fakeApi = new MockAdapter(api);

const mockedHistoryPush = jest.fn();
const mockAddToast = jest.fn();

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: mockedHistoryPush,
  }),
  Link: ({ children }: { children: React.ReactNode }) => children,
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

  it('Should be able to send Email', async () => {
    fakeApi.onPost('/password/forgot').reply(200);

    const { getByPlaceholderText, getByText } = render(<ForgotPassword />);

    const emailInput = getByPlaceholderText('E-mail');

    const button = getByText('Recuperar');

    fireEvent.change(emailInput, { target: { value: 'janedoe@test.com' } });

    fireEvent.click(button);

    await wait(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/');
    });
  });

  it("Shouldn't be able to send email with invalid credentials", async () => {
    const { getByPlaceholderText, getByText } = render(<ForgotPassword />);

    const emailInput = getByPlaceholderText('E-mail');

    const button = getByText('Recuperar');

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

    fireEvent.click(button);

    await wait(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled();
    });
  });

  it('Should throw a new error toast', async () => {
    fakeApi.onPost('/password/forgot').networkError();

    const { getByPlaceholderText, getByText } = render(<ForgotPassword />);

    const emailInput = getByPlaceholderText('E-mail');

    const button = getByText('Recuperar');

    fireEvent.change(emailInput, { target: { value: 'janedoe@test.com' } });

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
