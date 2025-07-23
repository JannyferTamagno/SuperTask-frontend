import React from 'react';
import { render, screen } from '@testing-library/react';
import { Card } from '../Card'; 

describe('Card Component', () => {
  const mockItems = [
    {
      label: 'Pendente',
      value: '50',
      percentage: 80,
      color: '#34D399',
    },
    {
      label: 'Concluído',
      value: 20,
      percentage: 50,
      color: '#60A5FA',
    },
  ];

  test('renders the card title', () => {
    render(<Card title="Trabalho" items={mockItems} />);
    expect(screen.getByText(/Trabalho/i)).toBeInTheDocument();
  });

  test('renders all card items with correct values', () => {
    render(<Card title="Desempenho" items={mockItems} />);

    expect(screen.getByText('Pendente')).toBeInTheDocument();
    expect(screen.getByText('Concluído')).toBeInTheDocument();

    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();

    expect(screen.getByText('80%')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  test('applies correct styles based on color', () => {
    render(<Card title="Exemplo" items={mockItems} />);
    
    const percentageBadges = screen.getAllByText(/%/);
    expect(percentageBadges[0]).toHaveStyle({ color: '#34D399' });
    expect(percentageBadges[0]).toHaveStyle({ backgroundColor: '#34D39920' });
    expect(percentageBadges[1]).toHaveStyle({ color: '#60A5FA' });
    expect(percentageBadges[1]).toHaveStyle({ backgroundColor: '#60A5FA20' });
  });
});
