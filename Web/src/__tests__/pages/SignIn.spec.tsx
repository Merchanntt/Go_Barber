import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import SignIn from '../../pages/SignIn';

const mockedHistoryPush = jest.fn();
const mockSignIn = jest.fn();
const mockAddToast = jest.fn();

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: mockedHistoryPush,
  }),
  Link: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('../../hooks/authContext', () => ({
  useAuth: () => ({
    signIn: mockSignIn,
  }),
}));

jest.mock('../../hooks/toast', () => ({
  useToast: () => ({
    addToast: mockAddToast,
  }),
}));

describe('SignIn Functions', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
  });

  it('Should be able to sign In', async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailInput = getByPlaceholderText('E-mail');
    const senhaInput = getByPlaceholderText('Senha');

    const button = getByText('Entrar');

    fireEvent.change(emailInput, { target: { value: 'janedoe@test.com' } });
    fireEvent.change(senhaInput, { target: { value: '123123' } });

    fireEvent.click(button);

    await wait(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it("Shouldn't be able to sign In with invalid credentials", async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailInput = getByPlaceholderText('E-mail');
    const senhaInput = getByPlaceholderText('Senha');

    const button = getByText('Entrar');

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(senhaInput, { target: { value: '123123' } });

    fireEvent.click(button);

    await wait(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled();
    });
  });

  it('Should throw a new error toast', async () => {
    mockSignIn.mockImplementation(() => {
      throw new Error();
    });

    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailInput = getByPlaceholderText('E-mail');
    const senhaInput = getByPlaceholderText('Senha');

    const button = getByText('Entrar');

    fireEvent.change(emailInput, { target: { value: 'janedoe@test.com' } });
    fireEvent.change(senhaInput, { target: { value: '123123' } });

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
