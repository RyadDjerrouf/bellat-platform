"use client";

import { useAuth } from '@/context/AuthContext';
import { useOfflineSync } from '@/hooks/useOfflineSync';

/** Mounts the offline sync listener. Must be inside AuthProvider. */
export function OfflineSyncProvider() {
  const { token } = useAuth();
  useOfflineSync(token);
  return null;
}
