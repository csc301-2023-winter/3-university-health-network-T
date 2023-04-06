import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import Login from '../Component/Login';

// Mock the `useNavigate` hook
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

// Mock the server URL
jest.mock('../global', () => ({
  server_url: 'https://mock-server-url.com',
}));

describe('Login', () => {
  test('renders the login form', () => {
    render(<Login />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
    expect(screen.getByText(/forgot password\?/i)).toBeInTheDocument();
  });

  test('shows an error message when the email is invalid', async () => {
    render(<Login />);
    userEvent.type(screen.getByLabelText(/email/i), 'invalid-email');
    userEvent.type(screen.getByLabelText(/password/i), 'password123');
    userEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  // Add more tests for other functionalities, such as successful login, registration, and forgot password
});

