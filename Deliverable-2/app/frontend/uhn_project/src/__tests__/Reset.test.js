import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ForgotPassword from '../Component/Reset_pass';

describe('ForgotPassword component', () => {
  beforeEach(() => {
    // Mock the fetch function used by the component
    global.fetch = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        json: () => Promise.resolve({ message: 'Reset email sent' }),
        status: 200,
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the email and password input fields', () => {
    render(<ForgotPassword />, { wrapper: MemoryRouter });

    expect(screen.getByLabelText('Enter your email address:')).toBeInTheDocument();
    expect(screen.getByLabelText('Enter your new password:')).toBeInTheDocument();
  });

  it('submits the form with the email and password values', async () => {
    render(<ForgotPassword />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByLabelText('Enter your email address:'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Enter your new password:'), {
      target: { value: 'newpassword' },
    });
    fireEvent.click(screen.getByText('Reset Password'));

    // Wait for the component to update
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(expect.stringMatching(/\/account\/reset$/), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: 'test@example.com', password: 'newpassword' }),
      });
      expect(screen.getByText('Check your email to reset your password.')).toBeInTheDocument();
    });
  });

  it('displays an error message when submission fails', async () => {
    // Mock the fetch function to simulate a server error
    global.fetch = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        json: () => Promise.resolve({ message: 'Email not found' }),
        status: 400,
      });
    });

    render(<ForgotPassword />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByLabelText('Enter your email address:'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Enter your new password:'), {
      target: { value: 'newpassword' },
    });
    fireEvent.click(screen.getByText('Reset Password'));

    // Wait for the component to update
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(expect.stringMatching(/\/account\/reset$/), expect.any(Object));
      expect(screen.getByText('Email not found')).toBeInTheDocument();
    });
  });
});



