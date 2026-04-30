import type { SerializedState } from './persistence.js';

export const CURRENT_SCHEMA_VERSION = 1;

type MigrationStep = (prev: Record<string, unknown>) => Record<string, unknown>;

const migrations: Record<number, MigrationStep> = {
  // Future migrations will go here. Example: migrating from v1 to v2:
  // 1: (prev) => ({ ...prev, newField: defaultValue }),
};

export const migrate = (raw: Partial<SerializedState> & { schemaVersion?: number }): SerializedState => {
  let current = raw as Record<string, unknown>;
  let version = (raw.schemaVersion ?? 0) as number;
  while (version < CURRENT_SCHEMA_VERSION) {
    const step = migrations[version];
    if (!step) {
      version += 1;
      continue;
    }
    current = step(current);
    version += 1;
  }
  return { ...(current as SerializedState), schemaVersion: CURRENT_SCHEMA_VERSION };
};
