import * as migration_20260821_072203_initial from './20260821_072203_initial';

export const migrations = [
  {
    up: migration_20260821_072203_initial.up,
    down: migration_20260821_072203_initial.down,
    name: '20260821_072203_initial'
  },
];
