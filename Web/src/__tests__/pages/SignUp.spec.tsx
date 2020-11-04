import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import SignUp from '../../pages/SignUp';

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

  it('Should be able to create a new account', async () => {
    fakeApi.onPost('/users').reply(200);

    const { getByPlaceholderText, getByText } = render(<SignUp />);

    const nameInput = getByPlaceholderText('Nome');
    const emailInput = getByPlaceholderText('E-mail');
    const passwordInput = getByPlaceholderText('Senha');

    const button = getByText('Cadastrar');

    fireEvent.change(nameInput, { target: { value: 'Jane doe' } });
    fireEvent.change(emailInput, { target: { value: 'janedoe@test.com' } });
    fireEvent.change(passwordInput, { target: { value: '123123' } });

    fireEvent.click(button);

    await wait(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/');
    });
  });

  it("Shouldn't be able to create an account with invalid credentials", async () => {
    const { getByPlaceholderText, getByText } = render(<SignUp />);

    const nameInput = getByPlaceholderText('Nome');
    const emailInput = getByPlaceholderText('E-mail');
    const passwordInput = getByPlaceholderText('Senha');

    const button = getByText('Cadastrar');

    fireEvent.change(nameInput, { target: { value: 'Jane doe' } });
    fireEvent.change(emailInput, { target: { value: 'not-valid-email' } });
    fireEvent.change(passwordInput, { target: { value: '123123' } });

    fireEvent.click(button);

    await wait(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled();
    });
  });

  it('Should throw a new error toast', async () => {
    fakeApi.onPost('/users').networkError();

    const { getByPlaceholderText, getByText } = render(<SignUp />);

    const nameInput = getByPlaceholderText('Nome');
    const emailInput = getByPlaceholderText('E-mail');
    const passwordInput = getByPlaceholderText('Senha');

    const button = getByText('Cadastrar');

    fireEvent.change(nameInput, { target: { value: 'Jane doe' } });
    fireEvent.change(emailInput, { target: { value: 'janedoe@test.com' } });
    fireEvent.change(passwordInput, { target: { value: '123123' } });

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
