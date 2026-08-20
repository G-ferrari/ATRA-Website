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
import * as migration_20260819_113941_add_hero_media from './20260819_113941_add_hero_media';
import * as migration_20260819_115931_add_block_border_and_header from './20260819_115931_add_block_border_and_header';
import * as migration_20260819_121444_add_richtext_ctas from './20260819_121444_add_richtext_ctas';
import * as migration_20260819_123348_highlight_has_many from './20260819_123348_highlight_has_many';
import * as migration_20260819_123913_add_partner_logo_scale from './20260819_123913_add_partner_logo_scale';
import * as migration_20260819_124247_add_nav_label from './20260819_124247_add_nav_label';
import * as migration_20260819_141533_add_jobs_and_career_blocks from './20260819_141533_add_jobs_and_career_blocks';
import * as migration_20260819_143627_add_contact_and_jobs_blocks from './20260819_143627_add_contact_and_jobs_blocks';
import * as migration_20260819_151003_add_specialist_roles from './20260819_151003_add_specialist_roles';
import * as migration_20260819_151217_add_role_gradient from './20260819_151217_add_role_gradient';
import * as migration_20260819_155648_add_partner_layout from './20260819_155648_add_partner_layout';
import * as migration_20260819_171908_add_solutions from './20260819_171908_add_solutions';
import * as migration_20260819_194123_solution_page_blocks from './20260819_194123_solution_page_blocks';
import * as migration_20260819_213812_bento_footer_icon from './20260819_213812_bento_footer_icon';
import * as migration_20260819_224317_add_navigation_global from './20260819_224317_add_navigation_global';
import * as migration_20260820_092037_mig_050a_carreiras from './20260820_092037_mig_050a_carreiras';
import * as migration_20260820_093412_mig_050a_nav_bottom_gap from './20260820_093412_mig_050a_nav_bottom_gap';
import * as migration_20260820_100711_mig_050a_value_cards_highlight from './20260820_100711_mig_050a_value_cards_highlight';
import * as migration_20260820_105242_mig_054a_partner_blocks from './20260820_105242_mig_054a_partner_blocks';
import * as migration_20260820_113453_mig_057_home_blocks from './20260820_113453_mig_057_home_blocks';
import * as migration_20260820_113912_mig_057_logo_marquee_list from './20260820_113912_mig_057_logo_marquee_list';
import * as migration_20260820_120441_mig_058_home_blocks from './20260820_120441_mig_058_home_blocks';
import * as migration_20260820_121347_mig_058_cta_photo from './20260820_121347_mig_058_cta_photo';
import * as migration_20260820_183139_mig_060_insights_hub from './20260820_183139_mig_060_insights_hub';
import * as migration_20260820_185404_mig_061_atra_ai from './20260820_185404_mig_061_atra_ai';
import * as migration_20260820_210222_mig_071_clients from './20260820_210222_mig_071_clients';
import * as migration_20260820_210425_mig_071_sem_arrays_na_home from './20260820_210425_mig_071_sem_arrays_na_home';

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
    name: '20260819_112945_add_icon_card_variant',
  },
  {
    up: migration_20260819_113941_add_hero_media.up,
    down: migration_20260819_113941_add_hero_media.down,
    name: '20260819_113941_add_hero_media',
  },
  {
    up: migration_20260819_115931_add_block_border_and_header.up,
    down: migration_20260819_115931_add_block_border_and_header.down,
    name: '20260819_115931_add_block_border_and_header',
  },
  {
    up: migration_20260819_121444_add_richtext_ctas.up,
    down: migration_20260819_121444_add_richtext_ctas.down,
    name: '20260819_121444_add_richtext_ctas',
  },
  {
    up: migration_20260819_123348_highlight_has_many.up,
    down: migration_20260819_123348_highlight_has_many.down,
    name: '20260819_123348_highlight_has_many',
  },
  {
    up: migration_20260819_123913_add_partner_logo_scale.up,
    down: migration_20260819_123913_add_partner_logo_scale.down,
    name: '20260819_123913_add_partner_logo_scale',
  },
  {
    up: migration_20260819_124247_add_nav_label.up,
    down: migration_20260819_124247_add_nav_label.down,
    name: '20260819_124247_add_nav_label',
  },
  {
    up: migration_20260819_141533_add_jobs_and_career_blocks.up,
    down: migration_20260819_141533_add_jobs_and_career_blocks.down,
    name: '20260819_141533_add_jobs_and_career_blocks',
  },
  {
    up: migration_20260819_143627_add_contact_and_jobs_blocks.up,
    down: migration_20260819_143627_add_contact_and_jobs_blocks.down,
    name: '20260819_143627_add_contact_and_jobs_blocks',
  },
  {
    up: migration_20260819_151003_add_specialist_roles.up,
    down: migration_20260819_151003_add_specialist_roles.down,
    name: '20260819_151003_add_specialist_roles',
  },
  {
    up: migration_20260819_151217_add_role_gradient.up,
    down: migration_20260819_151217_add_role_gradient.down,
    name: '20260819_151217_add_role_gradient',
  },
  {
    up: migration_20260819_155648_add_partner_layout.up,
    down: migration_20260819_155648_add_partner_layout.down,
    name: '20260819_155648_add_partner_layout',
  },
  {
    up: migration_20260819_171908_add_solutions.up,
    down: migration_20260819_171908_add_solutions.down,
    name: '20260819_171908_add_solutions',
  },
  {
    up: migration_20260819_194123_solution_page_blocks.up,
    down: migration_20260819_194123_solution_page_blocks.down,
    name: '20260819_194123_solution_page_blocks',
  },
  {
    up: migration_20260819_213812_bento_footer_icon.up,
    down: migration_20260819_213812_bento_footer_icon.down,
    name: '20260819_213812_bento_footer_icon',
  },
  {
    up: migration_20260819_224317_add_navigation_global.up,
    down: migration_20260819_224317_add_navigation_global.down,
    name: '20260819_224317_add_navigation_global',
  },
  {
    up: migration_20260820_092037_mig_050a_carreiras.up,
    down: migration_20260820_092037_mig_050a_carreiras.down,
    name: '20260820_092037_mig_050a_carreiras',
  },
  {
    up: migration_20260820_093412_mig_050a_nav_bottom_gap.up,
    down: migration_20260820_093412_mig_050a_nav_bottom_gap.down,
    name: '20260820_093412_mig_050a_nav_bottom_gap',
  },
  {
    up: migration_20260820_100711_mig_050a_value_cards_highlight.up,
    down: migration_20260820_100711_mig_050a_value_cards_highlight.down,
    name: '20260820_100711_mig_050a_value_cards_highlight',
  },
  {
    up: migration_20260820_105242_mig_054a_partner_blocks.up,
    down: migration_20260820_105242_mig_054a_partner_blocks.down,
    name: '20260820_105242_mig_054a_partner_blocks',
  },
  {
    up: migration_20260820_113453_mig_057_home_blocks.up,
    down: migration_20260820_113453_mig_057_home_blocks.down,
    name: '20260820_113453_mig_057_home_blocks',
  },
  {
    up: migration_20260820_113912_mig_057_logo_marquee_list.up,
    down: migration_20260820_113912_mig_057_logo_marquee_list.down,
    name: '20260820_113912_mig_057_logo_marquee_list',
  },
  {
    up: migration_20260820_120441_mig_058_home_blocks.up,
    down: migration_20260820_120441_mig_058_home_blocks.down,
    name: '20260820_120441_mig_058_home_blocks',
  },
  {
    up: migration_20260820_121347_mig_058_cta_photo.up,
    down: migration_20260820_121347_mig_058_cta_photo.down,
    name: '20260820_121347_mig_058_cta_photo',
  },
  {
    up: migration_20260820_183139_mig_060_insights_hub.up,
    down: migration_20260820_183139_mig_060_insights_hub.down,
    name: '20260820_183139_mig_060_insights_hub',
  },
  {
    up: migration_20260820_185404_mig_061_atra_ai.up,
    down: migration_20260820_185404_mig_061_atra_ai.down,
    name: '20260820_185404_mig_061_atra_ai',
  },
  {
    up: migration_20260820_210222_mig_071_clients.up,
    down: migration_20260820_210222_mig_071_clients.down,
    name: '20260820_210222_mig_071_clients',
  },
  {
    up: migration_20260820_210425_mig_071_sem_arrays_na_home.up,
    down: migration_20260820_210425_mig_071_sem_arrays_na_home.down,
    name: '20260820_210425_mig_071_sem_arrays_na_home'
  },
];
