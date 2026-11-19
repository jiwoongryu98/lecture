import { resolve } from 'node:path';
import { existsSync } from 'node:fs';
import type { Plugin } from 'vite';
import { projectRoot, readCatalog } from './catalog.ts';

const publicId = 'virtual:slide-catalog';
const resolvedId = '\0' + publicId;

export function slideCatalog(): Plugin {
  let root = projectRoot;
  return {
    name: 'slide-catalog',
    configResolved(config) { root = config.root; },
    resolveId(id) { if (id === publicId) return resolvedId; },
    load(id) {
      if (id !== resolvedId) return;
      const slides = readCatalog(root);
      for (const slide of slides) for (const path of [`content/slides/${slide.number}.tsx`, `content/slides/${slide.number}.css`]) {
        const file = resolve(root, path);
        if (existsSync(file)) this.addWatchFile(file);
      }
      return `export default ${JSON.stringify(slides)};`;
    },
    configureServer(server) {
      const slidesFolder = resolve(root, 'content/slides');
      server.watcher.add(slidesFolder);
      const refresh = (file: string) => {
        if (!file.startsWith(slidesFolder + '/')) return;
        for (const environment of Object.values(server.environments)) {
          const module = environment.moduleGraph.getModuleById(resolvedId);
          if (module) environment.moduleGraph.invalidateModule(module);
        }
        server.ws.send({ type: 'full-reload' });
      };
      server.watcher.on('add', refresh).on('unlink', refresh);
      server.httpServer?.once('close', () => { server.watcher.off('add', refresh).off('unlink', refresh); });
    },
    handleHotUpdate(context) {
      if (!context.file.startsWith(resolve(root, 'content/slides') + '/')) return;
      readCatalog(root);
      const module = context.server.moduleGraph.getModuleById(resolvedId);
      if (module) { context.server.moduleGraph.invalidateModule(module); return [...context.modules, module]; }
    },
  };
}
