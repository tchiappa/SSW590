import { describe, expect, test, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DegreeSelect } from '../src/components/DegreeSelect';

// Mock the config
vi.mock('../src/config', () => ({
  API_BASE_URL: 'http://localhost:3000/api'
}));

describe('DegreeSelect Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  test('should render with loading state initially', () => {
    (global.fetch as any).mockImplementation(() => 
      new Promise(() => {}) // Never resolves
    );

    render(<DegreeSelect />);
    const select = screen.getByRole('combobox');
    expect(select).toBeDefined();
    expect(select.hasAttribute('disabled')).toBe(true);
  });

  test('should fetch and display degrees', async () => {
    const mockDegrees = [
      { program_id: 1, name: 'Computer Science', type: 'DEGREE', parent_program_id: null },
      { program_id: 2, name: 'Software Engineering', type: 'DEGREE', parent_program_id: null }
    ];

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockDegrees
    });

    render(<DegreeSelect />);

    await waitFor(() => {
      expect(screen.getByText('Computer Science')).toBeDefined();
      expect(screen.getByText('Software Engineering')).toBeDefined();
    });

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/api/degrees');
  });

  test('should call onChange when selection changes', async () => {
    const mockDegrees = [
      { program_id: 1, name: 'Computer Science', type: 'DEGREE', parent_program_id: null }
    ];

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockDegrees
    });

    const handleChange = vi.fn();
    render(<DegreeSelect onChange={handleChange} />);

    await waitFor(() => {
      expect(screen.getByText('Computer Science')).toBeDefined();
    });

    const select = screen.getByRole('combobox');
    await userEvent.selectOptions(select, '1');

    expect(handleChange).toHaveBeenCalledWith('1');
  });

  test('should handle fetch errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

    render(<DegreeSelect />);

    await waitFor(() => {
      const select = screen.getByRole('combobox');
      expect(select.hasAttribute('disabled')).toBe(false);
    });

    expect(consoleSpy).toHaveBeenCalledWith('Error fetching degrees:', expect.any(Error));
    consoleSpy.mockRestore();
  });

  test('should display "None" option', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    render(<DegreeSelect />);

    await waitFor(() => {
      expect(screen.getByText('None')).toBeDefined();
    });
  });

  test('should set initial value if provided', async () => {
    const mockDegrees = [
      { program_id: 1, name: 'Computer Science', type: 'DEGREE', parent_program_id: null }
    ];

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockDegrees
    });

    render(<DegreeSelect value="1" />);

    await waitFor(() => {
      const select = screen.getByRole('combobox') as HTMLSelectElement;
      expect(select.value).toBe('1');
    });
  });
});
