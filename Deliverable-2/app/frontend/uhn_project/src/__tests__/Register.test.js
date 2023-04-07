import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Register from '../Component/Register';

test('renders register form', () => {
  render(<Register />, { wrapper: MemoryRouter });
  const emailInput = screen.getByLabelText('Email:');
  const passwordInput = screen.getByLabelText('Password:');
  const confirmPasswordInput = screen.getByLabelText('Confirm Password:');
  const registerButton = screen.getByRole('button', { name: /register/i });
  const goBackButton = screen.getByRole('button', { name: /go back/i });
  expect(emailInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(confirmPasswordInput).toBeInTheDocument();
  expect(registerButton).toBeInTheDocument();
  expect(goBackButton).toBeInTheDocument();
});

test('displays error message if invalid email address is entered', () => {
  render(<Register />, { wrapper: MemoryRouter });
  const emailInput = screen.getByLabelText('Email:');
  const passwordInput = screen.getByLabelText('Password:');
  const confirmPasswordInput = screen.getByLabelText('Confirm Password:');
  const registerButton = screen.getByRole('button', { name: /register/i });

  fireEvent.change(emailInput, { target: { value: 'invalid email' } });
  fireEvent.change(passwordInput, { target: { value: 'password123' } });
  fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
  fireEvent.click(registerButton);

  const errorMessage = screen.getByText(/Please enter a valid email address./i);
  expect(errorMessage).toBeInTheDocument();
});

test('displays error message if passwords do not match', () => {
  render(<Register />, { wrapper: MemoryRouter });
  const emailInput = screen.getByLabelText('Email:');
  const passwordInput = screen.getByLabelText('Password:');
  const confirmPasswordInput = screen.getByLabelText('Confirm Password:');
  const registerButton = screen.getByRole('button', { name: /register/i });

  fireEvent.change(emailInput, { target: { value: 'valid_email@example.com' } });
  fireEvent.change(passwordInput, { target: { value: 'password123' } });
  fireEvent.change(confirmPasswordInput, { target: { value: 'different_password' } });
  fireEvent.click(registerButton);

  const errorMessage = screen.getByText(/Passwords do not match./i);
  expect(errorMessage).toBeInTheDocument();
});

test('displays error message if registration fails', async () => {
  jest.spyOn(window, 'fetch').mockImplementationOnce(() =>
    Promise.resolve({
      json: () => Promise.resolve({ message: 'Email address already exists' })
    })
  );

  render(<Register />, { wrapper: MemoryRouter });
  const emailInput = screen.getByLabelText('Email:');
  const passwordInput = screen.getByLabelText('Password:');
  const confirmPasswordInput = screen.getByLabelText('Confirm Password:');
  const registerButton = screen.getByRole('button', { name: /register/i });

  fireEvent.change(emailInput, { target: { value: 'valid_email@example.com' } });
  fireEvent.change(passwordInput, { target: { value: 'password123' } });
  fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
  fireEvent.click(registerButton);

  const errorMessage = await screen.findByText(/Email address already exists/i);
  expect(errorMessage).toBeInTheDocument();
});

