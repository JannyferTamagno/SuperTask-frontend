import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';

describe('Button Component', () => {
  test('renders button with provided text', () => {
    render(<Button onClick={() => {}}>Click Me</Button>);
    const buttonElement = screen.getByText(/Click Me/i);
    expect(buttonElement).toBeInTheDocument();
  });

  test('calls onClick handler when button is clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    const buttonElement = screen.getByText(/Click Me/i);

    fireEvent.click(buttonElement); 

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
