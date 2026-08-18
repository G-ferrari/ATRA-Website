import * as migration_20260818_133955_inicial from './20260818_133955_inicial';
import * as migration_20260818_141547_add_topic_filter_fields from './20260818_141547_add_topic_filter_fields';
import * as migration_20260818_144016_add_case_hero_subtitle from './20260818_144016_add_case_hero_subtitle';

export const migrations = [
  {
    up: migration_20260818_133955_inicial.up,
    down: migration_20260818_133955_inicial.down,
    name: '20260818_133955_inicial',
  },
  {
    up: migration_20260818_141547_add_topic_filter_fields.up,
    down: migration_20260818_141547_add_topic_filter_fields.down,
    name: '20260818_141547_add_topic_filter_fields',
  },
  {
    up: migration_20260818_144016_add_case_hero_subtitle.up,
    down: migration_20260818_144016_add_case_hero_subtitle.down,
    name: '20260818_144016_add_case_hero_subtitle'
  },
];
