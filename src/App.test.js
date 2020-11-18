import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('tests work', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Silverstreaming Demo/i);
  expect(linkElement).toBeInTheDocument();
});
