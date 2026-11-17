import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
// Node's native localStorage shadows jsdom on newer runtimes; use the browser implementation.
const browser = (globalThis as typeof globalThis & { jsdom: { window: Window } }).jsdom.window;
Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: browser.localStorage });
afterEach(cleanup);
