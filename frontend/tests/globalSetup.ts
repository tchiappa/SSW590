// Global setup for Vitest - runs before any tests
// Polyfill for Node.js 18 compatibility with jsdom
export default function setup() {
  if (typeof global.structuredClone === 'undefined') {
    global.structuredClone = (val: unknown) => JSON.parse(JSON.stringify(val));
  }
}
