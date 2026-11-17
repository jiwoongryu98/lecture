import type { Plugin } from 'vite';

// Block browser file requests while allowing the Worker to import private notes.
export function privateNotes(): Plugin {
  return {
    name: 'private-speaker-notes',
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        let pathname: string;
        try {
          pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname).replaceAll('\\', '/');
        } catch { next(); return; }
        if (pathname.startsWith('/api/')) { next(); return; }
        if (!/(?:^|\/)(?:notes|Notes)(?:\/|$)/.test(pathname)
          && !/(?:^|\/)dist\/worker(?:\/|$)/.test(pathname)) { next(); return; }
        response.writeHead(403, { 'Cache-Control': 'no-store', 'Content-Type': 'text/plain; charset=utf-8' });
        response.end('Presenter access required');
      });
    },
  };
}
