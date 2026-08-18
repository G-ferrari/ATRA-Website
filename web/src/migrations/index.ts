import * as migration_20260818_133955_inicial from './20260818_133955_inicial';

export const migrations = [
  {
    up: migration_20260818_133955_inicial.up,
    down: migration_20260818_133955_inicial.down,
    name: '20260818_133955_inicial'
  },
];
