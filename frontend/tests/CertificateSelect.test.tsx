import { describe, expect, test, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CertificateSelect } from '../src/components/CertificateSelect';

// Mock the config
vi.mock('../src/config', () => ({
  API_BASE_URL: 'http://localhost:3000/api'
}));

describe('CertificateSelect Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  test('should render with loading state initially', () => {
    (global.fetch as any).mockImplementation(() => 
      new Promise(() => {}) // Never resolves
    );

    render(<CertificateSelect />);
    const select = screen.getByRole('combobox');
    expect(select).toBeDefined();
    expect(select.hasAttribute('disabled')).toBe(true);
  });

  test('should fetch and display certificates', async () => {
    const mockCertificates = [
      { program_id: 3, name: 'Web Development', type: 'CERTIFICATE', parent_program_id: null },
      { program_id: 4, name: 'Data Science', type: 'CERTIFICATE', parent_program_id: null }
    ];

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockCertificates
    });

    render(<CertificateSelect />);

    await waitFor(() => {
      expect(screen.getByText('Web Development')).toBeDefined();
      expect(screen.getByText('Data Science')).toBeDefined();
    });

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/api/certificates');
  });

  test('should call onChange when selection changes', async () => {
    const mockCertificates = [
      { program_id: 3, name: 'Web Development', type: 'CERTIFICATE', parent_program_id: null }
    ];

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockCertificates
    });

    const handleChange = vi.fn();
    render(<CertificateSelect onChange={handleChange} />);

    await waitFor(() => {
      expect(screen.getByText('Web Development')).toBeDefined();
    });

    const select = screen.getByRole('combobox');
    await userEvent.selectOptions(select, '3');

    expect(handleChange).toHaveBeenCalledWith('3');
  });

  test('should handle fetch errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

    render(<CertificateSelect />);

    await waitFor(() => {
      const select = screen.getByRole('combobox');
      expect(select.hasAttribute('disabled')).toBe(false);
    });

    expect(consoleSpy).toHaveBeenCalledWith('Error fetching certificates:', expect.any(Error));
    consoleSpy.mockRestore();
  });

  test('should display "None" option', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    render(<CertificateSelect />);

    await waitFor(() => {
      expect(screen.getByText('None')).toBeDefined();
    });
  });

  test('should set initial value if provided', async () => {
    const mockCertificates = [
      { program_id: 3, name: 'Web Development', type: 'CERTIFICATE', parent_program_id: null }
    ];

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockCertificates
    });

    render(<CertificateSelect value="3" />);

    await waitFor(() => {
      const select = screen.getByRole('combobox') as HTMLSelectElement;
      expect(select.value).toBe('3');
    });
  });
});
