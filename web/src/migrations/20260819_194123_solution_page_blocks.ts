import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_partners_blocks_page_hero_metrics_color" AS ENUM('primary', 'secondary', 'emerald');
  CREATE TYPE "public"."enum_partners_blocks_page_hero_cta_variant" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum_partners_blocks_page_hero_description_width" AS ENUM('narrow', 'wide');
  CREATE TYPE "public"."enum_partners_blocks_sticky_page_nav_variant" AS ENUM('institutional', 'solution');
  CREATE TYPE "public"."enum_partners_blocks_method_cards_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up');
  CREATE TYPE "public"."enum_partners_blocks_method_cards_items_accent" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum_partners_blocks_method_cards_eyebrow_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up');
  CREATE TYPE "public"."enum_partners_blocks_method_cards_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_partners_blocks_method_cards_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_partners_blocks_bento_grid_items_metrics_color" AS ENUM('primary', 'secondary', 'emerald');
  CREATE TYPE "public"."enum_partners_blocks_bento_grid_items_span" AS ENUM('5', '6', '7', '12');
  CREATE TYPE "public"."enum_partners_blocks_bento_grid_items_size" AS ENUM('featured-wide', 'featured', 'supporting');
  CREATE TYPE "public"."enum_partners_blocks_bento_grid_items_accent" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum_partners_blocks_bento_grid_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up');
  CREATE TYPE "public"."enum_partners_blocks_bento_grid_eyebrow_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up');
  CREATE TYPE "public"."enum_partners_blocks_bento_grid_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_partners_blocks_bento_grid_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_partners_blocks_audience_split_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up');
  CREATE TYPE "public"."enum_partners_blocks_audience_split_items_accent" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum_partners_blocks_audience_split_eyebrow_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up');
  CREATE TYPE "public"."enum_partners_blocks_audience_split_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_partners_blocks_audience_split_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_partners_blocks_accordion_steps_eyebrow_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up');
  CREATE TYPE "public"."enum_partners_blocks_accordion_steps_image_badge_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up');
  CREATE TYPE "public"."enum_partners_blocks_accordion_steps_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_partners_blocks_accordion_steps_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_pages_blocks_page_hero_metrics_color" AS ENUM('primary', 'secondary', 'emerald');
  CREATE TYPE "public"."enum_pages_blocks_page_hero_cta_variant" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum_pages_blocks_page_hero_description_width" AS ENUM('narrow', 'wide');
  CREATE TYPE "public"."enum_pages_blocks_sticky_page_nav_variant" AS ENUM('institutional', 'solution');
  CREATE TYPE "public"."enum_pages_blocks_method_cards_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up');
  CREATE TYPE "public"."enum_pages_blocks_method_cards_items_accent" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum_pages_blocks_method_cards_eyebrow_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up');
  CREATE TYPE "public"."enum_pages_blocks_method_cards_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_pages_blocks_method_cards_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_pages_blocks_bento_grid_items_metrics_color" AS ENUM('primary', 'secondary', 'emerald');
  CREATE TYPE "public"."enum_pages_blocks_bento_grid_items_span" AS ENUM('5', '6', '7', '12');
  CREATE TYPE "public"."enum_pages_blocks_bento_grid_items_size" AS ENUM('featured-wide', 'featured', 'supporting');
  CREATE TYPE "public"."enum_pages_blocks_bento_grid_items_accent" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum_pages_blocks_bento_grid_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up');
  CREATE TYPE "public"."enum_pages_blocks_bento_grid_eyebrow_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up');
  CREATE TYPE "public"."enum_pages_blocks_bento_grid_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_pages_blocks_bento_grid_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_pages_blocks_audience_split_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up');
  CREATE TYPE "public"."enum_pages_blocks_audience_split_items_accent" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum_pages_blocks_audience_split_eyebrow_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up');
  CREATE TYPE "public"."enum_pages_blocks_audience_split_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_pages_blocks_audience_split_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_pages_blocks_accordion_steps_eyebrow_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up');
  CREATE TYPE "public"."enum_pages_blocks_accordion_steps_image_badge_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up');
  CREATE TYPE "public"."enum_pages_blocks_accordion_steps_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_pages_blocks_accordion_steps_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__pages_v_blocks_page_hero_metrics_color" AS ENUM('primary', 'secondary', 'emerald');
  CREATE TYPE "public"."enum__pages_v_blocks_page_hero_cta_variant" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum__pages_v_blocks_page_hero_description_width" AS ENUM('narrow', 'wide');
  CREATE TYPE "public"."enum__pages_v_blocks_sticky_page_nav_variant" AS ENUM('institutional', 'solution');
  CREATE TYPE "public"."enum__pages_v_blocks_method_cards_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up');
  CREATE TYPE "public"."enum__pages_v_blocks_method_cards_items_accent" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum__pages_v_blocks_method_cards_eyebrow_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up');
  CREATE TYPE "public"."enum__pages_v_blocks_method_cards_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__pages_v_blocks_method_cards_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__pages_v_blocks_bento_grid_items_metrics_color" AS ENUM('primary', 'secondary', 'emerald');
  CREATE TYPE "public"."enum__pages_v_blocks_bento_grid_items_span" AS ENUM('5', '6', '7', '12');
  CREATE TYPE "public"."enum__pages_v_blocks_bento_grid_items_size" AS ENUM('featured-wide', 'featured', 'supporting');
  CREATE TYPE "public"."enum__pages_v_blocks_bento_grid_items_accent" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum__pages_v_blocks_bento_grid_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up');
  CREATE TYPE "public"."enum__pages_v_blocks_bento_grid_eyebrow_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up');
  CREATE TYPE "public"."enum__pages_v_blocks_bento_grid_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__pages_v_blocks_bento_grid_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__pages_v_blocks_audience_split_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up');
  CREATE TYPE "public"."enum__pages_v_blocks_audience_split_items_accent" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum__pages_v_blocks_audience_split_eyebrow_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up');
  CREATE TYPE "public"."enum__pages_v_blocks_audience_split_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__pages_v_blocks_audience_split_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__pages_v_blocks_accordion_steps_eyebrow_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up');
  CREATE TYPE "public"."enum__pages_v_blocks_accordion_steps_image_badge_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up');
  CREATE TYPE "public"."enum__pages_v_blocks_accordion_steps_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__pages_v_blocks_accordion_steps_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_solutions_blocks_page_hero_metrics_color" AS ENUM('primary', 'secondary', 'emerald');
  CREATE TYPE "public"."enum_solutions_blocks_page_hero_cta_variant" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum_solutions_blocks_page_hero_description_width" AS ENUM('narrow', 'wide');
  CREATE TYPE "public"."enum_solutions_blocks_sticky_page_nav_variant" AS ENUM('institutional', 'solution');
  CREATE TYPE "public"."enum_solutions_blocks_method_cards_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up');
  CREATE TYPE "public"."enum_solutions_blocks_method_cards_items_accent" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum_solutions_blocks_method_cards_eyebrow_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up');
  CREATE TYPE "public"."enum_solutions_blocks_method_cards_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_solutions_blocks_method_cards_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_solutions_blocks_bento_grid_items_metrics_color" AS ENUM('primary', 'secondary', 'emerald');
  CREATE TYPE "public"."enum_solutions_blocks_bento_grid_items_span" AS ENUM('5', '6', '7', '12');
  CREATE TYPE "public"."enum_solutions_blocks_bento_grid_items_size" AS ENUM('featured-wide', 'featured', 'supporting');
  CREATE TYPE "public"."enum_solutions_blocks_bento_grid_items_accent" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum_solutions_blocks_bento_grid_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up');
  CREATE TYPE "public"."enum_solutions_blocks_bento_grid_eyebrow_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up');
  CREATE TYPE "public"."enum_solutions_blocks_bento_grid_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_solutions_blocks_bento_grid_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_solutions_blocks_audience_split_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up');
  CREATE TYPE "public"."enum_solutions_blocks_audience_split_items_accent" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum_solutions_blocks_audience_split_eyebrow_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up');
  CREATE TYPE "public"."enum_solutions_blocks_audience_split_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_solutions_blocks_audience_split_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_solutions_blocks_accordion_steps_eyebrow_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up');
  CREATE TYPE "public"."enum_solutions_blocks_accordion_steps_image_badge_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up');
  CREATE TYPE "public"."enum_solutions_blocks_accordion_steps_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_solutions_blocks_accordion_steps_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__solutions_v_blocks_page_hero_metrics_color" AS ENUM('primary', 'secondary', 'emerald');
  CREATE TYPE "public"."enum__solutions_v_blocks_page_hero_cta_variant" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum__solutions_v_blocks_page_hero_description_width" AS ENUM('narrow', 'wide');
  CREATE TYPE "public"."enum__solutions_v_blocks_sticky_page_nav_variant" AS ENUM('institutional', 'solution');
  CREATE TYPE "public"."enum__solutions_v_blocks_method_cards_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up');
  CREATE TYPE "public"."enum__solutions_v_blocks_method_cards_items_accent" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum__solutions_v_blocks_method_cards_eyebrow_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up');
  CREATE TYPE "public"."enum__solutions_v_blocks_method_cards_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__solutions_v_blocks_method_cards_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__solutions_v_blocks_bento_grid_items_metrics_color" AS ENUM('primary', 'secondary', 'emerald');
  CREATE TYPE "public"."enum__solutions_v_blocks_bento_grid_items_span" AS ENUM('5', '6', '7', '12');
  CREATE TYPE "public"."enum__solutions_v_blocks_bento_grid_items_size" AS ENUM('featured-wide', 'featured', 'supporting');
  CREATE TYPE "public"."enum__solutions_v_blocks_bento_grid_items_accent" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum__solutions_v_blocks_bento_grid_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up');
  CREATE TYPE "public"."enum__solutions_v_blocks_bento_grid_eyebrow_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up');
  CREATE TYPE "public"."enum__solutions_v_blocks_bento_grid_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__solutions_v_blocks_bento_grid_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__solutions_v_blocks_audience_split_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up');
  CREATE TYPE "public"."enum__solutions_v_blocks_audience_split_items_accent" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum__solutions_v_blocks_audience_split_eyebrow_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up');
  CREATE TYPE "public"."enum__solutions_v_blocks_audience_split_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__solutions_v_blocks_audience_split_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__solutions_v_blocks_accordion_steps_eyebrow_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up');
  CREATE TYPE "public"."enum__solutions_v_blocks_accordion_steps_image_badge_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up');
  CREATE TYPE "public"."enum__solutions_v_blocks_accordion_steps_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__solutions_v_blocks_accordion_steps_theme" AS ENUM('surface-1', 'surface-2');
  ALTER TYPE "public"."enum_partners_blocks_icon_card_grid_items_icon" ADD VALUE 'search';
  ALTER TYPE "public"."enum_partners_blocks_icon_card_grid_items_icon" ADD VALUE 'settings';
  ALTER TYPE "public"."enum_partners_blocks_icon_card_grid_items_icon" ADD VALUE 'zap';
  ALTER TYPE "public"."enum_partners_blocks_icon_card_grid_items_icon" ADD VALUE 'cpu';
  ALTER TYPE "public"."enum_partners_blocks_icon_card_grid_items_icon" ADD VALUE 'shield-check';
  ALTER TYPE "public"."enum_partners_blocks_icon_card_grid_items_icon" ADD VALUE 'trending-up';
  ALTER TYPE "public"."enum_partners_blocks_value_cards_items_icon" ADD VALUE 'search';
  ALTER TYPE "public"."enum_partners_blocks_value_cards_items_icon" ADD VALUE 'settings';
  ALTER TYPE "public"."enum_partners_blocks_value_cards_items_icon" ADD VALUE 'zap';
  ALTER TYPE "public"."enum_partners_blocks_value_cards_items_icon" ADD VALUE 'cpu';
  ALTER TYPE "public"."enum_partners_blocks_value_cards_items_icon" ADD VALUE 'shield-check';
  ALTER TYPE "public"."enum_partners_blocks_value_cards_items_icon" ADD VALUE 'trending-up';
  ALTER TYPE "public"."enum_partners_blocks_cta_banner_variant" ADD VALUE 'dark';
  ALTER TYPE "public"."enum_pages_blocks_icon_card_grid_items_icon" ADD VALUE 'search';
  ALTER TYPE "public"."enum_pages_blocks_icon_card_grid_items_icon" ADD VALUE 'settings';
  ALTER TYPE "public"."enum_pages_blocks_icon_card_grid_items_icon" ADD VALUE 'zap';
  ALTER TYPE "public"."enum_pages_blocks_icon_card_grid_items_icon" ADD VALUE 'cpu';
  ALTER TYPE "public"."enum_pages_blocks_icon_card_grid_items_icon" ADD VALUE 'shield-check';
  ALTER TYPE "public"."enum_pages_blocks_icon_card_grid_items_icon" ADD VALUE 'trending-up';
  ALTER TYPE "public"."enum_pages_blocks_value_cards_items_icon" ADD VALUE 'search';
  ALTER TYPE "public"."enum_pages_blocks_value_cards_items_icon" ADD VALUE 'settings';
  ALTER TYPE "public"."enum_pages_blocks_value_cards_items_icon" ADD VALUE 'zap';
  ALTER TYPE "public"."enum_pages_blocks_value_cards_items_icon" ADD VALUE 'cpu';
  ALTER TYPE "public"."enum_pages_blocks_value_cards_items_icon" ADD VALUE 'shield-check';
  ALTER TYPE "public"."enum_pages_blocks_value_cards_items_icon" ADD VALUE 'trending-up';
  ALTER TYPE "public"."enum_pages_blocks_cta_banner_variant" ADD VALUE 'dark';
  ALTER TYPE "public"."enum__pages_v_blocks_icon_card_grid_items_icon" ADD VALUE 'search';
  ALTER TYPE "public"."enum__pages_v_blocks_icon_card_grid_items_icon" ADD VALUE 'settings';
  ALTER TYPE "public"."enum__pages_v_blocks_icon_card_grid_items_icon" ADD VALUE 'zap';
  ALTER TYPE "public"."enum__pages_v_blocks_icon_card_grid_items_icon" ADD VALUE 'cpu';
  ALTER TYPE "public"."enum__pages_v_blocks_icon_card_grid_items_icon" ADD VALUE 'shield-check';
  ALTER TYPE "public"."enum__pages_v_blocks_icon_card_grid_items_icon" ADD VALUE 'trending-up';
  ALTER TYPE "public"."enum__pages_v_blocks_value_cards_items_icon" ADD VALUE 'search';
  ALTER TYPE "public"."enum__pages_v_blocks_value_cards_items_icon" ADD VALUE 'settings';
  ALTER TYPE "public"."enum__pages_v_blocks_value_cards_items_icon" ADD VALUE 'zap';
  ALTER TYPE "public"."enum__pages_v_blocks_value_cards_items_icon" ADD VALUE 'cpu';
  ALTER TYPE "public"."enum__pages_v_blocks_value_cards_items_icon" ADD VALUE 'shield-check';
  ALTER TYPE "public"."enum__pages_v_blocks_value_cards_items_icon" ADD VALUE 'trending-up';
  ALTER TYPE "public"."enum__pages_v_blocks_cta_banner_variant" ADD VALUE 'dark';
  ALTER TYPE "public"."enum_solutions_blocks_icon_card_grid_items_icon" ADD VALUE 'search';
  ALTER TYPE "public"."enum_solutions_blocks_icon_card_grid_items_icon" ADD VALUE 'settings';
  ALTER TYPE "public"."enum_solutions_blocks_icon_card_grid_items_icon" ADD VALUE 'zap';
  ALTER TYPE "public"."enum_solutions_blocks_icon_card_grid_items_icon" ADD VALUE 'cpu';
  ALTER TYPE "public"."enum_solutions_blocks_icon_card_grid_items_icon" ADD VALUE 'shield-check';
  ALTER TYPE "public"."enum_solutions_blocks_icon_card_grid_items_icon" ADD VALUE 'trending-up';
  ALTER TYPE "public"."enum_solutions_blocks_value_cards_items_icon" ADD VALUE 'search';
  ALTER TYPE "public"."enum_solutions_blocks_value_cards_items_icon" ADD VALUE 'settings';
  ALTER TYPE "public"."enum_solutions_blocks_value_cards_items_icon" ADD VALUE 'zap';
  ALTER TYPE "public"."enum_solutions_blocks_value_cards_items_icon" ADD VALUE 'cpu';
  ALTER TYPE "public"."enum_solutions_blocks_value_cards_items_icon" ADD VALUE 'shield-check';
  ALTER TYPE "public"."enum_solutions_blocks_value_cards_items_icon" ADD VALUE 'trending-up';
  ALTER TYPE "public"."enum_solutions_blocks_cta_banner_variant" ADD VALUE 'dark';
  ALTER TYPE "public"."enum_solutions_icon" ADD VALUE 'search';
  ALTER TYPE "public"."enum_solutions_icon" ADD VALUE 'settings';
  ALTER TYPE "public"."enum_solutions_icon" ADD VALUE 'zap';
  ALTER TYPE "public"."enum_solutions_icon" ADD VALUE 'cpu';
  ALTER TYPE "public"."enum_solutions_icon" ADD VALUE 'shield-check';
  ALTER TYPE "public"."enum_solutions_icon" ADD VALUE 'trending-up';
  ALTER TYPE "public"."enum__solutions_v_blocks_icon_card_grid_items_icon" ADD VALUE 'search';
  ALTER TYPE "public"."enum__solutions_v_blocks_icon_card_grid_items_icon" ADD VALUE 'settings';
  ALTER TYPE "public"."enum__solutions_v_blocks_icon_card_grid_items_icon" ADD VALUE 'zap';
  ALTER TYPE "public"."enum__solutions_v_blocks_icon_card_grid_items_icon" ADD VALUE 'cpu';
  ALTER TYPE "public"."enum__solutions_v_blocks_icon_card_grid_items_icon" ADD VALUE 'shield-check';
  ALTER TYPE "public"."enum__solutions_v_blocks_icon_card_grid_items_icon" ADD VALUE 'trending-up';
  ALTER TYPE "public"."enum__solutions_v_blocks_value_cards_items_icon" ADD VALUE 'search';
  ALTER TYPE "public"."enum__solutions_v_blocks_value_cards_items_icon" ADD VALUE 'settings';
  ALTER TYPE "public"."enum__solutions_v_blocks_value_cards_items_icon" ADD VALUE 'zap';
  ALTER TYPE "public"."enum__solutions_v_blocks_value_cards_items_icon" ADD VALUE 'cpu';
  ALTER TYPE "public"."enum__solutions_v_blocks_value_cards_items_icon" ADD VALUE 'shield-check';
  ALTER TYPE "public"."enum__solutions_v_blocks_value_cards_items_icon" ADD VALUE 'trending-up';
  ALTER TYPE "public"."enum__solutions_v_blocks_cta_banner_variant" ADD VALUE 'dark';
  ALTER TYPE "public"."enum__solutions_v_version_icon" ADD VALUE 'search';
  ALTER TYPE "public"."enum__solutions_v_version_icon" ADD VALUE 'settings';
  ALTER TYPE "public"."enum__solutions_v_version_icon" ADD VALUE 'zap';
  ALTER TYPE "public"."enum__solutions_v_version_icon" ADD VALUE 'cpu';
  ALTER TYPE "public"."enum__solutions_v_version_icon" ADD VALUE 'shield-check';
  ALTER TYPE "public"."enum__solutions_v_version_icon" ADD VALUE 'trending-up';
  ALTER TYPE "public"."enum_specialist_roles_icon" ADD VALUE 'search';
  ALTER TYPE "public"."enum_specialist_roles_icon" ADD VALUE 'settings';
  ALTER TYPE "public"."enum_specialist_roles_icon" ADD VALUE 'zap';
  ALTER TYPE "public"."enum_specialist_roles_icon" ADD VALUE 'cpu';
  ALTER TYPE "public"."enum_specialist_roles_icon" ADD VALUE 'shield-check';
  ALTER TYPE "public"."enum_specialist_roles_icon" ADD VALUE 'trending-up';
  ALTER TYPE "public"."enum_site_settings_metrics_icon" ADD VALUE 'search';
  ALTER TYPE "public"."enum_site_settings_metrics_icon" ADD VALUE 'settings';
  ALTER TYPE "public"."enum_site_settings_metrics_icon" ADD VALUE 'zap';
  ALTER TYPE "public"."enum_site_settings_metrics_icon" ADD VALUE 'cpu';
  ALTER TYPE "public"."enum_site_settings_metrics_icon" ADD VALUE 'shield-check';
  ALTER TYPE "public"."enum_site_settings_metrics_icon" ADD VALUE 'trending-up';
  CREATE TABLE "partners_blocks_page_hero_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" numeric,
  	"suffix" varchar,
  	"color" "enum_partners_blocks_page_hero_metrics_color" DEFAULT 'primary'
  );
  
  CREATE TABLE "partners_blocks_page_hero_metrics_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partners_blocks_method_cards_items_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "partners_blocks_method_cards_items_bullets_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partners_blocks_method_cards_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_partners_blocks_method_cards_items_icon" DEFAULT 'sparkles',
  	"accent" "enum_partners_blocks_method_cards_items_accent" DEFAULT 'primary'
  );
  
  CREATE TABLE "partners_blocks_method_cards_items_locales" (
  	"badge" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partners_blocks_method_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow_icon" "enum_partners_blocks_method_cards_eyebrow_icon",
  	"header_cta_href" varchar,
  	"anchor" varchar,
  	"borda" "enum_partners_blocks_method_cards_borda" DEFAULT 'nenhuma',
  	"theme" "enum_partners_blocks_method_cards_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "partners_blocks_method_cards_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"header_cta_label" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partners_blocks_bento_grid_items_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"color" "enum_partners_blocks_bento_grid_items_metrics_color" DEFAULT 'primary'
  );
  
  CREATE TABLE "partners_blocks_bento_grid_items_metrics_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partners_blocks_bento_grid_items_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "partners_blocks_bento_grid_items_tags_locales" (
  	"name" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partners_blocks_bento_grid_items_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "partners_blocks_bento_grid_items_bullets_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partners_blocks_bento_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"span" "enum_partners_blocks_bento_grid_items_span" DEFAULT '6',
  	"size" "enum_partners_blocks_bento_grid_items_size" DEFAULT 'supporting',
  	"accent" "enum_partners_blocks_bento_grid_items_accent" DEFAULT 'primary',
  	"icon" "enum_partners_blocks_bento_grid_items_icon"
  );
  
  CREATE TABLE "partners_blocks_bento_grid_items_locales" (
  	"badge" varchar,
  	"chip" varchar,
  	"title" varchar,
  	"description" varchar,
  	"footer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partners_blocks_bento_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow_icon" "enum_partners_blocks_bento_grid_eyebrow_icon",
  	"anchor" varchar,
  	"borda" "enum_partners_blocks_bento_grid_borda" DEFAULT 'nenhuma',
  	"theme" "enum_partners_blocks_bento_grid_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "partners_blocks_bento_grid_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partners_blocks_audience_split_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_partners_blocks_audience_split_items_icon" DEFAULT 'sparkles',
  	"accent" "enum_partners_blocks_audience_split_items_accent" DEFAULT 'primary'
  );
  
  CREATE TABLE "partners_blocks_audience_split_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partners_blocks_audience_split" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow_icon" "enum_partners_blocks_audience_split_eyebrow_icon",
  	"cta_href" varchar,
  	"anchor" varchar,
  	"borda" "enum_partners_blocks_audience_split_borda" DEFAULT 'nenhuma',
  	"theme" "enum_partners_blocks_audience_split_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "partners_blocks_audience_split_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partners_blocks_accordion_steps_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "partners_blocks_accordion_steps_steps_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partners_blocks_accordion_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow_icon" "enum_partners_blocks_accordion_steps_eyebrow_icon",
  	"image_id" integer,
  	"image_badge_icon" "enum_partners_blocks_accordion_steps_image_badge_icon",
  	"anchor" varchar,
  	"borda" "enum_partners_blocks_accordion_steps_borda" DEFAULT 'nenhuma',
  	"theme" "enum_partners_blocks_accordion_steps_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "partners_blocks_accordion_steps_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"image_badge_title" varchar,
  	"image_badge_subtitle" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_page_hero_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" numeric,
  	"suffix" varchar,
  	"color" "enum_pages_blocks_page_hero_metrics_color" DEFAULT 'primary'
  );
  
  CREATE TABLE "pages_blocks_page_hero_metrics_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_method_cards_items_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_method_cards_items_bullets_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_method_cards_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_method_cards_items_icon" DEFAULT 'sparkles',
  	"accent" "enum_pages_blocks_method_cards_items_accent" DEFAULT 'primary'
  );
  
  CREATE TABLE "pages_blocks_method_cards_items_locales" (
  	"badge" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_method_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow_icon" "enum_pages_blocks_method_cards_eyebrow_icon",
  	"header_cta_href" varchar,
  	"anchor" varchar,
  	"borda" "enum_pages_blocks_method_cards_borda" DEFAULT 'nenhuma',
  	"theme" "enum_pages_blocks_method_cards_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_method_cards_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"header_cta_label" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_bento_grid_items_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"color" "enum_pages_blocks_bento_grid_items_metrics_color" DEFAULT 'primary'
  );
  
  CREATE TABLE "pages_blocks_bento_grid_items_metrics_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_bento_grid_items_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_bento_grid_items_tags_locales" (
  	"name" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_bento_grid_items_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_bento_grid_items_bullets_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_bento_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"span" "enum_pages_blocks_bento_grid_items_span" DEFAULT '6',
  	"size" "enum_pages_blocks_bento_grid_items_size" DEFAULT 'supporting',
  	"accent" "enum_pages_blocks_bento_grid_items_accent" DEFAULT 'primary',
  	"icon" "enum_pages_blocks_bento_grid_items_icon"
  );
  
  CREATE TABLE "pages_blocks_bento_grid_items_locales" (
  	"badge" varchar,
  	"chip" varchar,
  	"title" varchar,
  	"description" varchar,
  	"footer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_bento_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow_icon" "enum_pages_blocks_bento_grid_eyebrow_icon",
  	"anchor" varchar,
  	"borda" "enum_pages_blocks_bento_grid_borda" DEFAULT 'nenhuma',
  	"theme" "enum_pages_blocks_bento_grid_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_bento_grid_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_audience_split_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_audience_split_items_icon" DEFAULT 'sparkles',
  	"accent" "enum_pages_blocks_audience_split_items_accent" DEFAULT 'primary'
  );
  
  CREATE TABLE "pages_blocks_audience_split_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_audience_split" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow_icon" "enum_pages_blocks_audience_split_eyebrow_icon",
  	"cta_href" varchar,
  	"anchor" varchar,
  	"borda" "enum_pages_blocks_audience_split_borda" DEFAULT 'nenhuma',
  	"theme" "enum_pages_blocks_audience_split_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_audience_split_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_accordion_steps_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_accordion_steps_steps_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_accordion_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow_icon" "enum_pages_blocks_accordion_steps_eyebrow_icon",
  	"image_id" integer,
  	"image_badge_icon" "enum_pages_blocks_accordion_steps_image_badge_icon",
  	"anchor" varchar,
  	"borda" "enum_pages_blocks_accordion_steps_borda" DEFAULT 'nenhuma',
  	"theme" "enum_pages_blocks_accordion_steps_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_accordion_steps_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"image_badge_title" varchar,
  	"image_badge_subtitle" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_page_hero_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" numeric,
  	"suffix" varchar,
  	"color" "enum__pages_v_blocks_page_hero_metrics_color" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_page_hero_metrics_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_method_cards_items_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_method_cards_items_bullets_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_method_cards_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_blocks_method_cards_items_icon" DEFAULT 'sparkles',
  	"accent" "enum__pages_v_blocks_method_cards_items_accent" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_method_cards_items_locales" (
  	"badge" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_method_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow_icon" "enum__pages_v_blocks_method_cards_eyebrow_icon",
  	"header_cta_href" varchar,
  	"anchor" varchar,
  	"borda" "enum__pages_v_blocks_method_cards_borda" DEFAULT 'nenhuma',
  	"theme" "enum__pages_v_blocks_method_cards_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_method_cards_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"header_cta_label" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_bento_grid_items_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"color" "enum__pages_v_blocks_bento_grid_items_metrics_color" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_bento_grid_items_metrics_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_bento_grid_items_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_bento_grid_items_tags_locales" (
  	"name" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_bento_grid_items_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_bento_grid_items_bullets_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_bento_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"span" "enum__pages_v_blocks_bento_grid_items_span" DEFAULT '6',
  	"size" "enum__pages_v_blocks_bento_grid_items_size" DEFAULT 'supporting',
  	"accent" "enum__pages_v_blocks_bento_grid_items_accent" DEFAULT 'primary',
  	"icon" "enum__pages_v_blocks_bento_grid_items_icon",
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_bento_grid_items_locales" (
  	"badge" varchar,
  	"chip" varchar,
  	"title" varchar,
  	"description" varchar,
  	"footer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_bento_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow_icon" "enum__pages_v_blocks_bento_grid_eyebrow_icon",
  	"anchor" varchar,
  	"borda" "enum__pages_v_blocks_bento_grid_borda" DEFAULT 'nenhuma',
  	"theme" "enum__pages_v_blocks_bento_grid_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_bento_grid_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_audience_split_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_blocks_audience_split_items_icon" DEFAULT 'sparkles',
  	"accent" "enum__pages_v_blocks_audience_split_items_accent" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_audience_split_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_audience_split" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow_icon" "enum__pages_v_blocks_audience_split_eyebrow_icon",
  	"cta_href" varchar,
  	"anchor" varchar,
  	"borda" "enum__pages_v_blocks_audience_split_borda" DEFAULT 'nenhuma',
  	"theme" "enum__pages_v_blocks_audience_split_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_audience_split_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_accordion_steps_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_accordion_steps_steps_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_accordion_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow_icon" "enum__pages_v_blocks_accordion_steps_eyebrow_icon",
  	"image_id" integer,
  	"image_badge_icon" "enum__pages_v_blocks_accordion_steps_image_badge_icon",
  	"anchor" varchar,
  	"borda" "enum__pages_v_blocks_accordion_steps_borda" DEFAULT 'nenhuma',
  	"theme" "enum__pages_v_blocks_accordion_steps_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_accordion_steps_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"image_badge_title" varchar,
  	"image_badge_subtitle" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_page_hero_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" numeric,
  	"suffix" varchar,
  	"color" "enum_solutions_blocks_page_hero_metrics_color" DEFAULT 'primary'
  );
  
  CREATE TABLE "solutions_blocks_page_hero_metrics_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_method_cards_items_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_method_cards_items_bullets_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_method_cards_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_solutions_blocks_method_cards_items_icon" DEFAULT 'sparkles',
  	"accent" "enum_solutions_blocks_method_cards_items_accent" DEFAULT 'primary'
  );
  
  CREATE TABLE "solutions_blocks_method_cards_items_locales" (
  	"badge" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_method_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow_icon" "enum_solutions_blocks_method_cards_eyebrow_icon",
  	"header_cta_href" varchar,
  	"anchor" varchar,
  	"borda" "enum_solutions_blocks_method_cards_borda" DEFAULT 'nenhuma',
  	"theme" "enum_solutions_blocks_method_cards_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "solutions_blocks_method_cards_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"header_cta_label" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_bento_grid_items_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"color" "enum_solutions_blocks_bento_grid_items_metrics_color" DEFAULT 'primary'
  );
  
  CREATE TABLE "solutions_blocks_bento_grid_items_metrics_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_bento_grid_items_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_bento_grid_items_tags_locales" (
  	"name" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_bento_grid_items_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_bento_grid_items_bullets_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_bento_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"span" "enum_solutions_blocks_bento_grid_items_span" DEFAULT '6',
  	"size" "enum_solutions_blocks_bento_grid_items_size" DEFAULT 'supporting',
  	"accent" "enum_solutions_blocks_bento_grid_items_accent" DEFAULT 'primary',
  	"icon" "enum_solutions_blocks_bento_grid_items_icon"
  );
  
  CREATE TABLE "solutions_blocks_bento_grid_items_locales" (
  	"badge" varchar,
  	"chip" varchar,
  	"title" varchar,
  	"description" varchar,
  	"footer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_bento_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow_icon" "enum_solutions_blocks_bento_grid_eyebrow_icon",
  	"anchor" varchar,
  	"borda" "enum_solutions_blocks_bento_grid_borda" DEFAULT 'nenhuma',
  	"theme" "enum_solutions_blocks_bento_grid_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "solutions_blocks_bento_grid_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_audience_split_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_solutions_blocks_audience_split_items_icon" DEFAULT 'sparkles',
  	"accent" "enum_solutions_blocks_audience_split_items_accent" DEFAULT 'primary'
  );
  
  CREATE TABLE "solutions_blocks_audience_split_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_audience_split" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow_icon" "enum_solutions_blocks_audience_split_eyebrow_icon",
  	"cta_href" varchar,
  	"anchor" varchar,
  	"borda" "enum_solutions_blocks_audience_split_borda" DEFAULT 'nenhuma',
  	"theme" "enum_solutions_blocks_audience_split_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "solutions_blocks_audience_split_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_accordion_steps_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_accordion_steps_steps_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_accordion_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow_icon" "enum_solutions_blocks_accordion_steps_eyebrow_icon",
  	"image_id" integer,
  	"image_badge_icon" "enum_solutions_blocks_accordion_steps_image_badge_icon",
  	"anchor" varchar,
  	"borda" "enum_solutions_blocks_accordion_steps_borda" DEFAULT 'nenhuma',
  	"theme" "enum_solutions_blocks_accordion_steps_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "solutions_blocks_accordion_steps_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"image_badge_title" varchar,
  	"image_badge_subtitle" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_page_hero_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" numeric,
  	"suffix" varchar,
  	"color" "enum__solutions_v_blocks_page_hero_metrics_color" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_page_hero_metrics_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_method_cards_items_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_method_cards_items_bullets_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_method_cards_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__solutions_v_blocks_method_cards_items_icon" DEFAULT 'sparkles',
  	"accent" "enum__solutions_v_blocks_method_cards_items_accent" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_method_cards_items_locales" (
  	"badge" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_method_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow_icon" "enum__solutions_v_blocks_method_cards_eyebrow_icon",
  	"header_cta_href" varchar,
  	"anchor" varchar,
  	"borda" "enum__solutions_v_blocks_method_cards_borda" DEFAULT 'nenhuma',
  	"theme" "enum__solutions_v_blocks_method_cards_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_method_cards_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"header_cta_label" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_bento_grid_items_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"color" "enum__solutions_v_blocks_bento_grid_items_metrics_color" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_bento_grid_items_metrics_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_bento_grid_items_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_bento_grid_items_tags_locales" (
  	"name" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_bento_grid_items_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_bento_grid_items_bullets_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_bento_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"span" "enum__solutions_v_blocks_bento_grid_items_span" DEFAULT '6',
  	"size" "enum__solutions_v_blocks_bento_grid_items_size" DEFAULT 'supporting',
  	"accent" "enum__solutions_v_blocks_bento_grid_items_accent" DEFAULT 'primary',
  	"icon" "enum__solutions_v_blocks_bento_grid_items_icon",
  	"_uuid" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_bento_grid_items_locales" (
  	"badge" varchar,
  	"chip" varchar,
  	"title" varchar,
  	"description" varchar,
  	"footer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_bento_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow_icon" "enum__solutions_v_blocks_bento_grid_eyebrow_icon",
  	"anchor" varchar,
  	"borda" "enum__solutions_v_blocks_bento_grid_borda" DEFAULT 'nenhuma',
  	"theme" "enum__solutions_v_blocks_bento_grid_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_bento_grid_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_audience_split_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__solutions_v_blocks_audience_split_items_icon" DEFAULT 'sparkles',
  	"accent" "enum__solutions_v_blocks_audience_split_items_accent" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_audience_split_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_audience_split" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow_icon" "enum__solutions_v_blocks_audience_split_eyebrow_icon",
  	"cta_href" varchar,
  	"anchor" varchar,
  	"borda" "enum__solutions_v_blocks_audience_split_borda" DEFAULT 'nenhuma',
  	"theme" "enum__solutions_v_blocks_audience_split_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_audience_split_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_accordion_steps_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_accordion_steps_steps_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_accordion_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow_icon" "enum__solutions_v_blocks_accordion_steps_eyebrow_icon",
  	"image_id" integer,
  	"image_badge_icon" "enum__solutions_v_blocks_accordion_steps_image_badge_icon",
  	"anchor" varchar,
  	"borda" "enum__solutions_v_blocks_accordion_steps_borda" DEFAULT 'nenhuma',
  	"theme" "enum__solutions_v_blocks_accordion_steps_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_accordion_steps_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"image_badge_title" varchar,
  	"image_badge_subtitle" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "partners_blocks_page_hero" ADD COLUMN "cta_variant" "enum_partners_blocks_page_hero_cta_variant" DEFAULT 'primary';
  ALTER TABLE "partners_blocks_page_hero" ADD COLUMN "description_width" "enum_partners_blocks_page_hero_description_width" DEFAULT 'narrow';
  ALTER TABLE "partners_blocks_sticky_page_nav" ADD COLUMN "variant" "enum_partners_blocks_sticky_page_nav_variant" DEFAULT 'institutional';
  ALTER TABLE "partners_blocks_cta_banner" ADD COLUMN "secondary_cta_href" varchar;
  ALTER TABLE "partners_blocks_cta_banner_locales" ADD COLUMN "secondary_cta_label" varchar;
  ALTER TABLE "partners_blocks_cta_banner_locales" ADD COLUMN "secondary_cta_caption" varchar;
  ALTER TABLE "pages_blocks_page_hero" ADD COLUMN "cta_variant" "enum_pages_blocks_page_hero_cta_variant" DEFAULT 'primary';
  ALTER TABLE "pages_blocks_page_hero" ADD COLUMN "description_width" "enum_pages_blocks_page_hero_description_width" DEFAULT 'narrow';
  ALTER TABLE "pages_blocks_sticky_page_nav" ADD COLUMN "variant" "enum_pages_blocks_sticky_page_nav_variant" DEFAULT 'institutional';
  ALTER TABLE "pages_blocks_cta_banner" ADD COLUMN "secondary_cta_href" varchar;
  ALTER TABLE "pages_blocks_cta_banner_locales" ADD COLUMN "secondary_cta_label" varchar;
  ALTER TABLE "pages_blocks_cta_banner_locales" ADD COLUMN "secondary_cta_caption" varchar;
  ALTER TABLE "_pages_v_blocks_page_hero" ADD COLUMN "cta_variant" "enum__pages_v_blocks_page_hero_cta_variant" DEFAULT 'primary';
  ALTER TABLE "_pages_v_blocks_page_hero" ADD COLUMN "description_width" "enum__pages_v_blocks_page_hero_description_width" DEFAULT 'narrow';
  ALTER TABLE "_pages_v_blocks_sticky_page_nav" ADD COLUMN "variant" "enum__pages_v_blocks_sticky_page_nav_variant" DEFAULT 'institutional';
  ALTER TABLE "_pages_v_blocks_cta_banner" ADD COLUMN "secondary_cta_href" varchar;
  ALTER TABLE "_pages_v_blocks_cta_banner_locales" ADD COLUMN "secondary_cta_label" varchar;
  ALTER TABLE "_pages_v_blocks_cta_banner_locales" ADD COLUMN "secondary_cta_caption" varchar;
  ALTER TABLE "solutions_blocks_page_hero" ADD COLUMN "cta_variant" "enum_solutions_blocks_page_hero_cta_variant" DEFAULT 'primary';
  ALTER TABLE "solutions_blocks_page_hero" ADD COLUMN "description_width" "enum_solutions_blocks_page_hero_description_width" DEFAULT 'narrow';
  ALTER TABLE "solutions_blocks_sticky_page_nav" ADD COLUMN "variant" "enum_solutions_blocks_sticky_page_nav_variant" DEFAULT 'institutional';
  ALTER TABLE "solutions_blocks_cta_banner" ADD COLUMN "secondary_cta_href" varchar;
  ALTER TABLE "solutions_blocks_cta_banner_locales" ADD COLUMN "secondary_cta_label" varchar;
  ALTER TABLE "solutions_blocks_cta_banner_locales" ADD COLUMN "secondary_cta_caption" varchar;
  ALTER TABLE "_solutions_v_blocks_page_hero" ADD COLUMN "cta_variant" "enum__solutions_v_blocks_page_hero_cta_variant" DEFAULT 'primary';
  ALTER TABLE "_solutions_v_blocks_page_hero" ADD COLUMN "description_width" "enum__solutions_v_blocks_page_hero_description_width" DEFAULT 'narrow';
  ALTER TABLE "_solutions_v_blocks_sticky_page_nav" ADD COLUMN "variant" "enum__solutions_v_blocks_sticky_page_nav_variant" DEFAULT 'institutional';
  ALTER TABLE "_solutions_v_blocks_cta_banner" ADD COLUMN "secondary_cta_href" varchar;
  ALTER TABLE "_solutions_v_blocks_cta_banner_locales" ADD COLUMN "secondary_cta_label" varchar;
  ALTER TABLE "_solutions_v_blocks_cta_banner_locales" ADD COLUMN "secondary_cta_caption" varchar;
  ALTER TABLE "partners_blocks_page_hero_metrics" ADD CONSTRAINT "partners_blocks_page_hero_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_page_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_page_hero_metrics_locales" ADD CONSTRAINT "partners_blocks_page_hero_metrics_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_page_hero_metrics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_method_cards_items_bullets" ADD CONSTRAINT "partners_blocks_method_cards_items_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_method_cards_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_method_cards_items_bullets_locales" ADD CONSTRAINT "partners_blocks_method_cards_items_bullets_locales_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_method_cards_items_bullets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_method_cards_items" ADD CONSTRAINT "partners_blocks_method_cards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_method_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_method_cards_items_locales" ADD CONSTRAINT "partners_blocks_method_cards_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_method_cards_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_method_cards" ADD CONSTRAINT "partners_blocks_method_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_method_cards_locales" ADD CONSTRAINT "partners_blocks_method_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_method_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_bento_grid_items_metrics" ADD CONSTRAINT "partners_blocks_bento_grid_items_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_bento_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_bento_grid_items_metrics_locales" ADD CONSTRAINT "partners_blocks_bento_grid_items_metrics_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_bento_grid_items_metrics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_bento_grid_items_tags" ADD CONSTRAINT "partners_blocks_bento_grid_items_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_bento_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_bento_grid_items_tags_locales" ADD CONSTRAINT "partners_blocks_bento_grid_items_tags_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_bento_grid_items_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_bento_grid_items_bullets" ADD CONSTRAINT "partners_blocks_bento_grid_items_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_bento_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_bento_grid_items_bullets_locales" ADD CONSTRAINT "partners_blocks_bento_grid_items_bullets_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_bento_grid_items_bullets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_bento_grid_items" ADD CONSTRAINT "partners_blocks_bento_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_bento_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_bento_grid_items_locales" ADD CONSTRAINT "partners_blocks_bento_grid_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_bento_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_bento_grid" ADD CONSTRAINT "partners_blocks_bento_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_bento_grid_locales" ADD CONSTRAINT "partners_blocks_bento_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_bento_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_audience_split_items" ADD CONSTRAINT "partners_blocks_audience_split_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_audience_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_audience_split_items_locales" ADD CONSTRAINT "partners_blocks_audience_split_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_audience_split_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_audience_split" ADD CONSTRAINT "partners_blocks_audience_split_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_audience_split_locales" ADD CONSTRAINT "partners_blocks_audience_split_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_audience_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_accordion_steps_steps" ADD CONSTRAINT "partners_blocks_accordion_steps_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_accordion_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_accordion_steps_steps_locales" ADD CONSTRAINT "partners_blocks_accordion_steps_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_accordion_steps_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_accordion_steps" ADD CONSTRAINT "partners_blocks_accordion_steps_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partners_blocks_accordion_steps" ADD CONSTRAINT "partners_blocks_accordion_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_accordion_steps_locales" ADD CONSTRAINT "partners_blocks_accordion_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_accordion_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_page_hero_metrics" ADD CONSTRAINT "pages_blocks_page_hero_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_page_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_page_hero_metrics_locales" ADD CONSTRAINT "pages_blocks_page_hero_metrics_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_page_hero_metrics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_method_cards_items_bullets" ADD CONSTRAINT "pages_blocks_method_cards_items_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_method_cards_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_method_cards_items_bullets_locales" ADD CONSTRAINT "pages_blocks_method_cards_items_bullets_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_method_cards_items_bullets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_method_cards_items" ADD CONSTRAINT "pages_blocks_method_cards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_method_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_method_cards_items_locales" ADD CONSTRAINT "pages_blocks_method_cards_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_method_cards_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_method_cards" ADD CONSTRAINT "pages_blocks_method_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_method_cards_locales" ADD CONSTRAINT "pages_blocks_method_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_method_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_bento_grid_items_metrics" ADD CONSTRAINT "pages_blocks_bento_grid_items_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_bento_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_bento_grid_items_metrics_locales" ADD CONSTRAINT "pages_blocks_bento_grid_items_metrics_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_bento_grid_items_metrics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_bento_grid_items_tags" ADD CONSTRAINT "pages_blocks_bento_grid_items_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_bento_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_bento_grid_items_tags_locales" ADD CONSTRAINT "pages_blocks_bento_grid_items_tags_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_bento_grid_items_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_bento_grid_items_bullets" ADD CONSTRAINT "pages_blocks_bento_grid_items_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_bento_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_bento_grid_items_bullets_locales" ADD CONSTRAINT "pages_blocks_bento_grid_items_bullets_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_bento_grid_items_bullets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_bento_grid_items" ADD CONSTRAINT "pages_blocks_bento_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_bento_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_bento_grid_items_locales" ADD CONSTRAINT "pages_blocks_bento_grid_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_bento_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_bento_grid" ADD CONSTRAINT "pages_blocks_bento_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_bento_grid_locales" ADD CONSTRAINT "pages_blocks_bento_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_bento_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_audience_split_items" ADD CONSTRAINT "pages_blocks_audience_split_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_audience_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_audience_split_items_locales" ADD CONSTRAINT "pages_blocks_audience_split_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_audience_split_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_audience_split" ADD CONSTRAINT "pages_blocks_audience_split_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_audience_split_locales" ADD CONSTRAINT "pages_blocks_audience_split_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_audience_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_accordion_steps_steps" ADD CONSTRAINT "pages_blocks_accordion_steps_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_accordion_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_accordion_steps_steps_locales" ADD CONSTRAINT "pages_blocks_accordion_steps_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_accordion_steps_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_accordion_steps" ADD CONSTRAINT "pages_blocks_accordion_steps_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_accordion_steps" ADD CONSTRAINT "pages_blocks_accordion_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_accordion_steps_locales" ADD CONSTRAINT "pages_blocks_accordion_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_accordion_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_page_hero_metrics" ADD CONSTRAINT "_pages_v_blocks_page_hero_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_page_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_page_hero_metrics_locales" ADD CONSTRAINT "_pages_v_blocks_page_hero_metrics_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_page_hero_metrics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_method_cards_items_bullets" ADD CONSTRAINT "_pages_v_blocks_method_cards_items_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_method_cards_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_method_cards_items_bullets_locales" ADD CONSTRAINT "_pages_v_blocks_method_cards_items_bullets_locales_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_method_cards_items_bullets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_method_cards_items" ADD CONSTRAINT "_pages_v_blocks_method_cards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_method_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_method_cards_items_locales" ADD CONSTRAINT "_pages_v_blocks_method_cards_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_method_cards_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_method_cards" ADD CONSTRAINT "_pages_v_blocks_method_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_method_cards_locales" ADD CONSTRAINT "_pages_v_blocks_method_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_method_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_bento_grid_items_metrics" ADD CONSTRAINT "_pages_v_blocks_bento_grid_items_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_bento_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_bento_grid_items_metrics_locales" ADD CONSTRAINT "_pages_v_blocks_bento_grid_items_metrics_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_bento_grid_items_metrics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_bento_grid_items_tags" ADD CONSTRAINT "_pages_v_blocks_bento_grid_items_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_bento_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_bento_grid_items_tags_locales" ADD CONSTRAINT "_pages_v_blocks_bento_grid_items_tags_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_bento_grid_items_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_bento_grid_items_bullets" ADD CONSTRAINT "_pages_v_blocks_bento_grid_items_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_bento_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_bento_grid_items_bullets_locales" ADD CONSTRAINT "_pages_v_blocks_bento_grid_items_bullets_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_bento_grid_items_bullets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_bento_grid_items" ADD CONSTRAINT "_pages_v_blocks_bento_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_bento_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_bento_grid_items_locales" ADD CONSTRAINT "_pages_v_blocks_bento_grid_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_bento_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_bento_grid" ADD CONSTRAINT "_pages_v_blocks_bento_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_bento_grid_locales" ADD CONSTRAINT "_pages_v_blocks_bento_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_bento_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_audience_split_items" ADD CONSTRAINT "_pages_v_blocks_audience_split_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_audience_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_audience_split_items_locales" ADD CONSTRAINT "_pages_v_blocks_audience_split_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_audience_split_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_audience_split" ADD CONSTRAINT "_pages_v_blocks_audience_split_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_audience_split_locales" ADD CONSTRAINT "_pages_v_blocks_audience_split_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_audience_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_accordion_steps_steps" ADD CONSTRAINT "_pages_v_blocks_accordion_steps_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_accordion_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_accordion_steps_steps_locales" ADD CONSTRAINT "_pages_v_blocks_accordion_steps_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_accordion_steps_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_accordion_steps" ADD CONSTRAINT "_pages_v_blocks_accordion_steps_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_accordion_steps" ADD CONSTRAINT "_pages_v_blocks_accordion_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_accordion_steps_locales" ADD CONSTRAINT "_pages_v_blocks_accordion_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_accordion_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_page_hero_metrics" ADD CONSTRAINT "solutions_blocks_page_hero_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_page_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_page_hero_metrics_locales" ADD CONSTRAINT "solutions_blocks_page_hero_metrics_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_page_hero_metrics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_method_cards_items_bullets" ADD CONSTRAINT "solutions_blocks_method_cards_items_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_method_cards_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_method_cards_items_bullets_locales" ADD CONSTRAINT "solutions_blocks_method_cards_items_bullets_locales_paren_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_method_cards_items_bullets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_method_cards_items" ADD CONSTRAINT "solutions_blocks_method_cards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_method_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_method_cards_items_locales" ADD CONSTRAINT "solutions_blocks_method_cards_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_method_cards_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_method_cards" ADD CONSTRAINT "solutions_blocks_method_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_method_cards_locales" ADD CONSTRAINT "solutions_blocks_method_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_method_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_bento_grid_items_metrics" ADD CONSTRAINT "solutions_blocks_bento_grid_items_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_bento_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_bento_grid_items_metrics_locales" ADD CONSTRAINT "solutions_blocks_bento_grid_items_metrics_locales_parent__fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_bento_grid_items_metrics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_bento_grid_items_tags" ADD CONSTRAINT "solutions_blocks_bento_grid_items_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_bento_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_bento_grid_items_tags_locales" ADD CONSTRAINT "solutions_blocks_bento_grid_items_tags_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_bento_grid_items_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_bento_grid_items_bullets" ADD CONSTRAINT "solutions_blocks_bento_grid_items_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_bento_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_bento_grid_items_bullets_locales" ADD CONSTRAINT "solutions_blocks_bento_grid_items_bullets_locales_parent__fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_bento_grid_items_bullets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_bento_grid_items" ADD CONSTRAINT "solutions_blocks_bento_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_bento_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_bento_grid_items_locales" ADD CONSTRAINT "solutions_blocks_bento_grid_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_bento_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_bento_grid" ADD CONSTRAINT "solutions_blocks_bento_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_bento_grid_locales" ADD CONSTRAINT "solutions_blocks_bento_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_bento_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_audience_split_items" ADD CONSTRAINT "solutions_blocks_audience_split_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_audience_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_audience_split_items_locales" ADD CONSTRAINT "solutions_blocks_audience_split_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_audience_split_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_audience_split" ADD CONSTRAINT "solutions_blocks_audience_split_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_audience_split_locales" ADD CONSTRAINT "solutions_blocks_audience_split_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_audience_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_accordion_steps_steps" ADD CONSTRAINT "solutions_blocks_accordion_steps_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_accordion_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_accordion_steps_steps_locales" ADD CONSTRAINT "solutions_blocks_accordion_steps_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_accordion_steps_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_accordion_steps" ADD CONSTRAINT "solutions_blocks_accordion_steps_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solutions_blocks_accordion_steps" ADD CONSTRAINT "solutions_blocks_accordion_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_accordion_steps_locales" ADD CONSTRAINT "solutions_blocks_accordion_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_accordion_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_page_hero_metrics" ADD CONSTRAINT "_solutions_v_blocks_page_hero_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_page_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_page_hero_metrics_locales" ADD CONSTRAINT "_solutions_v_blocks_page_hero_metrics_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_page_hero_metrics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_method_cards_items_bullets" ADD CONSTRAINT "_solutions_v_blocks_method_cards_items_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_method_cards_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_method_cards_items_bullets_locales" ADD CONSTRAINT "_solutions_v_blocks_method_cards_items_bullets_locales_pa_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_method_cards_items_bullets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_method_cards_items" ADD CONSTRAINT "_solutions_v_blocks_method_cards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_method_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_method_cards_items_locales" ADD CONSTRAINT "_solutions_v_blocks_method_cards_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_method_cards_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_method_cards" ADD CONSTRAINT "_solutions_v_blocks_method_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_method_cards_locales" ADD CONSTRAINT "_solutions_v_blocks_method_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_method_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_bento_grid_items_metrics" ADD CONSTRAINT "_solutions_v_blocks_bento_grid_items_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_bento_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_bento_grid_items_metrics_locales" ADD CONSTRAINT "_solutions_v_blocks_bento_grid_items_metrics_locales_pare_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_bento_grid_items_metrics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_bento_grid_items_tags" ADD CONSTRAINT "_solutions_v_blocks_bento_grid_items_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_bento_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_bento_grid_items_tags_locales" ADD CONSTRAINT "_solutions_v_blocks_bento_grid_items_tags_locales_parent__fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_bento_grid_items_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_bento_grid_items_bullets" ADD CONSTRAINT "_solutions_v_blocks_bento_grid_items_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_bento_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_bento_grid_items_bullets_locales" ADD CONSTRAINT "_solutions_v_blocks_bento_grid_items_bullets_locales_pare_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_bento_grid_items_bullets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_bento_grid_items" ADD CONSTRAINT "_solutions_v_blocks_bento_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_bento_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_bento_grid_items_locales" ADD CONSTRAINT "_solutions_v_blocks_bento_grid_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_bento_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_bento_grid" ADD CONSTRAINT "_solutions_v_blocks_bento_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_bento_grid_locales" ADD CONSTRAINT "_solutions_v_blocks_bento_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_bento_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_audience_split_items" ADD CONSTRAINT "_solutions_v_blocks_audience_split_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_audience_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_audience_split_items_locales" ADD CONSTRAINT "_solutions_v_blocks_audience_split_items_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_audience_split_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_audience_split" ADD CONSTRAINT "_solutions_v_blocks_audience_split_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_audience_split_locales" ADD CONSTRAINT "_solutions_v_blocks_audience_split_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_audience_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_accordion_steps_steps" ADD CONSTRAINT "_solutions_v_blocks_accordion_steps_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_accordion_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_accordion_steps_steps_locales" ADD CONSTRAINT "_solutions_v_blocks_accordion_steps_steps_locales_parent__fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_accordion_steps_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_accordion_steps" ADD CONSTRAINT "_solutions_v_blocks_accordion_steps_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_accordion_steps" ADD CONSTRAINT "_solutions_v_blocks_accordion_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_accordion_steps_locales" ADD CONSTRAINT "_solutions_v_blocks_accordion_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_accordion_steps"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "partners_blocks_page_hero_metrics_order_idx" ON "partners_blocks_page_hero_metrics" USING btree ("_order");
  CREATE INDEX "partners_blocks_page_hero_metrics_parent_id_idx" ON "partners_blocks_page_hero_metrics" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "partners_blocks_page_hero_metrics_locales_locale_parent_id_u" ON "partners_blocks_page_hero_metrics_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_blocks_method_cards_items_bullets_order_idx" ON "partners_blocks_method_cards_items_bullets" USING btree ("_order");
  CREATE INDEX "partners_blocks_method_cards_items_bullets_parent_id_idx" ON "partners_blocks_method_cards_items_bullets" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "partners_blocks_method_cards_items_bullets_locales_locale_pa" ON "partners_blocks_method_cards_items_bullets_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_blocks_method_cards_items_order_idx" ON "partners_blocks_method_cards_items" USING btree ("_order");
  CREATE INDEX "partners_blocks_method_cards_items_parent_id_idx" ON "partners_blocks_method_cards_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "partners_blocks_method_cards_items_locales_locale_parent_id_" ON "partners_blocks_method_cards_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_blocks_method_cards_order_idx" ON "partners_blocks_method_cards" USING btree ("_order");
  CREATE INDEX "partners_blocks_method_cards_parent_id_idx" ON "partners_blocks_method_cards" USING btree ("_parent_id");
  CREATE INDEX "partners_blocks_method_cards_path_idx" ON "partners_blocks_method_cards" USING btree ("_path");
  CREATE UNIQUE INDEX "partners_blocks_method_cards_locales_locale_parent_id_unique" ON "partners_blocks_method_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_blocks_bento_grid_items_metrics_order_idx" ON "partners_blocks_bento_grid_items_metrics" USING btree ("_order");
  CREATE INDEX "partners_blocks_bento_grid_items_metrics_parent_id_idx" ON "partners_blocks_bento_grid_items_metrics" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "partners_blocks_bento_grid_items_metrics_locales_locale_pare" ON "partners_blocks_bento_grid_items_metrics_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_blocks_bento_grid_items_tags_order_idx" ON "partners_blocks_bento_grid_items_tags" USING btree ("_order");
  CREATE INDEX "partners_blocks_bento_grid_items_tags_parent_id_idx" ON "partners_blocks_bento_grid_items_tags" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "partners_blocks_bento_grid_items_tags_locales_locale_parent_" ON "partners_blocks_bento_grid_items_tags_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_blocks_bento_grid_items_bullets_order_idx" ON "partners_blocks_bento_grid_items_bullets" USING btree ("_order");
  CREATE INDEX "partners_blocks_bento_grid_items_bullets_parent_id_idx" ON "partners_blocks_bento_grid_items_bullets" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "partners_blocks_bento_grid_items_bullets_locales_locale_pare" ON "partners_blocks_bento_grid_items_bullets_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_blocks_bento_grid_items_order_idx" ON "partners_blocks_bento_grid_items" USING btree ("_order");
  CREATE INDEX "partners_blocks_bento_grid_items_parent_id_idx" ON "partners_blocks_bento_grid_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "partners_blocks_bento_grid_items_locales_locale_parent_id_un" ON "partners_blocks_bento_grid_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_blocks_bento_grid_order_idx" ON "partners_blocks_bento_grid" USING btree ("_order");
  CREATE INDEX "partners_blocks_bento_grid_parent_id_idx" ON "partners_blocks_bento_grid" USING btree ("_parent_id");
  CREATE INDEX "partners_blocks_bento_grid_path_idx" ON "partners_blocks_bento_grid" USING btree ("_path");
  CREATE UNIQUE INDEX "partners_blocks_bento_grid_locales_locale_parent_id_unique" ON "partners_blocks_bento_grid_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_blocks_audience_split_items_order_idx" ON "partners_blocks_audience_split_items" USING btree ("_order");
  CREATE INDEX "partners_blocks_audience_split_items_parent_id_idx" ON "partners_blocks_audience_split_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "partners_blocks_audience_split_items_locales_locale_parent_i" ON "partners_blocks_audience_split_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_blocks_audience_split_order_idx" ON "partners_blocks_audience_split" USING btree ("_order");
  CREATE INDEX "partners_blocks_audience_split_parent_id_idx" ON "partners_blocks_audience_split" USING btree ("_parent_id");
  CREATE INDEX "partners_blocks_audience_split_path_idx" ON "partners_blocks_audience_split" USING btree ("_path");
  CREATE UNIQUE INDEX "partners_blocks_audience_split_locales_locale_parent_id_uniq" ON "partners_blocks_audience_split_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_blocks_accordion_steps_steps_order_idx" ON "partners_blocks_accordion_steps_steps" USING btree ("_order");
  CREATE INDEX "partners_blocks_accordion_steps_steps_parent_id_idx" ON "partners_blocks_accordion_steps_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "partners_blocks_accordion_steps_steps_locales_locale_parent_" ON "partners_blocks_accordion_steps_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_blocks_accordion_steps_order_idx" ON "partners_blocks_accordion_steps" USING btree ("_order");
  CREATE INDEX "partners_blocks_accordion_steps_parent_id_idx" ON "partners_blocks_accordion_steps" USING btree ("_parent_id");
  CREATE INDEX "partners_blocks_accordion_steps_path_idx" ON "partners_blocks_accordion_steps" USING btree ("_path");
  CREATE INDEX "partners_blocks_accordion_steps_image_idx" ON "partners_blocks_accordion_steps" USING btree ("image_id");
  CREATE UNIQUE INDEX "partners_blocks_accordion_steps_locales_locale_parent_id_uni" ON "partners_blocks_accordion_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_page_hero_metrics_order_idx" ON "pages_blocks_page_hero_metrics" USING btree ("_order");
  CREATE INDEX "pages_blocks_page_hero_metrics_parent_id_idx" ON "pages_blocks_page_hero_metrics" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_page_hero_metrics_locales_locale_parent_id_uniq" ON "pages_blocks_page_hero_metrics_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_method_cards_items_bullets_order_idx" ON "pages_blocks_method_cards_items_bullets" USING btree ("_order");
  CREATE INDEX "pages_blocks_method_cards_items_bullets_parent_id_idx" ON "pages_blocks_method_cards_items_bullets" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_method_cards_items_bullets_locales_locale_paren" ON "pages_blocks_method_cards_items_bullets_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_method_cards_items_order_idx" ON "pages_blocks_method_cards_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_method_cards_items_parent_id_idx" ON "pages_blocks_method_cards_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_method_cards_items_locales_locale_parent_id_uni" ON "pages_blocks_method_cards_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_method_cards_order_idx" ON "pages_blocks_method_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_method_cards_parent_id_idx" ON "pages_blocks_method_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_method_cards_path_idx" ON "pages_blocks_method_cards" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_method_cards_locales_locale_parent_id_unique" ON "pages_blocks_method_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_bento_grid_items_metrics_order_idx" ON "pages_blocks_bento_grid_items_metrics" USING btree ("_order");
  CREATE INDEX "pages_blocks_bento_grid_items_metrics_parent_id_idx" ON "pages_blocks_bento_grid_items_metrics" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_bento_grid_items_metrics_locales_locale_parent_" ON "pages_blocks_bento_grid_items_metrics_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_bento_grid_items_tags_order_idx" ON "pages_blocks_bento_grid_items_tags" USING btree ("_order");
  CREATE INDEX "pages_blocks_bento_grid_items_tags_parent_id_idx" ON "pages_blocks_bento_grid_items_tags" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_bento_grid_items_tags_locales_locale_parent_id_" ON "pages_blocks_bento_grid_items_tags_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_bento_grid_items_bullets_order_idx" ON "pages_blocks_bento_grid_items_bullets" USING btree ("_order");
  CREATE INDEX "pages_blocks_bento_grid_items_bullets_parent_id_idx" ON "pages_blocks_bento_grid_items_bullets" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_bento_grid_items_bullets_locales_locale_parent_" ON "pages_blocks_bento_grid_items_bullets_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_bento_grid_items_order_idx" ON "pages_blocks_bento_grid_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_bento_grid_items_parent_id_idx" ON "pages_blocks_bento_grid_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_bento_grid_items_locales_locale_parent_id_uniqu" ON "pages_blocks_bento_grid_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_bento_grid_order_idx" ON "pages_blocks_bento_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_bento_grid_parent_id_idx" ON "pages_blocks_bento_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_bento_grid_path_idx" ON "pages_blocks_bento_grid" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_bento_grid_locales_locale_parent_id_unique" ON "pages_blocks_bento_grid_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_audience_split_items_order_idx" ON "pages_blocks_audience_split_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_audience_split_items_parent_id_idx" ON "pages_blocks_audience_split_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_audience_split_items_locales_locale_parent_id_u" ON "pages_blocks_audience_split_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_audience_split_order_idx" ON "pages_blocks_audience_split" USING btree ("_order");
  CREATE INDEX "pages_blocks_audience_split_parent_id_idx" ON "pages_blocks_audience_split" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_audience_split_path_idx" ON "pages_blocks_audience_split" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_audience_split_locales_locale_parent_id_unique" ON "pages_blocks_audience_split_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_accordion_steps_steps_order_idx" ON "pages_blocks_accordion_steps_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_accordion_steps_steps_parent_id_idx" ON "pages_blocks_accordion_steps_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_accordion_steps_steps_locales_locale_parent_id_" ON "pages_blocks_accordion_steps_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_accordion_steps_order_idx" ON "pages_blocks_accordion_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_accordion_steps_parent_id_idx" ON "pages_blocks_accordion_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_accordion_steps_path_idx" ON "pages_blocks_accordion_steps" USING btree ("_path");
  CREATE INDEX "pages_blocks_accordion_steps_image_idx" ON "pages_blocks_accordion_steps" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_blocks_accordion_steps_locales_locale_parent_id_unique" ON "pages_blocks_accordion_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_page_hero_metrics_order_idx" ON "_pages_v_blocks_page_hero_metrics" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_page_hero_metrics_parent_id_idx" ON "_pages_v_blocks_page_hero_metrics" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_page_hero_metrics_locales_locale_parent_id_u" ON "_pages_v_blocks_page_hero_metrics_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_method_cards_items_bullets_order_idx" ON "_pages_v_blocks_method_cards_items_bullets" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_method_cards_items_bullets_parent_id_idx" ON "_pages_v_blocks_method_cards_items_bullets" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_method_cards_items_bullets_locales_locale_pa" ON "_pages_v_blocks_method_cards_items_bullets_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_method_cards_items_order_idx" ON "_pages_v_blocks_method_cards_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_method_cards_items_parent_id_idx" ON "_pages_v_blocks_method_cards_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_method_cards_items_locales_locale_parent_id_" ON "_pages_v_blocks_method_cards_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_method_cards_order_idx" ON "_pages_v_blocks_method_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_method_cards_parent_id_idx" ON "_pages_v_blocks_method_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_method_cards_path_idx" ON "_pages_v_blocks_method_cards" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_method_cards_locales_locale_parent_id_unique" ON "_pages_v_blocks_method_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_bento_grid_items_metrics_order_idx" ON "_pages_v_blocks_bento_grid_items_metrics" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_bento_grid_items_metrics_parent_id_idx" ON "_pages_v_blocks_bento_grid_items_metrics" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_bento_grid_items_metrics_locales_locale_pare" ON "_pages_v_blocks_bento_grid_items_metrics_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_bento_grid_items_tags_order_idx" ON "_pages_v_blocks_bento_grid_items_tags" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_bento_grid_items_tags_parent_id_idx" ON "_pages_v_blocks_bento_grid_items_tags" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_bento_grid_items_tags_locales_locale_parent_" ON "_pages_v_blocks_bento_grid_items_tags_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_bento_grid_items_bullets_order_idx" ON "_pages_v_blocks_bento_grid_items_bullets" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_bento_grid_items_bullets_parent_id_idx" ON "_pages_v_blocks_bento_grid_items_bullets" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_bento_grid_items_bullets_locales_locale_pare" ON "_pages_v_blocks_bento_grid_items_bullets_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_bento_grid_items_order_idx" ON "_pages_v_blocks_bento_grid_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_bento_grid_items_parent_id_idx" ON "_pages_v_blocks_bento_grid_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_bento_grid_items_locales_locale_parent_id_un" ON "_pages_v_blocks_bento_grid_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_bento_grid_order_idx" ON "_pages_v_blocks_bento_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_bento_grid_parent_id_idx" ON "_pages_v_blocks_bento_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_bento_grid_path_idx" ON "_pages_v_blocks_bento_grid" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_bento_grid_locales_locale_parent_id_unique" ON "_pages_v_blocks_bento_grid_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_audience_split_items_order_idx" ON "_pages_v_blocks_audience_split_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_audience_split_items_parent_id_idx" ON "_pages_v_blocks_audience_split_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_audience_split_items_locales_locale_parent_i" ON "_pages_v_blocks_audience_split_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_audience_split_order_idx" ON "_pages_v_blocks_audience_split" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_audience_split_parent_id_idx" ON "_pages_v_blocks_audience_split" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_audience_split_path_idx" ON "_pages_v_blocks_audience_split" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_audience_split_locales_locale_parent_id_uniq" ON "_pages_v_blocks_audience_split_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_accordion_steps_steps_order_idx" ON "_pages_v_blocks_accordion_steps_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_accordion_steps_steps_parent_id_idx" ON "_pages_v_blocks_accordion_steps_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_accordion_steps_steps_locales_locale_parent_" ON "_pages_v_blocks_accordion_steps_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_accordion_steps_order_idx" ON "_pages_v_blocks_accordion_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_accordion_steps_parent_id_idx" ON "_pages_v_blocks_accordion_steps" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_accordion_steps_path_idx" ON "_pages_v_blocks_accordion_steps" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_accordion_steps_image_idx" ON "_pages_v_blocks_accordion_steps" USING btree ("image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_accordion_steps_locales_locale_parent_id_uni" ON "_pages_v_blocks_accordion_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_page_hero_metrics_order_idx" ON "solutions_blocks_page_hero_metrics" USING btree ("_order");
  CREATE INDEX "solutions_blocks_page_hero_metrics_parent_id_idx" ON "solutions_blocks_page_hero_metrics" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "solutions_blocks_page_hero_metrics_locales_locale_parent_id_" ON "solutions_blocks_page_hero_metrics_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_method_cards_items_bullets_order_idx" ON "solutions_blocks_method_cards_items_bullets" USING btree ("_order");
  CREATE INDEX "solutions_blocks_method_cards_items_bullets_parent_id_idx" ON "solutions_blocks_method_cards_items_bullets" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "solutions_blocks_method_cards_items_bullets_locales_locale_p" ON "solutions_blocks_method_cards_items_bullets_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_method_cards_items_order_idx" ON "solutions_blocks_method_cards_items" USING btree ("_order");
  CREATE INDEX "solutions_blocks_method_cards_items_parent_id_idx" ON "solutions_blocks_method_cards_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "solutions_blocks_method_cards_items_locales_locale_parent_id" ON "solutions_blocks_method_cards_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_method_cards_order_idx" ON "solutions_blocks_method_cards" USING btree ("_order");
  CREATE INDEX "solutions_blocks_method_cards_parent_id_idx" ON "solutions_blocks_method_cards" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_method_cards_path_idx" ON "solutions_blocks_method_cards" USING btree ("_path");
  CREATE UNIQUE INDEX "solutions_blocks_method_cards_locales_locale_parent_id_uniqu" ON "solutions_blocks_method_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_bento_grid_items_metrics_order_idx" ON "solutions_blocks_bento_grid_items_metrics" USING btree ("_order");
  CREATE INDEX "solutions_blocks_bento_grid_items_metrics_parent_id_idx" ON "solutions_blocks_bento_grid_items_metrics" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "solutions_blocks_bento_grid_items_metrics_locales_locale_par" ON "solutions_blocks_bento_grid_items_metrics_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_bento_grid_items_tags_order_idx" ON "solutions_blocks_bento_grid_items_tags" USING btree ("_order");
  CREATE INDEX "solutions_blocks_bento_grid_items_tags_parent_id_idx" ON "solutions_blocks_bento_grid_items_tags" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "solutions_blocks_bento_grid_items_tags_locales_locale_parent" ON "solutions_blocks_bento_grid_items_tags_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_bento_grid_items_bullets_order_idx" ON "solutions_blocks_bento_grid_items_bullets" USING btree ("_order");
  CREATE INDEX "solutions_blocks_bento_grid_items_bullets_parent_id_idx" ON "solutions_blocks_bento_grid_items_bullets" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "solutions_blocks_bento_grid_items_bullets_locales_locale_par" ON "solutions_blocks_bento_grid_items_bullets_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_bento_grid_items_order_idx" ON "solutions_blocks_bento_grid_items" USING btree ("_order");
  CREATE INDEX "solutions_blocks_bento_grid_items_parent_id_idx" ON "solutions_blocks_bento_grid_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "solutions_blocks_bento_grid_items_locales_locale_parent_id_u" ON "solutions_blocks_bento_grid_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_bento_grid_order_idx" ON "solutions_blocks_bento_grid" USING btree ("_order");
  CREATE INDEX "solutions_blocks_bento_grid_parent_id_idx" ON "solutions_blocks_bento_grid" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_bento_grid_path_idx" ON "solutions_blocks_bento_grid" USING btree ("_path");
  CREATE UNIQUE INDEX "solutions_blocks_bento_grid_locales_locale_parent_id_unique" ON "solutions_blocks_bento_grid_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_audience_split_items_order_idx" ON "solutions_blocks_audience_split_items" USING btree ("_order");
  CREATE INDEX "solutions_blocks_audience_split_items_parent_id_idx" ON "solutions_blocks_audience_split_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "solutions_blocks_audience_split_items_locales_locale_parent_" ON "solutions_blocks_audience_split_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_audience_split_order_idx" ON "solutions_blocks_audience_split" USING btree ("_order");
  CREATE INDEX "solutions_blocks_audience_split_parent_id_idx" ON "solutions_blocks_audience_split" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_audience_split_path_idx" ON "solutions_blocks_audience_split" USING btree ("_path");
  CREATE UNIQUE INDEX "solutions_blocks_audience_split_locales_locale_parent_id_uni" ON "solutions_blocks_audience_split_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_accordion_steps_steps_order_idx" ON "solutions_blocks_accordion_steps_steps" USING btree ("_order");
  CREATE INDEX "solutions_blocks_accordion_steps_steps_parent_id_idx" ON "solutions_blocks_accordion_steps_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "solutions_blocks_accordion_steps_steps_locales_locale_parent" ON "solutions_blocks_accordion_steps_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_accordion_steps_order_idx" ON "solutions_blocks_accordion_steps" USING btree ("_order");
  CREATE INDEX "solutions_blocks_accordion_steps_parent_id_idx" ON "solutions_blocks_accordion_steps" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_accordion_steps_path_idx" ON "solutions_blocks_accordion_steps" USING btree ("_path");
  CREATE INDEX "solutions_blocks_accordion_steps_image_idx" ON "solutions_blocks_accordion_steps" USING btree ("image_id");
  CREATE UNIQUE INDEX "solutions_blocks_accordion_steps_locales_locale_parent_id_un" ON "solutions_blocks_accordion_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_page_hero_metrics_order_idx" ON "_solutions_v_blocks_page_hero_metrics" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_page_hero_metrics_parent_id_idx" ON "_solutions_v_blocks_page_hero_metrics" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_solutions_v_blocks_page_hero_metrics_locales_locale_parent_" ON "_solutions_v_blocks_page_hero_metrics_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_method_cards_items_bullets_order_idx" ON "_solutions_v_blocks_method_cards_items_bullets" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_method_cards_items_bullets_parent_id_idx" ON "_solutions_v_blocks_method_cards_items_bullets" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_solutions_v_blocks_method_cards_items_bullets_locales_local" ON "_solutions_v_blocks_method_cards_items_bullets_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_method_cards_items_order_idx" ON "_solutions_v_blocks_method_cards_items" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_method_cards_items_parent_id_idx" ON "_solutions_v_blocks_method_cards_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_solutions_v_blocks_method_cards_items_locales_locale_parent" ON "_solutions_v_blocks_method_cards_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_method_cards_order_idx" ON "_solutions_v_blocks_method_cards" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_method_cards_parent_id_idx" ON "_solutions_v_blocks_method_cards" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_method_cards_path_idx" ON "_solutions_v_blocks_method_cards" USING btree ("_path");
  CREATE UNIQUE INDEX "_solutions_v_blocks_method_cards_locales_locale_parent_id_un" ON "_solutions_v_blocks_method_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_bento_grid_items_metrics_order_idx" ON "_solutions_v_blocks_bento_grid_items_metrics" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_bento_grid_items_metrics_parent_id_idx" ON "_solutions_v_blocks_bento_grid_items_metrics" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_solutions_v_blocks_bento_grid_items_metrics_locales_locale_" ON "_solutions_v_blocks_bento_grid_items_metrics_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_bento_grid_items_tags_order_idx" ON "_solutions_v_blocks_bento_grid_items_tags" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_bento_grid_items_tags_parent_id_idx" ON "_solutions_v_blocks_bento_grid_items_tags" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_solutions_v_blocks_bento_grid_items_tags_locales_locale_par" ON "_solutions_v_blocks_bento_grid_items_tags_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_bento_grid_items_bullets_order_idx" ON "_solutions_v_blocks_bento_grid_items_bullets" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_bento_grid_items_bullets_parent_id_idx" ON "_solutions_v_blocks_bento_grid_items_bullets" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_solutions_v_blocks_bento_grid_items_bullets_locales_locale_" ON "_solutions_v_blocks_bento_grid_items_bullets_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_bento_grid_items_order_idx" ON "_solutions_v_blocks_bento_grid_items" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_bento_grid_items_parent_id_idx" ON "_solutions_v_blocks_bento_grid_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_solutions_v_blocks_bento_grid_items_locales_locale_parent_i" ON "_solutions_v_blocks_bento_grid_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_bento_grid_order_idx" ON "_solutions_v_blocks_bento_grid" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_bento_grid_parent_id_idx" ON "_solutions_v_blocks_bento_grid" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_bento_grid_path_idx" ON "_solutions_v_blocks_bento_grid" USING btree ("_path");
  CREATE UNIQUE INDEX "_solutions_v_blocks_bento_grid_locales_locale_parent_id_uniq" ON "_solutions_v_blocks_bento_grid_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_audience_split_items_order_idx" ON "_solutions_v_blocks_audience_split_items" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_audience_split_items_parent_id_idx" ON "_solutions_v_blocks_audience_split_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_solutions_v_blocks_audience_split_items_locales_locale_pare" ON "_solutions_v_blocks_audience_split_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_audience_split_order_idx" ON "_solutions_v_blocks_audience_split" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_audience_split_parent_id_idx" ON "_solutions_v_blocks_audience_split" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_audience_split_path_idx" ON "_solutions_v_blocks_audience_split" USING btree ("_path");
  CREATE UNIQUE INDEX "_solutions_v_blocks_audience_split_locales_locale_parent_id_" ON "_solutions_v_blocks_audience_split_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_accordion_steps_steps_order_idx" ON "_solutions_v_blocks_accordion_steps_steps" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_accordion_steps_steps_parent_id_idx" ON "_solutions_v_blocks_accordion_steps_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_solutions_v_blocks_accordion_steps_steps_locales_locale_par" ON "_solutions_v_blocks_accordion_steps_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_accordion_steps_order_idx" ON "_solutions_v_blocks_accordion_steps" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_accordion_steps_parent_id_idx" ON "_solutions_v_blocks_accordion_steps" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_accordion_steps_path_idx" ON "_solutions_v_blocks_accordion_steps" USING btree ("_path");
  CREATE INDEX "_solutions_v_blocks_accordion_steps_image_idx" ON "_solutions_v_blocks_accordion_steps" USING btree ("image_id");
  CREATE UNIQUE INDEX "_solutions_v_blocks_accordion_steps_locales_locale_parent_id" ON "_solutions_v_blocks_accordion_steps_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "partners_blocks_page_hero_metrics" CASCADE;
  DROP TABLE "partners_blocks_page_hero_metrics_locales" CASCADE;
  DROP TABLE "partners_blocks_method_cards_items_bullets" CASCADE;
  DROP TABLE "partners_blocks_method_cards_items_bullets_locales" CASCADE;
  DROP TABLE "partners_blocks_method_cards_items" CASCADE;
  DROP TABLE "partners_blocks_method_cards_items_locales" CASCADE;
  DROP TABLE "partners_blocks_method_cards" CASCADE;
  DROP TABLE "partners_blocks_method_cards_locales" CASCADE;
  DROP TABLE "partners_blocks_bento_grid_items_metrics" CASCADE;
  DROP TABLE "partners_blocks_bento_grid_items_metrics_locales" CASCADE;
  DROP TABLE "partners_blocks_bento_grid_items_tags" CASCADE;
  DROP TABLE "partners_blocks_bento_grid_items_tags_locales" CASCADE;
  DROP TABLE "partners_blocks_bento_grid_items_bullets" CASCADE;
  DROP TABLE "partners_blocks_bento_grid_items_bullets_locales" CASCADE;
  DROP TABLE "partners_blocks_bento_grid_items" CASCADE;
  DROP TABLE "partners_blocks_bento_grid_items_locales" CASCADE;
  DROP TABLE "partners_blocks_bento_grid" CASCADE;
  DROP TABLE "partners_blocks_bento_grid_locales" CASCADE;
  DROP TABLE "partners_blocks_audience_split_items" CASCADE;
  DROP TABLE "partners_blocks_audience_split_items_locales" CASCADE;
  DROP TABLE "partners_blocks_audience_split" CASCADE;
  DROP TABLE "partners_blocks_audience_split_locales" CASCADE;
  DROP TABLE "partners_blocks_accordion_steps_steps" CASCADE;
  DROP TABLE "partners_blocks_accordion_steps_steps_locales" CASCADE;
  DROP TABLE "partners_blocks_accordion_steps" CASCADE;
  DROP TABLE "partners_blocks_accordion_steps_locales" CASCADE;
  DROP TABLE "pages_blocks_page_hero_metrics" CASCADE;
  DROP TABLE "pages_blocks_page_hero_metrics_locales" CASCADE;
  DROP TABLE "pages_blocks_method_cards_items_bullets" CASCADE;
  DROP TABLE "pages_blocks_method_cards_items_bullets_locales" CASCADE;
  DROP TABLE "pages_blocks_method_cards_items" CASCADE;
  DROP TABLE "pages_blocks_method_cards_items_locales" CASCADE;
  DROP TABLE "pages_blocks_method_cards" CASCADE;
  DROP TABLE "pages_blocks_method_cards_locales" CASCADE;
  DROP TABLE "pages_blocks_bento_grid_items_metrics" CASCADE;
  DROP TABLE "pages_blocks_bento_grid_items_metrics_locales" CASCADE;
  DROP TABLE "pages_blocks_bento_grid_items_tags" CASCADE;
  DROP TABLE "pages_blocks_bento_grid_items_tags_locales" CASCADE;
  DROP TABLE "pages_blocks_bento_grid_items_bullets" CASCADE;
  DROP TABLE "pages_blocks_bento_grid_items_bullets_locales" CASCADE;
  DROP TABLE "pages_blocks_bento_grid_items" CASCADE;
  DROP TABLE "pages_blocks_bento_grid_items_locales" CASCADE;
  DROP TABLE "pages_blocks_bento_grid" CASCADE;
  DROP TABLE "pages_blocks_bento_grid_locales" CASCADE;
  DROP TABLE "pages_blocks_audience_split_items" CASCADE;
  DROP TABLE "pages_blocks_audience_split_items_locales" CASCADE;
  DROP TABLE "pages_blocks_audience_split" CASCADE;
  DROP TABLE "pages_blocks_audience_split_locales" CASCADE;
  DROP TABLE "pages_blocks_accordion_steps_steps" CASCADE;
  DROP TABLE "pages_blocks_accordion_steps_steps_locales" CASCADE;
  DROP TABLE "pages_blocks_accordion_steps" CASCADE;
  DROP TABLE "pages_blocks_accordion_steps_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_page_hero_metrics" CASCADE;
  DROP TABLE "_pages_v_blocks_page_hero_metrics_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_method_cards_items_bullets" CASCADE;
  DROP TABLE "_pages_v_blocks_method_cards_items_bullets_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_method_cards_items" CASCADE;
  DROP TABLE "_pages_v_blocks_method_cards_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_method_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_method_cards_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_bento_grid_items_metrics" CASCADE;
  DROP TABLE "_pages_v_blocks_bento_grid_items_metrics_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_bento_grid_items_tags" CASCADE;
  DROP TABLE "_pages_v_blocks_bento_grid_items_tags_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_bento_grid_items_bullets" CASCADE;
  DROP TABLE "_pages_v_blocks_bento_grid_items_bullets_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_bento_grid_items" CASCADE;
  DROP TABLE "_pages_v_blocks_bento_grid_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_bento_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_bento_grid_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_audience_split_items" CASCADE;
  DROP TABLE "_pages_v_blocks_audience_split_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_audience_split" CASCADE;
  DROP TABLE "_pages_v_blocks_audience_split_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_accordion_steps_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_accordion_steps_steps_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_accordion_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_accordion_steps_locales" CASCADE;
  DROP TABLE "solutions_blocks_page_hero_metrics" CASCADE;
  DROP TABLE "solutions_blocks_page_hero_metrics_locales" CASCADE;
  DROP TABLE "solutions_blocks_method_cards_items_bullets" CASCADE;
  DROP TABLE "solutions_blocks_method_cards_items_bullets_locales" CASCADE;
  DROP TABLE "solutions_blocks_method_cards_items" CASCADE;
  DROP TABLE "solutions_blocks_method_cards_items_locales" CASCADE;
  DROP TABLE "solutions_blocks_method_cards" CASCADE;
  DROP TABLE "solutions_blocks_method_cards_locales" CASCADE;
  DROP TABLE "solutions_blocks_bento_grid_items_metrics" CASCADE;
  DROP TABLE "solutions_blocks_bento_grid_items_metrics_locales" CASCADE;
  DROP TABLE "solutions_blocks_bento_grid_items_tags" CASCADE;
  DROP TABLE "solutions_blocks_bento_grid_items_tags_locales" CASCADE;
  DROP TABLE "solutions_blocks_bento_grid_items_bullets" CASCADE;
  DROP TABLE "solutions_blocks_bento_grid_items_bullets_locales" CASCADE;
  DROP TABLE "solutions_blocks_bento_grid_items" CASCADE;
  DROP TABLE "solutions_blocks_bento_grid_items_locales" CASCADE;
  DROP TABLE "solutions_blocks_bento_grid" CASCADE;
  DROP TABLE "solutions_blocks_bento_grid_locales" CASCADE;
  DROP TABLE "solutions_blocks_audience_split_items" CASCADE;
  DROP TABLE "solutions_blocks_audience_split_items_locales" CASCADE;
  DROP TABLE "solutions_blocks_audience_split" CASCADE;
  DROP TABLE "solutions_blocks_audience_split_locales" CASCADE;
  DROP TABLE "solutions_blocks_accordion_steps_steps" CASCADE;
  DROP TABLE "solutions_blocks_accordion_steps_steps_locales" CASCADE;
  DROP TABLE "solutions_blocks_accordion_steps" CASCADE;
  DROP TABLE "solutions_blocks_accordion_steps_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_page_hero_metrics" CASCADE;
  DROP TABLE "_solutions_v_blocks_page_hero_metrics_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_method_cards_items_bullets" CASCADE;
  DROP TABLE "_solutions_v_blocks_method_cards_items_bullets_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_method_cards_items" CASCADE;
  DROP TABLE "_solutions_v_blocks_method_cards_items_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_method_cards" CASCADE;
  DROP TABLE "_solutions_v_blocks_method_cards_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_bento_grid_items_metrics" CASCADE;
  DROP TABLE "_solutions_v_blocks_bento_grid_items_metrics_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_bento_grid_items_tags" CASCADE;
  DROP TABLE "_solutions_v_blocks_bento_grid_items_tags_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_bento_grid_items_bullets" CASCADE;
  DROP TABLE "_solutions_v_blocks_bento_grid_items_bullets_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_bento_grid_items" CASCADE;
  DROP TABLE "_solutions_v_blocks_bento_grid_items_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_bento_grid" CASCADE;
  DROP TABLE "_solutions_v_blocks_bento_grid_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_audience_split_items" CASCADE;
  DROP TABLE "_solutions_v_blocks_audience_split_items_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_audience_split" CASCADE;
  DROP TABLE "_solutions_v_blocks_audience_split_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_accordion_steps_steps" CASCADE;
  DROP TABLE "_solutions_v_blocks_accordion_steps_steps_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_accordion_steps" CASCADE;
  DROP TABLE "_solutions_v_blocks_accordion_steps_locales" CASCADE;
  ALTER TABLE "partners_blocks_icon_card_grid_items" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "partners_blocks_icon_card_grid_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::text;
  DROP TYPE "public"."enum_partners_blocks_icon_card_grid_items_icon";
  CREATE TYPE "public"."enum_partners_blocks_icon_card_grid_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app');
  ALTER TABLE "partners_blocks_icon_card_grid_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::"public"."enum_partners_blocks_icon_card_grid_items_icon";
  ALTER TABLE "partners_blocks_icon_card_grid_items" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_partners_blocks_icon_card_grid_items_icon" USING "icon"::"public"."enum_partners_blocks_icon_card_grid_items_icon";
  ALTER TABLE "partners_blocks_value_cards_items" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "partners_blocks_value_cards_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::text;
  DROP TYPE "public"."enum_partners_blocks_value_cards_items_icon";
  CREATE TYPE "public"."enum_partners_blocks_value_cards_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app');
  ALTER TABLE "partners_blocks_value_cards_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::"public"."enum_partners_blocks_value_cards_items_icon";
  ALTER TABLE "partners_blocks_value_cards_items" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_partners_blocks_value_cards_items_icon" USING "icon"::"public"."enum_partners_blocks_value_cards_items_icon";
  ALTER TABLE "partners_blocks_cta_banner" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "partners_blocks_cta_banner" ALTER COLUMN "variant" SET DEFAULT 'primary'::text;
  DROP TYPE "public"."enum_partners_blocks_cta_banner_variant";
  CREATE TYPE "public"."enum_partners_blocks_cta_banner_variant" AS ENUM('primary', 'subtle');
  ALTER TABLE "partners_blocks_cta_banner" ALTER COLUMN "variant" SET DEFAULT 'primary'::"public"."enum_partners_blocks_cta_banner_variant";
  ALTER TABLE "partners_blocks_cta_banner" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_partners_blocks_cta_banner_variant" USING "variant"::"public"."enum_partners_blocks_cta_banner_variant";
  ALTER TABLE "pages_blocks_icon_card_grid_items" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_icon_card_grid_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::text;
  DROP TYPE "public"."enum_pages_blocks_icon_card_grid_items_icon";
  CREATE TYPE "public"."enum_pages_blocks_icon_card_grid_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app');
  ALTER TABLE "pages_blocks_icon_card_grid_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::"public"."enum_pages_blocks_icon_card_grid_items_icon";
  ALTER TABLE "pages_blocks_icon_card_grid_items" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_pages_blocks_icon_card_grid_items_icon" USING "icon"::"public"."enum_pages_blocks_icon_card_grid_items_icon";
  ALTER TABLE "pages_blocks_value_cards_items" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_value_cards_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::text;
  DROP TYPE "public"."enum_pages_blocks_value_cards_items_icon";
  CREATE TYPE "public"."enum_pages_blocks_value_cards_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app');
  ALTER TABLE "pages_blocks_value_cards_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::"public"."enum_pages_blocks_value_cards_items_icon";
  ALTER TABLE "pages_blocks_value_cards_items" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_pages_blocks_value_cards_items_icon" USING "icon"::"public"."enum_pages_blocks_value_cards_items_icon";
  ALTER TABLE "pages_blocks_cta_banner" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_cta_banner" ALTER COLUMN "variant" SET DEFAULT 'primary'::text;
  DROP TYPE "public"."enum_pages_blocks_cta_banner_variant";
  CREATE TYPE "public"."enum_pages_blocks_cta_banner_variant" AS ENUM('primary', 'subtle');
  ALTER TABLE "pages_blocks_cta_banner" ALTER COLUMN "variant" SET DEFAULT 'primary'::"public"."enum_pages_blocks_cta_banner_variant";
  ALTER TABLE "pages_blocks_cta_banner" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_pages_blocks_cta_banner_variant" USING "variant"::"public"."enum_pages_blocks_cta_banner_variant";
  ALTER TABLE "_pages_v_blocks_icon_card_grid_items" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_icon_card_grid_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::text;
  DROP TYPE "public"."enum__pages_v_blocks_icon_card_grid_items_icon";
  CREATE TYPE "public"."enum__pages_v_blocks_icon_card_grid_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app');
  ALTER TABLE "_pages_v_blocks_icon_card_grid_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::"public"."enum__pages_v_blocks_icon_card_grid_items_icon";
  ALTER TABLE "_pages_v_blocks_icon_card_grid_items" ALTER COLUMN "icon" SET DATA TYPE "public"."enum__pages_v_blocks_icon_card_grid_items_icon" USING "icon"::"public"."enum__pages_v_blocks_icon_card_grid_items_icon";
  ALTER TABLE "_pages_v_blocks_value_cards_items" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_value_cards_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::text;
  DROP TYPE "public"."enum__pages_v_blocks_value_cards_items_icon";
  CREATE TYPE "public"."enum__pages_v_blocks_value_cards_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app');
  ALTER TABLE "_pages_v_blocks_value_cards_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::"public"."enum__pages_v_blocks_value_cards_items_icon";
  ALTER TABLE "_pages_v_blocks_value_cards_items" ALTER COLUMN "icon" SET DATA TYPE "public"."enum__pages_v_blocks_value_cards_items_icon" USING "icon"::"public"."enum__pages_v_blocks_value_cards_items_icon";
  ALTER TABLE "_pages_v_blocks_cta_banner" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_cta_banner" ALTER COLUMN "variant" SET DEFAULT 'primary'::text;
  DROP TYPE "public"."enum__pages_v_blocks_cta_banner_variant";
  CREATE TYPE "public"."enum__pages_v_blocks_cta_banner_variant" AS ENUM('primary', 'subtle');
  ALTER TABLE "_pages_v_blocks_cta_banner" ALTER COLUMN "variant" SET DEFAULT 'primary'::"public"."enum__pages_v_blocks_cta_banner_variant";
  ALTER TABLE "_pages_v_blocks_cta_banner" ALTER COLUMN "variant" SET DATA TYPE "public"."enum__pages_v_blocks_cta_banner_variant" USING "variant"::"public"."enum__pages_v_blocks_cta_banner_variant";
  ALTER TABLE "solutions_blocks_icon_card_grid_items" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "solutions_blocks_icon_card_grid_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::text;
  DROP TYPE "public"."enum_solutions_blocks_icon_card_grid_items_icon";
  CREATE TYPE "public"."enum_solutions_blocks_icon_card_grid_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app');
  ALTER TABLE "solutions_blocks_icon_card_grid_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::"public"."enum_solutions_blocks_icon_card_grid_items_icon";
  ALTER TABLE "solutions_blocks_icon_card_grid_items" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_solutions_blocks_icon_card_grid_items_icon" USING "icon"::"public"."enum_solutions_blocks_icon_card_grid_items_icon";
  ALTER TABLE "solutions_blocks_value_cards_items" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "solutions_blocks_value_cards_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::text;
  DROP TYPE "public"."enum_solutions_blocks_value_cards_items_icon";
  CREATE TYPE "public"."enum_solutions_blocks_value_cards_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app');
  ALTER TABLE "solutions_blocks_value_cards_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::"public"."enum_solutions_blocks_value_cards_items_icon";
  ALTER TABLE "solutions_blocks_value_cards_items" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_solutions_blocks_value_cards_items_icon" USING "icon"::"public"."enum_solutions_blocks_value_cards_items_icon";
  ALTER TABLE "solutions_blocks_cta_banner" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "solutions_blocks_cta_banner" ALTER COLUMN "variant" SET DEFAULT 'primary'::text;
  DROP TYPE "public"."enum_solutions_blocks_cta_banner_variant";
  CREATE TYPE "public"."enum_solutions_blocks_cta_banner_variant" AS ENUM('primary', 'subtle');
  ALTER TABLE "solutions_blocks_cta_banner" ALTER COLUMN "variant" SET DEFAULT 'primary'::"public"."enum_solutions_blocks_cta_banner_variant";
  ALTER TABLE "solutions_blocks_cta_banner" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_solutions_blocks_cta_banner_variant" USING "variant"::"public"."enum_solutions_blocks_cta_banner_variant";
  ALTER TABLE "solutions" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "solutions" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::text;
  DROP TYPE "public"."enum_solutions_icon";
  CREATE TYPE "public"."enum_solutions_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app');
  ALTER TABLE "solutions" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::"public"."enum_solutions_icon";
  ALTER TABLE "solutions" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_solutions_icon" USING "icon"::"public"."enum_solutions_icon";
  ALTER TABLE "_solutions_v_blocks_icon_card_grid_items" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "_solutions_v_blocks_icon_card_grid_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::text;
  DROP TYPE "public"."enum__solutions_v_blocks_icon_card_grid_items_icon";
  CREATE TYPE "public"."enum__solutions_v_blocks_icon_card_grid_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app');
  ALTER TABLE "_solutions_v_blocks_icon_card_grid_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::"public"."enum__solutions_v_blocks_icon_card_grid_items_icon";
  ALTER TABLE "_solutions_v_blocks_icon_card_grid_items" ALTER COLUMN "icon" SET DATA TYPE "public"."enum__solutions_v_blocks_icon_card_grid_items_icon" USING "icon"::"public"."enum__solutions_v_blocks_icon_card_grid_items_icon";
  ALTER TABLE "_solutions_v_blocks_value_cards_items" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "_solutions_v_blocks_value_cards_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::text;
  DROP TYPE "public"."enum__solutions_v_blocks_value_cards_items_icon";
  CREATE TYPE "public"."enum__solutions_v_blocks_value_cards_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app');
  ALTER TABLE "_solutions_v_blocks_value_cards_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::"public"."enum__solutions_v_blocks_value_cards_items_icon";
  ALTER TABLE "_solutions_v_blocks_value_cards_items" ALTER COLUMN "icon" SET DATA TYPE "public"."enum__solutions_v_blocks_value_cards_items_icon" USING "icon"::"public"."enum__solutions_v_blocks_value_cards_items_icon";
  ALTER TABLE "_solutions_v_blocks_cta_banner" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "_solutions_v_blocks_cta_banner" ALTER COLUMN "variant" SET DEFAULT 'primary'::text;
  DROP TYPE "public"."enum__solutions_v_blocks_cta_banner_variant";
  CREATE TYPE "public"."enum__solutions_v_blocks_cta_banner_variant" AS ENUM('primary', 'subtle');
  ALTER TABLE "_solutions_v_blocks_cta_banner" ALTER COLUMN "variant" SET DEFAULT 'primary'::"public"."enum__solutions_v_blocks_cta_banner_variant";
  ALTER TABLE "_solutions_v_blocks_cta_banner" ALTER COLUMN "variant" SET DATA TYPE "public"."enum__solutions_v_blocks_cta_banner_variant" USING "variant"::"public"."enum__solutions_v_blocks_cta_banner_variant";
  ALTER TABLE "_solutions_v" ALTER COLUMN "version_icon" SET DATA TYPE text;
  ALTER TABLE "_solutions_v" ALTER COLUMN "version_icon" SET DEFAULT 'sparkles'::text;
  DROP TYPE "public"."enum__solutions_v_version_icon";
  CREATE TYPE "public"."enum__solutions_v_version_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app');
  ALTER TABLE "_solutions_v" ALTER COLUMN "version_icon" SET DEFAULT 'sparkles'::"public"."enum__solutions_v_version_icon";
  ALTER TABLE "_solutions_v" ALTER COLUMN "version_icon" SET DATA TYPE "public"."enum__solutions_v_version_icon" USING "version_icon"::"public"."enum__solutions_v_version_icon";
  ALTER TABLE "specialist_roles" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "specialist_roles" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::text;
  DROP TYPE "public"."enum_specialist_roles_icon";
  CREATE TYPE "public"."enum_specialist_roles_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app');
  ALTER TABLE "specialist_roles" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::"public"."enum_specialist_roles_icon";
  ALTER TABLE "specialist_roles" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_specialist_roles_icon" USING "icon"::"public"."enum_specialist_roles_icon";
  ALTER TABLE "site_settings_metrics" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "site_settings_metrics" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::text;
  DROP TYPE "public"."enum_site_settings_metrics_icon";
  CREATE TYPE "public"."enum_site_settings_metrics_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app');
  ALTER TABLE "site_settings_metrics" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::"public"."enum_site_settings_metrics_icon";
  ALTER TABLE "site_settings_metrics" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_site_settings_metrics_icon" USING "icon"::"public"."enum_site_settings_metrics_icon";
  ALTER TABLE "partners_blocks_page_hero" DROP COLUMN "cta_variant";
  ALTER TABLE "partners_blocks_page_hero" DROP COLUMN "description_width";
  ALTER TABLE "partners_blocks_sticky_page_nav" DROP COLUMN "variant";
  ALTER TABLE "partners_blocks_cta_banner" DROP COLUMN "secondary_cta_href";
  ALTER TABLE "partners_blocks_cta_banner_locales" DROP COLUMN "secondary_cta_label";
  ALTER TABLE "partners_blocks_cta_banner_locales" DROP COLUMN "secondary_cta_caption";
  ALTER TABLE "pages_blocks_page_hero" DROP COLUMN "cta_variant";
  ALTER TABLE "pages_blocks_page_hero" DROP COLUMN "description_width";
  ALTER TABLE "pages_blocks_sticky_page_nav" DROP COLUMN "variant";
  ALTER TABLE "pages_blocks_cta_banner" DROP COLUMN "secondary_cta_href";
  ALTER TABLE "pages_blocks_cta_banner_locales" DROP COLUMN "secondary_cta_label";
  ALTER TABLE "pages_blocks_cta_banner_locales" DROP COLUMN "secondary_cta_caption";
  ALTER TABLE "_pages_v_blocks_page_hero" DROP COLUMN "cta_variant";
  ALTER TABLE "_pages_v_blocks_page_hero" DROP COLUMN "description_width";
  ALTER TABLE "_pages_v_blocks_sticky_page_nav" DROP COLUMN "variant";
  ALTER TABLE "_pages_v_blocks_cta_banner" DROP COLUMN "secondary_cta_href";
  ALTER TABLE "_pages_v_blocks_cta_banner_locales" DROP COLUMN "secondary_cta_label";
  ALTER TABLE "_pages_v_blocks_cta_banner_locales" DROP COLUMN "secondary_cta_caption";
  ALTER TABLE "solutions_blocks_page_hero" DROP COLUMN "cta_variant";
  ALTER TABLE "solutions_blocks_page_hero" DROP COLUMN "description_width";
  ALTER TABLE "solutions_blocks_sticky_page_nav" DROP COLUMN "variant";
  ALTER TABLE "solutions_blocks_cta_banner" DROP COLUMN "secondary_cta_href";
  ALTER TABLE "solutions_blocks_cta_banner_locales" DROP COLUMN "secondary_cta_label";
  ALTER TABLE "solutions_blocks_cta_banner_locales" DROP COLUMN "secondary_cta_caption";
  ALTER TABLE "_solutions_v_blocks_page_hero" DROP COLUMN "cta_variant";
  ALTER TABLE "_solutions_v_blocks_page_hero" DROP COLUMN "description_width";
  ALTER TABLE "_solutions_v_blocks_sticky_page_nav" DROP COLUMN "variant";
  ALTER TABLE "_solutions_v_blocks_cta_banner" DROP COLUMN "secondary_cta_href";
  ALTER TABLE "_solutions_v_blocks_cta_banner_locales" DROP COLUMN "secondary_cta_label";
  ALTER TABLE "_solutions_v_blocks_cta_banner_locales" DROP COLUMN "secondary_cta_caption";
  DROP TYPE "public"."enum_partners_blocks_page_hero_metrics_color";
  DROP TYPE "public"."enum_partners_blocks_page_hero_cta_variant";
  DROP TYPE "public"."enum_partners_blocks_page_hero_description_width";
  DROP TYPE "public"."enum_partners_blocks_sticky_page_nav_variant";
  DROP TYPE "public"."enum_partners_blocks_method_cards_items_icon";
  DROP TYPE "public"."enum_partners_blocks_method_cards_items_accent";
  DROP TYPE "public"."enum_partners_blocks_method_cards_eyebrow_icon";
  DROP TYPE "public"."enum_partners_blocks_method_cards_borda";
  DROP TYPE "public"."enum_partners_blocks_method_cards_theme";
  DROP TYPE "public"."enum_partners_blocks_bento_grid_items_metrics_color";
  DROP TYPE "public"."enum_partners_blocks_bento_grid_items_span";
  DROP TYPE "public"."enum_partners_blocks_bento_grid_items_size";
  DROP TYPE "public"."enum_partners_blocks_bento_grid_items_accent";
  DROP TYPE "public"."enum_partners_blocks_bento_grid_items_icon";
  DROP TYPE "public"."enum_partners_blocks_bento_grid_eyebrow_icon";
  DROP TYPE "public"."enum_partners_blocks_bento_grid_borda";
  DROP TYPE "public"."enum_partners_blocks_bento_grid_theme";
  DROP TYPE "public"."enum_partners_blocks_audience_split_items_icon";
  DROP TYPE "public"."enum_partners_blocks_audience_split_items_accent";
  DROP TYPE "public"."enum_partners_blocks_audience_split_eyebrow_icon";
  DROP TYPE "public"."enum_partners_blocks_audience_split_borda";
  DROP TYPE "public"."enum_partners_blocks_audience_split_theme";
  DROP TYPE "public"."enum_partners_blocks_accordion_steps_eyebrow_icon";
  DROP TYPE "public"."enum_partners_blocks_accordion_steps_image_badge_icon";
  DROP TYPE "public"."enum_partners_blocks_accordion_steps_borda";
  DROP TYPE "public"."enum_partners_blocks_accordion_steps_theme";
  DROP TYPE "public"."enum_pages_blocks_page_hero_metrics_color";
  DROP TYPE "public"."enum_pages_blocks_page_hero_cta_variant";
  DROP TYPE "public"."enum_pages_blocks_page_hero_description_width";
  DROP TYPE "public"."enum_pages_blocks_sticky_page_nav_variant";
  DROP TYPE "public"."enum_pages_blocks_method_cards_items_icon";
  DROP TYPE "public"."enum_pages_blocks_method_cards_items_accent";
  DROP TYPE "public"."enum_pages_blocks_method_cards_eyebrow_icon";
  DROP TYPE "public"."enum_pages_blocks_method_cards_borda";
  DROP TYPE "public"."enum_pages_blocks_method_cards_theme";
  DROP TYPE "public"."enum_pages_blocks_bento_grid_items_metrics_color";
  DROP TYPE "public"."enum_pages_blocks_bento_grid_items_span";
  DROP TYPE "public"."enum_pages_blocks_bento_grid_items_size";
  DROP TYPE "public"."enum_pages_blocks_bento_grid_items_accent";
  DROP TYPE "public"."enum_pages_blocks_bento_grid_items_icon";
  DROP TYPE "public"."enum_pages_blocks_bento_grid_eyebrow_icon";
  DROP TYPE "public"."enum_pages_blocks_bento_grid_borda";
  DROP TYPE "public"."enum_pages_blocks_bento_grid_theme";
  DROP TYPE "public"."enum_pages_blocks_audience_split_items_icon";
  DROP TYPE "public"."enum_pages_blocks_audience_split_items_accent";
  DROP TYPE "public"."enum_pages_blocks_audience_split_eyebrow_icon";
  DROP TYPE "public"."enum_pages_blocks_audience_split_borda";
  DROP TYPE "public"."enum_pages_blocks_audience_split_theme";
  DROP TYPE "public"."enum_pages_blocks_accordion_steps_eyebrow_icon";
  DROP TYPE "public"."enum_pages_blocks_accordion_steps_image_badge_icon";
  DROP TYPE "public"."enum_pages_blocks_accordion_steps_borda";
  DROP TYPE "public"."enum_pages_blocks_accordion_steps_theme";
  DROP TYPE "public"."enum__pages_v_blocks_page_hero_metrics_color";
  DROP TYPE "public"."enum__pages_v_blocks_page_hero_cta_variant";
  DROP TYPE "public"."enum__pages_v_blocks_page_hero_description_width";
  DROP TYPE "public"."enum__pages_v_blocks_sticky_page_nav_variant";
  DROP TYPE "public"."enum__pages_v_blocks_method_cards_items_icon";
  DROP TYPE "public"."enum__pages_v_blocks_method_cards_items_accent";
  DROP TYPE "public"."enum__pages_v_blocks_method_cards_eyebrow_icon";
  DROP TYPE "public"."enum__pages_v_blocks_method_cards_borda";
  DROP TYPE "public"."enum__pages_v_blocks_method_cards_theme";
  DROP TYPE "public"."enum__pages_v_blocks_bento_grid_items_metrics_color";
  DROP TYPE "public"."enum__pages_v_blocks_bento_grid_items_span";
  DROP TYPE "public"."enum__pages_v_blocks_bento_grid_items_size";
  DROP TYPE "public"."enum__pages_v_blocks_bento_grid_items_accent";
  DROP TYPE "public"."enum__pages_v_blocks_bento_grid_items_icon";
  DROP TYPE "public"."enum__pages_v_blocks_bento_grid_eyebrow_icon";
  DROP TYPE "public"."enum__pages_v_blocks_bento_grid_borda";
  DROP TYPE "public"."enum__pages_v_blocks_bento_grid_theme";
  DROP TYPE "public"."enum__pages_v_blocks_audience_split_items_icon";
  DROP TYPE "public"."enum__pages_v_blocks_audience_split_items_accent";
  DROP TYPE "public"."enum__pages_v_blocks_audience_split_eyebrow_icon";
  DROP TYPE "public"."enum__pages_v_blocks_audience_split_borda";
  DROP TYPE "public"."enum__pages_v_blocks_audience_split_theme";
  DROP TYPE "public"."enum__pages_v_blocks_accordion_steps_eyebrow_icon";
  DROP TYPE "public"."enum__pages_v_blocks_accordion_steps_image_badge_icon";
  DROP TYPE "public"."enum__pages_v_blocks_accordion_steps_borda";
  DROP TYPE "public"."enum__pages_v_blocks_accordion_steps_theme";
  DROP TYPE "public"."enum_solutions_blocks_page_hero_metrics_color";
  DROP TYPE "public"."enum_solutions_blocks_page_hero_cta_variant";
  DROP TYPE "public"."enum_solutions_blocks_page_hero_description_width";
  DROP TYPE "public"."enum_solutions_blocks_sticky_page_nav_variant";
  DROP TYPE "public"."enum_solutions_blocks_method_cards_items_icon";
  DROP TYPE "public"."enum_solutions_blocks_method_cards_items_accent";
  DROP TYPE "public"."enum_solutions_blocks_method_cards_eyebrow_icon";
  DROP TYPE "public"."enum_solutions_blocks_method_cards_borda";
  DROP TYPE "public"."enum_solutions_blocks_method_cards_theme";
  DROP TYPE "public"."enum_solutions_blocks_bento_grid_items_metrics_color";
  DROP TYPE "public"."enum_solutions_blocks_bento_grid_items_span";
  DROP TYPE "public"."enum_solutions_blocks_bento_grid_items_size";
  DROP TYPE "public"."enum_solutions_blocks_bento_grid_items_accent";
  DROP TYPE "public"."enum_solutions_blocks_bento_grid_items_icon";
  DROP TYPE "public"."enum_solutions_blocks_bento_grid_eyebrow_icon";
  DROP TYPE "public"."enum_solutions_blocks_bento_grid_borda";
  DROP TYPE "public"."enum_solutions_blocks_bento_grid_theme";
  DROP TYPE "public"."enum_solutions_blocks_audience_split_items_icon";
  DROP TYPE "public"."enum_solutions_blocks_audience_split_items_accent";
  DROP TYPE "public"."enum_solutions_blocks_audience_split_eyebrow_icon";
  DROP TYPE "public"."enum_solutions_blocks_audience_split_borda";
  DROP TYPE "public"."enum_solutions_blocks_audience_split_theme";
  DROP TYPE "public"."enum_solutions_blocks_accordion_steps_eyebrow_icon";
  DROP TYPE "public"."enum_solutions_blocks_accordion_steps_image_badge_icon";
  DROP TYPE "public"."enum_solutions_blocks_accordion_steps_borda";
  DROP TYPE "public"."enum_solutions_blocks_accordion_steps_theme";
  DROP TYPE "public"."enum__solutions_v_blocks_page_hero_metrics_color";
  DROP TYPE "public"."enum__solutions_v_blocks_page_hero_cta_variant";
  DROP TYPE "public"."enum__solutions_v_blocks_page_hero_description_width";
  DROP TYPE "public"."enum__solutions_v_blocks_sticky_page_nav_variant";
  DROP TYPE "public"."enum__solutions_v_blocks_method_cards_items_icon";
  DROP TYPE "public"."enum__solutions_v_blocks_method_cards_items_accent";
  DROP TYPE "public"."enum__solutions_v_blocks_method_cards_eyebrow_icon";
  DROP TYPE "public"."enum__solutions_v_blocks_method_cards_borda";
  DROP TYPE "public"."enum__solutions_v_blocks_method_cards_theme";
  DROP TYPE "public"."enum__solutions_v_blocks_bento_grid_items_metrics_color";
  DROP TYPE "public"."enum__solutions_v_blocks_bento_grid_items_span";
  DROP TYPE "public"."enum__solutions_v_blocks_bento_grid_items_size";
  DROP TYPE "public"."enum__solutions_v_blocks_bento_grid_items_accent";
  DROP TYPE "public"."enum__solutions_v_blocks_bento_grid_items_icon";
  DROP TYPE "public"."enum__solutions_v_blocks_bento_grid_eyebrow_icon";
  DROP TYPE "public"."enum__solutions_v_blocks_bento_grid_borda";
  DROP TYPE "public"."enum__solutions_v_blocks_bento_grid_theme";
  DROP TYPE "public"."enum__solutions_v_blocks_audience_split_items_icon";
  DROP TYPE "public"."enum__solutions_v_blocks_audience_split_items_accent";
  DROP TYPE "public"."enum__solutions_v_blocks_audience_split_eyebrow_icon";
  DROP TYPE "public"."enum__solutions_v_blocks_audience_split_borda";
  DROP TYPE "public"."enum__solutions_v_blocks_audience_split_theme";
  DROP TYPE "public"."enum__solutions_v_blocks_accordion_steps_eyebrow_icon";
  DROP TYPE "public"."enum__solutions_v_blocks_accordion_steps_image_badge_icon";
  DROP TYPE "public"."enum__solutions_v_blocks_accordion_steps_borda";
  DROP TYPE "public"."enum__solutions_v_blocks_accordion_steps_theme";`)
}
