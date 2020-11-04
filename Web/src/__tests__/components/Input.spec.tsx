import React from 'react';
import { fireEvent, render, wait } from '@testing-library/react';

import Input from '../../components/Input';

jest.mock('@unform/core', () => ({
  useField() {
    return {
      fieldName: 'email',
      value: '',
      error: '',
      registerField: jest.fn(),
    };
  },
}));

describe('InputElement', () => {
  it('should be able to render an input', () => {
    const { getByPlaceholderText } = render(
      <Input name="email" placeholder="E-mail" />,
    );

    expect(getByPlaceholderText('E-mail')).toBeTruthy();
  });

  it('should be able to change input style on focus', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name="email" placeholder="E-mail" />,
    );

    const inputElement = getByPlaceholderText('E-mail');
    const inputContainer = getByTestId('input-container');

    fireEvent.focus(inputElement);

    await wait(() => {
      expect(inputContainer).toHaveStyle('border-color: #ff9000');
      expect(inputContainer).toHaveStyle('color: #ff9000');
    });

    fireEvent.blur(inputElement);

    await wait(() => {
      expect(inputContainer).not.toHaveStyle('border-color: #ff9000');
      expect(inputContainer).not.toHaveStyle('color: #ff9000');
    });
  });

  it('should keep input style when is filled', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name="email" placeholder="E-mail" />,
    );

    const inputElement = getByPlaceholderText('E-mail');
    const inputContainer = getByTestId('input-container');

    fireEvent.change(inputElement, {
      target: { value: 'janedoe@test.com' },
    });

    fireEvent.blur(inputElement);

    await wait(() => {
      expect(inputContainer).toHaveStyle('color: #ff9000');
    });
  });
});
