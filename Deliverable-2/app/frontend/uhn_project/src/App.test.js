import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders login form', () => {
  render(<App />);
  const emailInput = screen.getByLabelText(/email/i);
  expect(emailInput).toBeInTheDocument();
});
