import { render, screen } from '@testing-library/react';
import App from './App';

  test('must show input from search on the top of screen', () => {
    render(<App />);
    const inputSearch = screen.getByTestId('search')
    expect(inputSearch).toBeInTheDocument();

  })


test ( 'must show cards with comics', () => {

  render(<App />);
  const elemet = screen.getByTestId('cartao')
  expect(elemet).toBeInTheDocument();

})









