import { describe, expect, test, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ClassList } from '../src/components/ClassList';

// Mock the config
vi.mock('../src/config', () => ({
  API_BASE_URL: 'http://localhost:3000/api'
}));

describe('ClassList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  test('should show message when no degree or certificate selected', () => {
    render(<ClassList degreeId="" certificateId="" />);
    expect(screen.getByText('Please select a degree or certificate to view the class list.')).toBeDefined();
  });

  test('should show loading state', async () => {
    (global.fetch as any).mockImplementation(() => 
      new Promise(() => {}) // Never resolves
    );

    render(<ClassList degreeId="1" certificateId="" />);
    expect(screen.getByText('Loading courses...')).toBeDefined();
  });

  test('should fetch and display courses for a degree', async () => {
    const mockCourses = [
      {
        course_id: 'CS101',
        title: 'Intro to Computer Science',
        credits: 3,
        requirement_types: 'CORE',
        program_names: 'Computer Science'
      },
      {
        course_id: 'CS201',
        title: 'Data Structures',
        credits: 4,
        requirement_types: 'CORE',
        program_names: 'Computer Science'
      }
    ];

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockCourses
    });

    render(<ClassList degreeId="1" certificateId="" />);

    await waitFor(() => {
      expect(screen.getByText('CS101')).toBeDefined();
      expect(screen.getByText('Intro to Computer Science')).toBeDefined();
      expect(screen.getByText('CS201')).toBeDefined();
      expect(screen.getByText('Data Structures')).toBeDefined();
    });

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/class-list?degreeId=1'
    );
  });

  test('should fetch courses with both degree and certificate', async () => {
    const mockCourses = [
      {
        course_id: 'CS101',
        title: 'Intro to CS',
        credits: 3,
        requirement_types: 'CORE',
        program_names: 'Computer Science'
      }
    ];

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockCourses
    });

    render(<ClassList degreeId="1" certificateId="3" />);

    await waitFor(() => {
      expect(screen.getByText('CS101')).toBeDefined();
    });

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/class-list?degreeId=1&certificateId=3'
    );
  });

  test('should show error message on fetch failure', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

    render(<ClassList degreeId="1" certificateId="" />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load class list. Please try again.')).toBeDefined();
    });
  });

  test('should show message when no courses found', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    render(<ClassList degreeId="1" certificateId="" />);

    await waitFor(() => {
      expect(screen.getByText('No courses found for the selected program(s).')).toBeDefined();
    });
  });

  test('should display course count correctly', async () => {
    const mockCourses = [
      {
        course_id: 'CS101',
        title: 'Intro to CS',
        credits: 3,
        requirement_types: 'CORE',
        program_names: 'Computer Science'
      },
      {
        course_id: 'CS201',
        title: 'Data Structures',
        credits: 4,
        requirement_types: 'CORE',
        program_names: 'Computer Science'
      }
    ];

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockCourses
    });

    render(<ClassList degreeId="1" certificateId="" />);

    await waitFor(() => {
      expect(screen.getByText('Found 2 courses for your selection.')).toBeDefined();
    });
  });

  test('should handle non-ok response', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500
    });

    render(<ClassList degreeId="1" certificateId="" />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load class list. Please try again.')).toBeDefined();
    });
  });
});
