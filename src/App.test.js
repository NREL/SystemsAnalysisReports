import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders header', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText('Revit Systems Analysis - Loads Report');
  expect(linkElement).toBeInTheDocument();
});

/*
test('renders the component', () => {
  const container = render(<Component />)
  expect(container.firstChild).toMatchSnapshot()
 })*/