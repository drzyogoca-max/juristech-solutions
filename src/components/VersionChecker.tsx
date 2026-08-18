import { useEffect } from 'react';
import { CURRENT_APP_VERSION, enforceGlobalForceUpdate } from '../lib/versionManager';

export default function VersionChecker() {
  useEffect(() => {
    enforceGlobalForceUpdate();
  }, []);

  return null;
}
