import * as migration_20260818_133955_inicial from './20260818_133955_inicial';
import * as migration_20260818_141547_add_topic_filter_fields from './20260818_141547_add_topic_filter_fields';
import * as migration_20260818_144016_add_case_hero_subtitle from './20260818_144016_add_case_hero_subtitle';
import * as migration_20260818_184514_add_testimonial_label from './20260818_184514_add_testimonial_label';
import * as migration_20260818_190708_add_glossary_terms from './20260818_190708_add_glossary_terms';
import * as migration_20260818_191612_add_resources from './20260818_191612_add_resources';
import * as migration_20260818_211820_add_webinars from './20260818_211820_add_webinars';
import * as migration_20260818_214047_add_posts from './20260818_214047_add_posts';
import * as migration_20260819_112748_add_pages_and_blocks from './20260819_112748_add_pages_and_blocks';
import * as migration_20260819_112945_add_icon_card_variant from './20260819_112945_add_icon_card_variant';

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
    name: '20260818_144016_add_case_hero_subtitle',
  },
  {
    up: migration_20260818_184514_add_testimonial_label.up,
    down: migration_20260818_184514_add_testimonial_label.down,
    name: '20260818_184514_add_testimonial_label',
  },
  {
    up: migration_20260818_190708_add_glossary_terms.up,
    down: migration_20260818_190708_add_glossary_terms.down,
    name: '20260818_190708_add_glossary_terms',
  },
  {
    up: migration_20260818_191612_add_resources.up,
    down: migration_20260818_191612_add_resources.down,
    name: '20260818_191612_add_resources',
  },
  {
    up: migration_20260818_211820_add_webinars.up,
    down: migration_20260818_211820_add_webinars.down,
    name: '20260818_211820_add_webinars',
  },
  {
    up: migration_20260818_214047_add_posts.up,
    down: migration_20260818_214047_add_posts.down,
    name: '20260818_214047_add_posts',
  },
  {
    up: migration_20260819_112748_add_pages_and_blocks.up,
    down: migration_20260819_112748_add_pages_and_blocks.down,
    name: '20260819_112748_add_pages_and_blocks',
  },
  {
    up: migration_20260819_112945_add_icon_card_variant.up,
    down: migration_20260819_112945_add_icon_card_variant.down,
    name: '20260819_112945_add_icon_card_variant'
  },
];
