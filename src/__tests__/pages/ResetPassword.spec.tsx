import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import api from '../../services/api';

import ResetPassword from '../../pages/ResetPassword';

const mockedHistoryPush = jest.fn();
const mockedAddToast = jest.fn();
const mockApiPost = jest.fn();
const mockLocation = jest.fn(() => '?token=token');

jest.spyOn(api, 'post').mockImplementation(mockApiPost);

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    useLocation: () => ({
      search: mockLocation(),
    }),
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

describe('ResetPassword Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
  });

  it('should be able to reset password', async () => {
    const { getByPlaceholderText, getByText } = render(<ResetPassword />);

    const passwordField = getByPlaceholderText('Nova senha');
    const passwordConfirmationField = getByPlaceholderText(
      'Confirmação da senha',
    );
    const buttonElement = getByText('Alterar senha');

    fireEvent.change(passwordField, { target: { value: '123456' } });
    fireEvent.change(passwordConfirmationField, {
      target: { value: '123456' },
    });

    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/');
    });
  });

  it('should not be able to reset password without token', async () => {
    mockLocation.mockImplementation(() => '');

    const { getByPlaceholderText, getByText } = render(<ResetPassword />);
    const passwordField = getByPlaceholderText('Nova senha');
    const passwordConfirmationField = getByPlaceholderText(
      'Confirmação da senha',
    );
    const buttonElement = getByText('Alterar senha');

    fireEvent.change(passwordField, { target: { value: '123456' } });
    fireEvent.change(passwordConfirmationField, {
      target: { value: '123456' },
    });

    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled();
    });
  });

  it('should not be able to reset password with passwords wich does not match', async () => {
    const { getByPlaceholderText, getByText } = render(<ResetPassword />);
    const passwordField = getByPlaceholderText('Nova senha');
    const passwordConfirmationField = getByPlaceholderText(
      'Confirmação da senha',
    );
    const buttonElement = getByText('Alterar senha');

    fireEvent.change(passwordField, { target: { value: '123456' } });
    fireEvent.change(passwordConfirmationField, {
      target: { value: '111111' },
    });

    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });
  });
});
