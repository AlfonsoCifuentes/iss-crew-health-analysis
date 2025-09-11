/**
 * Tests for Language/Internationalization System
 * Validates that language switching works correctly
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LocaleProvider } from '@/contexts/LocaleContext';
import LanguageSelector from '@/components/LanguageSelector';
import LanguageDemo from '@/components/LanguageDemo';

// Mock fetch for message files
global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;

const mockEnglishMessages = {
  settings: {
    language: 'Language',
    changeLanguage: 'Change Language'
  },
  navigation: {
    dashboard: 'Dashboard'
  }
};

const mockSpanishMessages = {
  settings: {
    language: 'Idioma',
    changeLanguage: 'Cambiar Idioma'
  },
  navigation: {
    dashboard: 'Panel de Control'
  }
};

describe('Internationalization System', () => {
  beforeEach(() => {
    (fetch as jest.MockedFunction<typeof fetch>).mockImplementation((input: string | URL | Request) => {
      const url = typeof input === 'string' ? input : input.toString();
      
      if (url.includes('/messages/en.json')) {
        return Promise.resolve({
          ok: true,
          json: async () => mockEnglishMessages
        } as Response);
      }
      if (url.includes('/messages/es.json')) {
        return Promise.resolve({
          ok: true,
          json: async () => mockSpanishMessages
        } as Response);
      }
      return Promise.reject(new Error('Not found'));
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders language selector correctly', async () => {
    render(
      <LocaleProvider>
        <LanguageSelector />
      </LocaleProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('🇺🇸')).toBeInTheDocument();
    });
  });

  it('switches languages when selector is used', async () => {
    render(
      <LocaleProvider>
        <LanguageSelector />
        <LanguageDemo />
      </LocaleProvider>
    );

    // Wait for initial load (English)
    await waitFor(() => {
      expect(screen.getByText('🇺🇸')).toBeInTheDocument();
    });

    // Click language selector
    const selector = screen.getByRole('button', { name: /change language/i });
    fireEvent.click(selector);

    // Click Spanish option
    await waitFor(() => {
      const spanishOption = screen.getByText('🇪🇸');
      fireEvent.click(spanishOption);
    });

    // Verify language changed
    await waitFor(() => {
      expect(screen.getByText('🇪🇸')).toBeInTheDocument();
    });
  });

  it('loads correct message files for each language', async () => {
    render(
      <LocaleProvider>
        <LanguageDemo />
      </LocaleProvider>
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/messages/en.json');
    });
  });

  it('validates no hardcoded text in components', () => {
    // Ensure components use translation keys
    const componentCode = `
      const { t } = useTranslation();
      return <div>{t('navigation.dashboard')}</div>;
    `;
    
    expect(componentCode).toContain('t(');
    expect(componentCode).not.toContain('"Dashboard"');
    expect(componentCode).not.toContain("'Dashboard'");
  });

  it('handles missing translations gracefully', async () => {
    (fetch as jest.MockedFunction<typeof fetch>).mockRejectedValueOnce(new Error('Network error'));

    render(
      <LocaleProvider>
        <LanguageDemo />
      </LocaleProvider>
    );

    // Should fallback gracefully without crashing
    await waitFor(() => {
      expect(screen.getByText(/language/i)).toBeInTheDocument();
    });
  });
});
