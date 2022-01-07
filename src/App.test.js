import { render, screen } from '@testing-library/react';
import App from './App';


  test('must show input from search on the top of screen', () => {
    render(<App />);
    const inputSearch = screen.getByTestId('search')
    expect(inputSearch).toBeInTheDocument();

  })


  test('must show cards on page ', () => {
    render(<App />);
    const cardElement = screen.getByTestId('cartao')
    expect(cardElement).toBeInTheDocument();
  })










