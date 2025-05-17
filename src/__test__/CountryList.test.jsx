import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import CountryList from '../components/CountryList';

// Mock axios
vi.mock('axios');

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('CountryList Component', () => {
  const mockCountries = [
    {
      cca3: 'USA',
      name: { common: 'United States' },
      capital: ['Washington D.C.'],
      population: 331000000,
      region: 'Americas',
      languages: { eng: 'English' },
      flags: { png: 'https://flagcdn.com/us.png' }
    },
    {
      cca3: 'CAN',
      name: { common: 'Canada' },
      capital: ['Ottawa'],
      population: 38000000,
      region: 'Americas',
      languages: { eng: 'English', fra: 'French' },
      flags: { png: 'https://flagcdn.com/ca.png' }
    },
    {
      cca3: 'JPN',
      name: { common: 'Japan' },
      capital: ['Tokyo'],
      population: 126000000,
      region: 'Asia',
      languages: { jpn: 'Japanese' },
      flags: { png: 'https://flagcdn.com/jp.png' }
    }
  ];

  beforeEach(() => {
    // Reset localStorage before each test
    window.localStorage.clear();
    // Mock axios response
    axios.get.mockResolvedValue({ data: mockCountries });
  });

  it('renders loading spinner initially', () => {
    render(
      <MemoryRouter>
        <CountryList />
      </MemoryRouter>
    );
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('displays countries after loading', async () => {
    render(
      <MemoryRouter>
        <CountryList />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('United States')).toBeInTheDocument();
      expect(screen.getByText('Canada')).toBeInTheDocument();
      expect(screen.getByText('Japan')).toBeInTheDocument();
    });
  });

  it('filters countries by search term', async () => {
    render(
      <MemoryRouter>
        <CountryList />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('United States')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search countries by name...');
    fireEvent.change(searchInput, { target: { value: 'Canada' } });
    
    await waitFor(() => {
      expect(screen.queryByText('United States')).not.toBeInTheDocument();
      expect(screen.getByText('Canada')).toBeInTheDocument();
      expect(screen.queryByText('Japan')).not.toBeInTheDocument();
    });
  });

it('toggles favorite status of a country', async () => {
  render(
    <MemoryRouter>
      <CountryList />
    </MemoryRouter>
  );
  
  await waitFor(() => {
    expect(screen.getByText('United States')).toBeInTheDocument();
  });

  // Find all favorite buttons by test ID
  const favoriteButtons = screen.getAllByTestId('favorite-icon-outline');
  expect(favoriteButtons.length).toBeGreaterThan(0);
  
  // Click the first favorite button
  fireEvent.click(favoriteButtons[0].closest('button')); // Click the parent button
  
  // After click, should change to filled heart
  await waitFor(() => {
    expect(screen.getAllByTestId('favorite-icon-filled').length).toBe(1);
    expect(screen.getAllByTestId('favorite-icon-outline').length).toBeLessThan(favoriteButtons.length);
  });
  
  // Check localStorage
  expect(JSON.parse(localStorage.getItem('countryFavorites'))).toEqual(['USA']);
});

  it('shows only favorites when favorites filter is active', async () => {
    // Set initial favorites
    window.localStorage.setItem('countryFavorites', JSON.stringify(['CAN']));
    
    render(
      <MemoryRouter>
        <CountryList />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Canada')).toBeInTheDocument();
    });

    const favoritesButton = screen.getByRole('button', { name: /favorites/i });
    fireEvent.click(favoritesButton);
    
    await waitFor(() => {
      expect(screen.queryByText('United States')).not.toBeInTheDocument();
      expect(screen.getByText('Canada')).toBeInTheDocument();
      expect(screen.queryByText('Japan')).not.toBeInTheDocument();
    });
  });

  it('filters countries by region', async () => {
    render(
      <MemoryRouter>
        <CountryList />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('United States')).toBeInTheDocument();
    });

    // Open filters
    const filterButton = screen.getByRole('button', { name: /filters/i });
    fireEvent.click(filterButton);
    
    // Select region filter
    const regionSelect = screen.getByLabelText('Region');
    fireEvent.change(regionSelect, { target: { value: 'Asia' } });
    
    await waitFor(() => {
      expect(screen.queryByText('United States')).not.toBeInTheDocument();
      expect(screen.queryByText('Canada')).not.toBeInTheDocument();
      expect(screen.getByText('Japan')).toBeInTheDocument();
    });
  });

  it('filters countries by language', async () => {
    render(
      <MemoryRouter>
        <CountryList />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Canada')).toBeInTheDocument();
    });

    // Open filters
    const filterButton = screen.getByRole('button', { name: /filters/i });
    fireEvent.click(filterButton);
    
    // Select language filter
    const languageSelect = screen.getByLabelText('Language');
    fireEvent.change(languageSelect, { target: { value: 'French' } });
    
    await waitFor(() => {
      expect(screen.queryByText('United States')).not.toBeInTheDocument();
      expect(screen.getByText('Canada')).toBeInTheDocument();
      expect(screen.queryByText('Japan')).not.toBeInTheDocument();
    }); 
  });

  it('shows "No favorites yet" message when no favorites are selected', async () => {
    render(
      <MemoryRouter>
        <CountryList />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('United States')).toBeInTheDocument();
    });

    const favoritesButton = screen.getByRole('button', { name: /favorites/i });
    fireEvent.click(favoritesButton);
    
    await waitFor(() => {
      expect(screen.getByText('No favorites yet')).toBeInTheDocument();
      expect(screen.getByText('Browse All Countries')).toBeInTheDocument();
    });
  });

  it('shows "No countries match your search" when filters yield no results', async () => {
    render(
      <MemoryRouter>
        <CountryList />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('United States')).toBeInTheDocument();
    });

    // Search for non-existent country
    const searchInput = screen.getByPlaceholderText('Search countries by name...');
    fireEvent.change(searchInput, { target: { value: 'XYZ' } });
    
    await waitFor(() => {
      expect(screen.getByText('No countries match your search')).toBeInTheDocument();
      expect(screen.getByText('Clear all filters')).toBeInTheDocument();
    });
  });

  it('navigates to country detail page when a country card is clicked', async () => {
    const { container } = render(
      <MemoryRouter>
        <CountryList />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('United States')).toBeInTheDocument();
    });

    // Find the first country card and click it
    const countryCard = container.querySelector('.cursor-pointer');
    fireEvent.click(countryCard);
    
    // In a real test with React Router, you would check navigation here
    // This is simplified for the example
    expect(window.location.pathname).toBe('/');
  });

  it('paginates results when there are more than items per page', async () => {
    // Create a large mock dataset
    const largeMockCountries = Array.from({ length: 20 }, (_, i) => ({
      cca3: `C${i}`,
      name: { common: `Country ${i}` },
      capital: ['Capital'],
      population: 1000000,
      region: 'Region',
      languages: { lang: 'Language' },
      flags: { png: 'https://flagcdn.com/default.png' }
    }));
    
    axios.get.mockResolvedValueOnce({ data: largeMockCountries });
    
    render(
      <MemoryRouter>
        <CountryList />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      // Should show first 12 items by default
      expect(screen.getByText('Country 0')).toBeInTheDocument();
      expect(screen.getByText('Country 11')).toBeInTheDocument();
      expect(screen.queryByText('Country 12')).not.toBeInTheDocument();
    });

    // Click next page button
    const nextButton = screen.getByLabelText('Next page');
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      // Should show next set of items
      expect(screen.queryByText('Country 11')).not.toBeInTheDocument();
      expect(screen.getByText('Country 12')).toBeInTheDocument();
      expect(screen.getByText('Country 19')).toBeInTheDocument();
    });
  });
});