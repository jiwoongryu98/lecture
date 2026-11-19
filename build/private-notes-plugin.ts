import type { Plugin } from 'vite';

// Keep private authoring files out of the local preview.
export function privateNotes(): Plugin {
  return {
    name: 'private-speaker-notes',
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        let pathname: string;
        try {
          pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname).replaceAll('\\', '/');
        } catch { next(); return; }
        if (!/(?:^|\/)(?:notes|Notes)(?:\/|$)/.test(pathname)
          && !/(?:^|\/)content\/private(?:\/|$)/.test(pathname)) { next(); return; }
        response.writeHead(403, { 'Cache-Control': 'no-store', 'Content-Type': 'text/plain; charset=utf-8' });
        response.end('Forbidden');
      });
    },
  };
}
