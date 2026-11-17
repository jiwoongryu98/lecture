import { useEffect, useState, useSyncExternalStore } from 'react';
import { LectureClient } from './lecture-client';

export function useLectureConnection(presenter: boolean) {
  const [client] = useState(() => new LectureClient(presenter));
  const view = useSyncExternalStore(client.subscribe, client.getSnapshot);
  useEffect(() => { client.start(); return () => client.stop(); }, [client]);
  return { client, view };
}
