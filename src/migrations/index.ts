import * as migration_20260821_075700_initial from './20260821_075700_initial';

export const migrations = [
  {
    up: migration_20260821_075700_initial.up,
    down: migration_20260821_075700_initial.down,
    name: '20260821_075700_initial'
  },
];
