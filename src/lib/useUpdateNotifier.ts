/**
 * useUpdateNotifier.ts
 * React hook — watches version manager and exposes update state to components.
 */
import { useState, useEffect, useCallback } from 'react';
import {
  onUpdateAvailable,
  triggerImmediateUpdate,
  CURRENT_APP_VERSION,
} from './versionManager';

export interface UpdateState {
  hasUpdate: boolean;
  newVersion: string | null;
  currentVersion: string;
  applyUpdate: () => Promise<void>;
  dismiss: () => void;
}

export function useUpdateNotifier(): UpdateState {
  const [hasUpdate, setHasUpdate] = useState(false);
  const [newVersion, setNewVersion] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onUpdateAvailable((ver) => {
      setHasUpdate(true);
      setNewVersion(ver);
    });
    return () => { unsub(); };
  }, []);

  const applyUpdate = useCallback(async () => {
    await triggerImmediateUpdate();
  }, []);

  const dismiss = useCallback(() => {
    setHasUpdate(false);
  }, []);

  return {
    hasUpdate,
    newVersion,
    currentVersion: CURRENT_APP_VERSION,
    applyUpdate,
    dismiss,
  };
}
