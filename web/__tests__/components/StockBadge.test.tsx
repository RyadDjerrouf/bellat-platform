import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StockBadge } from '@/components/products/StockBadge';

describe('StockBadge', () => {
  describe('French locale (default)', () => {
    it('shows "En stock" for in_stock', () => {
      render(<StockBadge status="in_stock" />);
      expect(screen.getByText(/En stock/i)).toBeInTheDocument();
    });

    it('shows "Stock faible" for low_stock', () => {
      render(<StockBadge status="low_stock" />);
      expect(screen.getByText(/Stock faible/i)).toBeInTheDocument();
    });

    it('shows "Rupture" for out_of_stock', () => {
      render(<StockBadge status="out_of_stock" />);
      expect(screen.getByText(/Rupture/i)).toBeInTheDocument();
    });
  });

  describe('Arabic locale', () => {
    it('shows Arabic text for in_stock', () => {
      render(<StockBadge status="in_stock" locale="ar" />);
      expect(screen.getByText(/متوفر/)).toBeInTheDocument();
    });

    it('shows Arabic text for low_stock', () => {
      render(<StockBadge status="low_stock" locale="ar" />);
      expect(screen.getByText(/كمية قليلة/)).toBeInTheDocument();
    });

    it('shows Arabic text for out_of_stock', () => {
      render(<StockBadge status="out_of_stock" locale="ar" />);
      expect(screen.getByText(/نفد المخزون/)).toBeInTheDocument();
    });
  });

  it('applies custom className', () => {
    const { container } = render(<StockBadge status="in_stock" className="test-class" />);
    expect(container.firstChild).toHaveClass('test-class');
  });

  it('applies red background for out_of_stock', () => {
    const { container } = render(<StockBadge status="out_of_stock" />);
    expect(container.firstChild).toHaveClass('bg-red-100');
  });

  it('applies yellow background for low_stock', () => {
    const { container } = render(<StockBadge status="low_stock" />);
    expect(container.firstChild).toHaveClass('bg-yellow-100');
  });

  it('applies green background for in_stock', () => {
    const { container } = render(<StockBadge status="in_stock" />);
    expect(container.firstChild).toHaveClass('bg-green-100');
  });
});
