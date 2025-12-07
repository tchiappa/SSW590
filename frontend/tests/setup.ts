import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Polyfill for Node.js 18 compatibility with jsdom
if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = (val: unknown) => JSON.parse(JSON.stringify(val));
}

// Cleanup after each test
afterEach(() => {
  cleanup();
});
