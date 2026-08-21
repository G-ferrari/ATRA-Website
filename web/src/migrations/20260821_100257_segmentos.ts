import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_segments_blocks_page_hero_metrics_color" AS ENUM('primary', 'secondary', 'emerald');
  CREATE TYPE "public"."enum_segments_blocks_page_hero_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_segments_blocks_page_hero_media_mode" AS ENUM('none', 'image', 'marquee');
  CREATE TYPE "public"."enum_segments_blocks_page_hero_cta_variant" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum_segments_blocks_page_hero_description_width" AS ENUM('narrow', 'wide');
  CREATE TYPE "public"."enum_segments_blocks_page_hero_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_segments_blocks_page_hero_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_segments_blocks_page_hero_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_segments_blocks_sticky_page_nav_variant" AS ENUM('institutional', 'solution');
  CREATE TYPE "public"."enum_segments_blocks_sticky_page_nav_bottom_gap" AS ENUM('normal', 'none');
  CREATE TYPE "public"."enum_segments_blocks_sticky_page_nav_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_segments_blocks_sticky_page_nav_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_segments_blocks_sticky_page_nav_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_segments_blocks_stats_grid_source" AS ENUM('siteSettings', 'custom');
  CREATE TYPE "public"."enum_segments_blocks_stats_grid_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_segments_blocks_stats_grid_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_segments_blocks_stats_grid_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_segments_blocks_rich_text_section_header_layout" AS ENUM('inline', 'centered');
  CREATE TYPE "public"."enum_segments_blocks_rich_text_section_image_position" AS ENUM('left', 'right', 'none');
  CREATE TYPE "public"."enum_segments_blocks_rich_text_section_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_segments_blocks_rich_text_section_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_segments_blocks_rich_text_section_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_segments_blocks_icon_card_grid_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum_segments_blocks_icon_card_grid_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_segments_blocks_icon_card_grid_variant" AS ENUM('compact', 'card', 'card-centered');
  CREATE TYPE "public"."enum_segments_blocks_icon_card_grid_header_width" AS ENUM('full', 'narrow');
  CREATE TYPE "public"."enum_segments_blocks_icon_card_grid_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_segments_blocks_icon_card_grid_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_segments_blocks_icon_card_grid_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_segments_blocks_value_cards_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum_segments_blocks_value_cards_items_glow_color" AS ENUM('blue', 'orange');
  CREATE TYPE "public"."enum_segments_blocks_value_cards_variant" AS ENUM('glow', 'expanded');
  CREATE TYPE "public"."enum_segments_blocks_value_cards_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_segments_blocks_value_cards_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_segments_blocks_value_cards_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_segments_blocks_partner_showcase_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_segments_blocks_partner_showcase_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_segments_blocks_partner_showcase_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_segments_blocks_seals_banner_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_segments_blocks_seals_banner_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_segments_blocks_seals_banner_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_segments_blocks_process_steps_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_segments_blocks_process_steps_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_segments_blocks_process_steps_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_segments_blocks_method_cards_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum_segments_blocks_method_cards_items_accent" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum_segments_blocks_method_cards_eyebrow_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum_segments_blocks_method_cards_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_segments_blocks_method_cards_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_segments_blocks_method_cards_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_segments_blocks_bento_grid_items_metrics_color" AS ENUM('primary', 'secondary', 'emerald');
  CREATE TYPE "public"."enum_segments_blocks_bento_grid_items_span" AS ENUM('5', '6', '7', '12');
  CREATE TYPE "public"."enum_segments_blocks_bento_grid_items_size" AS ENUM('featured-wide', 'featured', 'supporting');
  CREATE TYPE "public"."enum_segments_blocks_bento_grid_items_accent" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum_segments_blocks_bento_grid_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum_segments_blocks_bento_grid_items_footer_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum_segments_blocks_bento_grid_eyebrow_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum_segments_blocks_bento_grid_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_segments_blocks_bento_grid_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_segments_blocks_bento_grid_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_segments_blocks_audience_split_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum_segments_blocks_audience_split_items_accent" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum_segments_blocks_audience_split_eyebrow_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum_segments_blocks_audience_split_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_segments_blocks_audience_split_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_segments_blocks_audience_split_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_segments_blocks_accordion_steps_eyebrow_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum_segments_blocks_accordion_steps_image_badge_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum_segments_blocks_accordion_steps_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_segments_blocks_accordion_steps_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_segments_blocks_accordion_steps_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_segments_blocks_cta_contact_variant" AS ENUM('panel', 'photo');
  CREATE TYPE "public"."enum_segments_blocks_cta_contact_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_segments_blocks_cta_contact_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_segments_blocks_cta_contact_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_segments_blocks_jobs_list_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_segments_blocks_jobs_list_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_segments_blocks_jobs_list_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_segments_blocks_cta_banner_variant" AS ENUM('primary', 'subtle', 'dark', 'dark-centered');
  CREATE TYPE "public"."enum_segments_blocks_cta_banner_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_segments_blocks_cta_banner_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_segments_blocks_cta_banner_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_segments_blocks_partner_hero_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_segments_blocks_partner_hero_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_segments_blocks_partner_hero_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_segments_blocks_partner_split_right_column" AS ENUM('image', 'checklist', 'specGrid');
  CREATE TYPE "public"."enum_segments_blocks_partner_split_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_segments_blocks_partner_split_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_segments_blocks_partner_split_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_segments_blocks_home_hero_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_segments_blocks_home_hero_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_segments_blocks_home_hero_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_segments_blocks_logo_marquee_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_segments_blocks_logo_marquee_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_segments_blocks_logo_marquee_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_segments_blocks_feature_tabs_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum_segments_blocks_feature_tabs_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_segments_blocks_feature_tabs_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_segments_blocks_feature_tabs_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_segments_blocks_home_bento_metrics_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum_segments_blocks_home_bento_metrics_color" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum_segments_blocks_home_bento_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_segments_blocks_home_bento_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_segments_blocks_home_bento_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_segments_blocks_case_carousel_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum_segments_blocks_case_carousel_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_segments_blocks_case_carousel_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_segments_blocks_case_carousel_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_segments_blocks_testimonial_carousel_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_segments_blocks_testimonial_carousel_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_segments_blocks_testimonial_carousel_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_segments_blocks_content_teaser_cards_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum_segments_blocks_content_teaser_cards_column" AS ENUM('first', 'second');
  CREATE TYPE "public"."enum_segments_blocks_content_teaser_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_segments_blocks_content_teaser_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_segments_blocks_content_teaser_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_segments_blocks_insights_hub_formats_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum_segments_blocks_insights_hub_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_segments_blocks_insights_hub_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_segments_blocks_insights_hub_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_segments_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum_segments_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__segments_v_blocks_page_hero_metrics_color" AS ENUM('primary', 'secondary', 'emerald');
  CREATE TYPE "public"."enum__segments_v_blocks_page_hero_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__segments_v_blocks_page_hero_media_mode" AS ENUM('none', 'image', 'marquee');
  CREATE TYPE "public"."enum__segments_v_blocks_page_hero_cta_variant" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum__segments_v_blocks_page_hero_description_width" AS ENUM('narrow', 'wide');
  CREATE TYPE "public"."enum__segments_v_blocks_page_hero_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__segments_v_blocks_page_hero_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum__segments_v_blocks_page_hero_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__segments_v_blocks_sticky_page_nav_variant" AS ENUM('institutional', 'solution');
  CREATE TYPE "public"."enum__segments_v_blocks_sticky_page_nav_bottom_gap" AS ENUM('normal', 'none');
  CREATE TYPE "public"."enum__segments_v_blocks_sticky_page_nav_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__segments_v_blocks_sticky_page_nav_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum__segments_v_blocks_sticky_page_nav_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__segments_v_blocks_stats_grid_source" AS ENUM('siteSettings', 'custom');
  CREATE TYPE "public"."enum__segments_v_blocks_stats_grid_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__segments_v_blocks_stats_grid_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum__segments_v_blocks_stats_grid_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__segments_v_blocks_rich_text_section_header_layout" AS ENUM('inline', 'centered');
  CREATE TYPE "public"."enum__segments_v_blocks_rich_text_section_image_position" AS ENUM('left', 'right', 'none');
  CREATE TYPE "public"."enum__segments_v_blocks_rich_text_section_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__segments_v_blocks_rich_text_section_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum__segments_v_blocks_rich_text_section_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__segments_v_blocks_icon_card_grid_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum__segments_v_blocks_icon_card_grid_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__segments_v_blocks_icon_card_grid_variant" AS ENUM('compact', 'card', 'card-centered');
  CREATE TYPE "public"."enum__segments_v_blocks_icon_card_grid_header_width" AS ENUM('full', 'narrow');
  CREATE TYPE "public"."enum__segments_v_blocks_icon_card_grid_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__segments_v_blocks_icon_card_grid_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum__segments_v_blocks_icon_card_grid_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__segments_v_blocks_value_cards_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum__segments_v_blocks_value_cards_items_glow_color" AS ENUM('blue', 'orange');
  CREATE TYPE "public"."enum__segments_v_blocks_value_cards_variant" AS ENUM('glow', 'expanded');
  CREATE TYPE "public"."enum__segments_v_blocks_value_cards_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__segments_v_blocks_value_cards_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum__segments_v_blocks_value_cards_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__segments_v_blocks_partner_showcase_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__segments_v_blocks_partner_showcase_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum__segments_v_blocks_partner_showcase_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__segments_v_blocks_seals_banner_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__segments_v_blocks_seals_banner_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum__segments_v_blocks_seals_banner_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__segments_v_blocks_process_steps_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__segments_v_blocks_process_steps_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum__segments_v_blocks_process_steps_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__segments_v_blocks_method_cards_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum__segments_v_blocks_method_cards_items_accent" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum__segments_v_blocks_method_cards_eyebrow_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum__segments_v_blocks_method_cards_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__segments_v_blocks_method_cards_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum__segments_v_blocks_method_cards_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__segments_v_blocks_bento_grid_items_metrics_color" AS ENUM('primary', 'secondary', 'emerald');
  CREATE TYPE "public"."enum__segments_v_blocks_bento_grid_items_span" AS ENUM('5', '6', '7', '12');
  CREATE TYPE "public"."enum__segments_v_blocks_bento_grid_items_size" AS ENUM('featured-wide', 'featured', 'supporting');
  CREATE TYPE "public"."enum__segments_v_blocks_bento_grid_items_accent" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum__segments_v_blocks_bento_grid_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum__segments_v_blocks_bento_grid_items_footer_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum__segments_v_blocks_bento_grid_eyebrow_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum__segments_v_blocks_bento_grid_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__segments_v_blocks_bento_grid_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum__segments_v_blocks_bento_grid_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__segments_v_blocks_audience_split_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum__segments_v_blocks_audience_split_items_accent" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum__segments_v_blocks_audience_split_eyebrow_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum__segments_v_blocks_audience_split_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__segments_v_blocks_audience_split_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum__segments_v_blocks_audience_split_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__segments_v_blocks_accordion_steps_eyebrow_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum__segments_v_blocks_accordion_steps_image_badge_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum__segments_v_blocks_accordion_steps_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__segments_v_blocks_accordion_steps_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum__segments_v_blocks_accordion_steps_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__segments_v_blocks_cta_contact_variant" AS ENUM('panel', 'photo');
  CREATE TYPE "public"."enum__segments_v_blocks_cta_contact_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__segments_v_blocks_cta_contact_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum__segments_v_blocks_cta_contact_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__segments_v_blocks_jobs_list_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__segments_v_blocks_jobs_list_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum__segments_v_blocks_jobs_list_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__segments_v_blocks_cta_banner_variant" AS ENUM('primary', 'subtle', 'dark', 'dark-centered');
  CREATE TYPE "public"."enum__segments_v_blocks_cta_banner_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__segments_v_blocks_cta_banner_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum__segments_v_blocks_cta_banner_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__segments_v_blocks_partner_hero_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__segments_v_blocks_partner_hero_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum__segments_v_blocks_partner_hero_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__segments_v_blocks_partner_split_right_column" AS ENUM('image', 'checklist', 'specGrid');
  CREATE TYPE "public"."enum__segments_v_blocks_partner_split_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__segments_v_blocks_partner_split_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum__segments_v_blocks_partner_split_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__segments_v_blocks_home_hero_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__segments_v_blocks_home_hero_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum__segments_v_blocks_home_hero_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__segments_v_blocks_logo_marquee_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__segments_v_blocks_logo_marquee_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum__segments_v_blocks_logo_marquee_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__segments_v_blocks_feature_tabs_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum__segments_v_blocks_feature_tabs_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__segments_v_blocks_feature_tabs_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum__segments_v_blocks_feature_tabs_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__segments_v_blocks_home_bento_metrics_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum__segments_v_blocks_home_bento_metrics_color" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum__segments_v_blocks_home_bento_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__segments_v_blocks_home_bento_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum__segments_v_blocks_home_bento_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__segments_v_blocks_case_carousel_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum__segments_v_blocks_case_carousel_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__segments_v_blocks_case_carousel_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum__segments_v_blocks_case_carousel_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__segments_v_blocks_testimonial_carousel_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__segments_v_blocks_testimonial_carousel_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum__segments_v_blocks_testimonial_carousel_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__segments_v_blocks_content_teaser_cards_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum__segments_v_blocks_content_teaser_cards_column" AS ENUM('first', 'second');
  CREATE TYPE "public"."enum__segments_v_blocks_content_teaser_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__segments_v_blocks_content_teaser_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum__segments_v_blocks_content_teaser_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__segments_v_blocks_insights_hub_formats_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum__segments_v_blocks_insights_hub_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__segments_v_blocks_insights_hub_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum__segments_v_blocks_insights_hub_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__segments_v_version_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum__segments_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__segments_v_published_locale" AS ENUM('pt', 'en');
  CREATE TABLE "segments_blocks_page_hero_ctas" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar
  );
  
  CREATE TABLE "segments_blocks_page_hero_ctas_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_page_hero_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" numeric,
  	"suffix" varchar,
  	"color" "enum_segments_blocks_page_hero_metrics_color" DEFAULT 'primary'
  );
  
  CREATE TABLE "segments_blocks_page_hero_metrics_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_page_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"align" "enum_segments_blocks_page_hero_align" DEFAULT 'left',
  	"media_mode" "enum_segments_blocks_page_hero_media_mode" DEFAULT 'none',
  	"cta_variant" "enum_segments_blocks_page_hero_cta_variant" DEFAULT 'primary',
  	"description_width" "enum_segments_blocks_page_hero_description_width" DEFAULT 'narrow',
  	"anchor" varchar,
  	"borda" "enum_segments_blocks_page_hero_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_segments_blocks_page_hero_spacing" DEFAULT 'normal',
  	"theme" "enum_segments_blocks_page_hero_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "segments_blocks_page_hero_locales" (
  	"badge" varchar,
  	"chip" varchar,
  	"title" varchar,
  	"subtitle" varchar,
  	"description" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_sticky_page_nav" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_segments_blocks_sticky_page_nav_variant" DEFAULT 'institutional',
  	"bottom_gap" "enum_segments_blocks_sticky_page_nav_bottom_gap" DEFAULT 'normal',
  	"anchor" varchar,
  	"borda" "enum_segments_blocks_sticky_page_nav_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_segments_blocks_sticky_page_nav_spacing" DEFAULT 'normal',
  	"theme" "enum_segments_blocks_sticky_page_nav_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "segments_blocks_sticky_page_nav_locales" (
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_stats_grid_custom_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" numeric,
  	"suffix" varchar
  );
  
  CREATE TABLE "segments_blocks_stats_grid_custom_items_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_stats_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" "enum_segments_blocks_stats_grid_source" DEFAULT 'siteSettings',
  	"anchor" varchar,
  	"borda" "enum_segments_blocks_stats_grid_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_segments_blocks_stats_grid_spacing" DEFAULT 'normal',
  	"theme" "enum_segments_blocks_stats_grid_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "segments_blocks_stats_grid_locales" (
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_rich_text_section_ctas" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar
  );
  
  CREATE TABLE "segments_blocks_rich_text_section_ctas_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_rich_text_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"header_layout" "enum_segments_blocks_rich_text_section_header_layout" DEFAULT 'inline',
  	"image_position" "enum_segments_blocks_rich_text_section_image_position" DEFAULT 'right',
  	"anchor" varchar,
  	"borda" "enum_segments_blocks_rich_text_section_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_segments_blocks_rich_text_section_spacing" DEFAULT 'normal',
  	"theme" "enum_segments_blocks_rich_text_section_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "segments_blocks_rich_text_section_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" jsonb,
  	"description" varchar,
  	"subtitle" varchar,
  	"callout_label" varchar,
  	"callout_text" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_icon_card_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_segments_blocks_icon_card_grid_items_icon" DEFAULT 'sparkles'
  );
  
  CREATE TABLE "segments_blocks_icon_card_grid_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_icon_card_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"columns" "enum_segments_blocks_icon_card_grid_columns" DEFAULT '4',
  	"variant" "enum_segments_blocks_icon_card_grid_variant" DEFAULT 'compact',
  	"header_width" "enum_segments_blocks_icon_card_grid_header_width" DEFAULT 'full',
  	"anchor" varchar,
  	"borda" "enum_segments_blocks_icon_card_grid_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_segments_blocks_icon_card_grid_spacing" DEFAULT 'normal',
  	"theme" "enum_segments_blocks_icon_card_grid_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "segments_blocks_icon_card_grid_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_value_cards_items_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "segments_blocks_value_cards_items_bullets_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_value_cards_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_segments_blocks_value_cards_items_icon" DEFAULT 'sparkles',
  	"glow_color" "enum_segments_blocks_value_cards_items_glow_color" DEFAULT 'blue'
  );
  
  CREATE TABLE "segments_blocks_value_cards_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_value_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_segments_blocks_value_cards_variant" DEFAULT 'glow',
  	"anchor" varchar,
  	"borda" "enum_segments_blocks_value_cards_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_segments_blocks_value_cards_spacing" DEFAULT 'normal',
  	"theme" "enum_segments_blocks_value_cards_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "segments_blocks_value_cards_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"highlight" varchar,
  	"description" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_partner_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"grayscale" boolean DEFAULT true,
  	"anchor" varchar,
  	"borda" "enum_segments_blocks_partner_showcase_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_segments_blocks_partner_showcase_spacing" DEFAULT 'normal',
  	"theme" "enum_segments_blocks_partner_showcase_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "segments_blocks_partner_showcase_locales" (
  	"title" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_seals_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum_segments_blocks_seals_banner_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_segments_blocks_seals_banner_spacing" DEFAULT 'normal',
  	"theme" "enum_segments_blocks_seals_banner_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "segments_blocks_seals_banner_locales" (
  	"title" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_process_steps_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "segments_blocks_process_steps_steps_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum_segments_blocks_process_steps_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_segments_blocks_process_steps_spacing" DEFAULT 'normal',
  	"theme" "enum_segments_blocks_process_steps_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "segments_blocks_process_steps_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_method_cards_items_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "segments_blocks_method_cards_items_bullets_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_method_cards_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_segments_blocks_method_cards_items_icon" DEFAULT 'sparkles',
  	"accent" "enum_segments_blocks_method_cards_items_accent" DEFAULT 'primary'
  );
  
  CREATE TABLE "segments_blocks_method_cards_items_locales" (
  	"badge" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_method_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow_icon" "enum_segments_blocks_method_cards_eyebrow_icon",
  	"header_cta_href" varchar,
  	"anchor" varchar,
  	"borda" "enum_segments_blocks_method_cards_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_segments_blocks_method_cards_spacing" DEFAULT 'normal',
  	"theme" "enum_segments_blocks_method_cards_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "segments_blocks_method_cards_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"header_cta_label" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_bento_grid_items_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"color" "enum_segments_blocks_bento_grid_items_metrics_color" DEFAULT 'primary'
  );
  
  CREATE TABLE "segments_blocks_bento_grid_items_metrics_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_bento_grid_items_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "segments_blocks_bento_grid_items_tags_locales" (
  	"name" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_bento_grid_items_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "segments_blocks_bento_grid_items_bullets_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_bento_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"span" "enum_segments_blocks_bento_grid_items_span" DEFAULT '6',
  	"size" "enum_segments_blocks_bento_grid_items_size" DEFAULT 'supporting',
  	"accent" "enum_segments_blocks_bento_grid_items_accent" DEFAULT 'primary',
  	"icon" "enum_segments_blocks_bento_grid_items_icon",
  	"footer_icon" "enum_segments_blocks_bento_grid_items_footer_icon"
  );
  
  CREATE TABLE "segments_blocks_bento_grid_items_locales" (
  	"badge" varchar,
  	"chip" varchar,
  	"title" varchar,
  	"description" varchar,
  	"footer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_bento_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow_icon" "enum_segments_blocks_bento_grid_eyebrow_icon",
  	"anchor" varchar,
  	"borda" "enum_segments_blocks_bento_grid_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_segments_blocks_bento_grid_spacing" DEFAULT 'normal',
  	"theme" "enum_segments_blocks_bento_grid_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "segments_blocks_bento_grid_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_audience_split_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_segments_blocks_audience_split_items_icon" DEFAULT 'sparkles',
  	"accent" "enum_segments_blocks_audience_split_items_accent" DEFAULT 'primary'
  );
  
  CREATE TABLE "segments_blocks_audience_split_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_audience_split" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow_icon" "enum_segments_blocks_audience_split_eyebrow_icon",
  	"cta_href" varchar,
  	"anchor" varchar,
  	"borda" "enum_segments_blocks_audience_split_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_segments_blocks_audience_split_spacing" DEFAULT 'normal',
  	"theme" "enum_segments_blocks_audience_split_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "segments_blocks_audience_split_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_accordion_steps_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "segments_blocks_accordion_steps_steps_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_accordion_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow_icon" "enum_segments_blocks_accordion_steps_eyebrow_icon",
  	"image_id" integer,
  	"image_badge_icon" "enum_segments_blocks_accordion_steps_image_badge_icon",
  	"anchor" varchar,
  	"borda" "enum_segments_blocks_accordion_steps_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_segments_blocks_accordion_steps_spacing" DEFAULT 'normal',
  	"theme" "enum_segments_blocks_accordion_steps_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "segments_blocks_accordion_steps_locales" (
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
  
  CREATE TABLE "segments_blocks_cta_contact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"show_contact_card" boolean DEFAULT true,
  	"variant" "enum_segments_blocks_cta_contact_variant" DEFAULT 'panel',
  	"photo_id" integer,
  	"anchor" varchar,
  	"borda" "enum_segments_blocks_cta_contact_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_segments_blocks_cta_contact_spacing" DEFAULT 'normal',
  	"theme" "enum_segments_blocks_cta_contact_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "segments_blocks_cta_contact_locales" (
  	"title" varchar,
  	"subtitle" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_jobs_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum_segments_blocks_jobs_list_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_segments_blocks_jobs_list_spacing" DEFAULT 'normal',
  	"theme" "enum_segments_blocks_jobs_list_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "segments_blocks_jobs_list_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"empty_text" varchar,
  	"talent_bank_eyebrow" varchar,
  	"talent_bank_title" varchar,
  	"talent_bank_highlight" varchar,
  	"talent_bank_description" varchar,
  	"talent_bank_note" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_cta_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"cta_href" varchar,
  	"secondary_cta_href" varchar,
  	"variant" "enum_segments_blocks_cta_banner_variant" DEFAULT 'primary',
  	"anchor" varchar,
  	"borda" "enum_segments_blocks_cta_banner_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_segments_blocks_cta_banner_spacing" DEFAULT 'normal',
  	"theme" "enum_segments_blocks_cta_banner_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "segments_blocks_cta_banner_locales" (
  	"title" varchar,
  	"highlight" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"secondary_cta_label" varchar,
  	"secondary_cta_caption" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_partner_hero_awards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"highlight" varchar
  );
  
  CREATE TABLE "segments_blocks_partner_hero_awards_locales" (
  	"top_text" varchar,
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_partner_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"cta_href" varchar,
  	"anchor" varchar,
  	"borda" "enum_segments_blocks_partner_hero_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_segments_blocks_partner_hero_spacing" DEFAULT 'normal',
  	"theme" "enum_segments_blocks_partner_hero_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "segments_blocks_partner_hero_locales" (
  	"badge" varchar,
  	"chip" varchar,
  	"title" varchar,
  	"highlight" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_partner_split_body" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "segments_blocks_partner_split_body_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_partner_split_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "segments_blocks_partner_split_items_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_partner_split" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"right_column" "enum_segments_blocks_partner_split_right_column" DEFAULT 'image',
  	"image_id" integer,
  	"logo_id" integer,
  	"cta_href" varchar,
  	"link_cta_href" varchar,
  	"anchor" varchar,
  	"borda" "enum_segments_blocks_partner_split_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_segments_blocks_partner_split_spacing" DEFAULT 'normal',
  	"theme" "enum_segments_blocks_partner_split_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "segments_blocks_partner_split_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"image_label" varchar,
  	"cta_label" varchar,
  	"link_cta_label" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_home_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum_segments_blocks_home_hero_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_segments_blocks_home_hero_spacing" DEFAULT 'normal',
  	"theme" "enum_segments_blocks_home_hero_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "segments_blocks_home_hero_locales" (
  	"title_prefix" varchar,
  	"description" varchar,
  	"scroll_label" varchar,
  	"prompt_title" varchar,
  	"prompt_placeholder" varchar,
  	"prompt_disclaimer" varchar,
  	"prompt_clients_title" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_logo_marquee_partners" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer
  );
  
  CREATE TABLE "segments_blocks_logo_marquee" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum_segments_blocks_logo_marquee_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_segments_blocks_logo_marquee_spacing" DEFAULT 'normal',
  	"theme" "enum_segments_blocks_logo_marquee_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "segments_blocks_logo_marquee_locales" (
  	"title" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_feature_tabs_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_segments_blocks_feature_tabs_items_icon" DEFAULT 'sparkles',
  	"image_id" integer
  );
  
  CREATE TABLE "segments_blocks_feature_tabs_items_locales" (
  	"badge" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_feature_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"cta_href" varchar,
  	"anchor" varchar,
  	"borda" "enum_segments_blocks_feature_tabs_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_segments_blocks_feature_tabs_spacing" DEFAULT 'normal',
  	"theme" "enum_segments_blocks_feature_tabs_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "segments_blocks_feature_tabs_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"footnote" varchar,
  	"cta_label" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_home_bento_partner_card_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer
  );
  
  CREATE TABLE "segments_blocks_home_bento_partner_card_items_locales" (
  	"subtitle" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_home_bento_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_segments_blocks_home_bento_metrics_icon" DEFAULT 'sparkles',
  	"value" varchar,
  	"color" "enum_segments_blocks_home_bento_metrics_color" DEFAULT 'primary'
  );
  
  CREATE TABLE "segments_blocks_home_bento_metrics_locales" (
  	"tag" varchar,
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_home_bento" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"seals_card_counter" varchar,
  	"anchor" varchar,
  	"borda" "enum_segments_blocks_home_bento_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_segments_blocks_home_bento_spacing" DEFAULT 'normal',
  	"theme" "enum_segments_blocks_home_bento_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "segments_blocks_home_bento_locales" (
  	"partner_card_eyebrow" varchar,
  	"partner_card_title" varchar,
  	"partner_card_description" varchar,
  	"seals_card_eyebrow" varchar,
  	"seals_card_title" varchar,
  	"seals_card_description" varchar,
  	"seals_card_badge" varchar,
  	"seals_card_footnote" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_case_carousel_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_segments_blocks_case_carousel_items_icon" DEFAULT 'sparkles',
  	"href" varchar,
  	"image_id" integer,
  	"color" varchar
  );
  
  CREATE TABLE "segments_blocks_case_carousel_items_locales" (
  	"company" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_case_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"cta_href" varchar,
  	"anchor" varchar,
  	"borda" "enum_segments_blocks_case_carousel_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_segments_blocks_case_carousel_spacing" DEFAULT 'normal',
  	"theme" "enum_segments_blocks_case_carousel_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "segments_blocks_case_carousel_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"read_label" varchar,
  	"cta_label" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_testimonial_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum_segments_blocks_testimonial_carousel_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_segments_blocks_testimonial_carousel_spacing" DEFAULT 'normal',
  	"theme" "enum_segments_blocks_testimonial_carousel_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "segments_blocks_testimonial_carousel_locales" (
  	"title" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_content_teaser_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_segments_blocks_content_teaser_cards_icon" DEFAULT 'sparkles',
  	"href" varchar,
  	"image_id" integer,
  	"column" "enum_segments_blocks_content_teaser_cards_column" DEFAULT 'first'
  );
  
  CREATE TABLE "segments_blocks_content_teaser_cards_locales" (
  	"category" varchar,
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_content_teaser" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"featured_href" varchar,
  	"featured_image_id" integer,
  	"anchor" varchar,
  	"borda" "enum_segments_blocks_content_teaser_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_segments_blocks_content_teaser_spacing" DEFAULT 'normal',
  	"theme" "enum_segments_blocks_content_teaser_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "segments_blocks_content_teaser_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"featured_category" varchar,
  	"featured_title" varchar,
  	"featured_cta_label" varchar,
  	"newsletter_title" varchar,
  	"newsletter_placeholder" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_insights_hub_formats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"icon" "enum_segments_blocks_insights_hub_formats_icon" DEFAULT 'sparkles',
  	"count" numeric,
  	"href" varchar
  );
  
  CREATE TABLE "segments_blocks_insights_hub_formats_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_insights_hub_items_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "segments_blocks_insights_hub_items_tags_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_insights_hub_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"format" varchar,
  	"href" varchar,
  	"image_id" integer,
  	"featured" boolean DEFAULT false
  );
  
  CREATE TABLE "segments_blocks_insights_hub_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"category" varchar,
  	"meta" varchar,
  	"date" varchar,
  	"author" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_insights_hub" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"closing_cta_href" varchar,
  	"closing_secondary_href" varchar,
  	"anchor" varchar,
  	"borda" "enum_segments_blocks_insights_hub_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_segments_blocks_insights_hub_spacing" DEFAULT 'normal',
  	"theme" "enum_segments_blocks_insights_hub_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "segments_blocks_insights_hub_locales" (
  	"badge" varchar,
  	"chip" varchar,
  	"title" varchar,
  	"highlight" varchar,
  	"description" varchar,
  	"portals_title" varchar,
  	"portals_description" varchar,
  	"newsletter_eyebrow" varchar,
  	"newsletter_title" varchar,
  	"newsletter_description" varchar,
  	"closing_title" varchar,
  	"closing_description" varchar,
  	"closing_cta_label" varchar,
  	"closing_secondary_label" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum_segments_icon" DEFAULT 'sparkles',
  	"order" numeric DEFAULT 0,
  	"seo_og_image_id" integer,
  	"seo_no_index" boolean,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_segments_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "segments_locales" (
  	"name" varchar,
  	"slug" varchar,
  	"short_description" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "segments_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar,
  	"locale" "_locales"
  );
  
  CREATE TABLE "segments_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"partners_id" integer,
  	"solutions_id" integer,
  	"cases_id" integer,
  	"clients_id" integer
  );
  
  CREATE TABLE "_segments_v_blocks_page_hero_ctas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_page_hero_ctas_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_page_hero_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" numeric,
  	"suffix" varchar,
  	"color" "enum__segments_v_blocks_page_hero_metrics_color" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_page_hero_metrics_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_page_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"align" "enum__segments_v_blocks_page_hero_align" DEFAULT 'left',
  	"media_mode" "enum__segments_v_blocks_page_hero_media_mode" DEFAULT 'none',
  	"cta_variant" "enum__segments_v_blocks_page_hero_cta_variant" DEFAULT 'primary',
  	"description_width" "enum__segments_v_blocks_page_hero_description_width" DEFAULT 'narrow',
  	"anchor" varchar,
  	"borda" "enum__segments_v_blocks_page_hero_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__segments_v_blocks_page_hero_spacing" DEFAULT 'normal',
  	"theme" "enum__segments_v_blocks_page_hero_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_page_hero_locales" (
  	"badge" varchar,
  	"chip" varchar,
  	"title" varchar,
  	"subtitle" varchar,
  	"description" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_sticky_page_nav" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__segments_v_blocks_sticky_page_nav_variant" DEFAULT 'institutional',
  	"bottom_gap" "enum__segments_v_blocks_sticky_page_nav_bottom_gap" DEFAULT 'normal',
  	"anchor" varchar,
  	"borda" "enum__segments_v_blocks_sticky_page_nav_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__segments_v_blocks_sticky_page_nav_spacing" DEFAULT 'normal',
  	"theme" "enum__segments_v_blocks_sticky_page_nav_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_sticky_page_nav_locales" (
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_stats_grid_custom_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" numeric,
  	"suffix" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_stats_grid_custom_items_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_stats_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"source" "enum__segments_v_blocks_stats_grid_source" DEFAULT 'siteSettings',
  	"anchor" varchar,
  	"borda" "enum__segments_v_blocks_stats_grid_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__segments_v_blocks_stats_grid_spacing" DEFAULT 'normal',
  	"theme" "enum__segments_v_blocks_stats_grid_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_stats_grid_locales" (
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_rich_text_section_ctas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_rich_text_section_ctas_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_rich_text_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"header_layout" "enum__segments_v_blocks_rich_text_section_header_layout" DEFAULT 'inline',
  	"image_position" "enum__segments_v_blocks_rich_text_section_image_position" DEFAULT 'right',
  	"anchor" varchar,
  	"borda" "enum__segments_v_blocks_rich_text_section_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__segments_v_blocks_rich_text_section_spacing" DEFAULT 'normal',
  	"theme" "enum__segments_v_blocks_rich_text_section_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_rich_text_section_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" jsonb,
  	"description" varchar,
  	"subtitle" varchar,
  	"callout_label" varchar,
  	"callout_text" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_icon_card_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__segments_v_blocks_icon_card_grid_items_icon" DEFAULT 'sparkles',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_icon_card_grid_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_icon_card_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"columns" "enum__segments_v_blocks_icon_card_grid_columns" DEFAULT '4',
  	"variant" "enum__segments_v_blocks_icon_card_grid_variant" DEFAULT 'compact',
  	"header_width" "enum__segments_v_blocks_icon_card_grid_header_width" DEFAULT 'full',
  	"anchor" varchar,
  	"borda" "enum__segments_v_blocks_icon_card_grid_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__segments_v_blocks_icon_card_grid_spacing" DEFAULT 'normal',
  	"theme" "enum__segments_v_blocks_icon_card_grid_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_icon_card_grid_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_value_cards_items_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_value_cards_items_bullets_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_value_cards_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__segments_v_blocks_value_cards_items_icon" DEFAULT 'sparkles',
  	"glow_color" "enum__segments_v_blocks_value_cards_items_glow_color" DEFAULT 'blue',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_value_cards_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_value_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__segments_v_blocks_value_cards_variant" DEFAULT 'glow',
  	"anchor" varchar,
  	"borda" "enum__segments_v_blocks_value_cards_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__segments_v_blocks_value_cards_spacing" DEFAULT 'normal',
  	"theme" "enum__segments_v_blocks_value_cards_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_value_cards_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"highlight" varchar,
  	"description" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_partner_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"grayscale" boolean DEFAULT true,
  	"anchor" varchar,
  	"borda" "enum__segments_v_blocks_partner_showcase_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__segments_v_blocks_partner_showcase_spacing" DEFAULT 'normal',
  	"theme" "enum__segments_v_blocks_partner_showcase_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_partner_showcase_locales" (
  	"title" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_seals_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum__segments_v_blocks_seals_banner_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__segments_v_blocks_seals_banner_spacing" DEFAULT 'normal',
  	"theme" "enum__segments_v_blocks_seals_banner_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_seals_banner_locales" (
  	"title" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_process_steps_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_process_steps_steps_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum__segments_v_blocks_process_steps_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__segments_v_blocks_process_steps_spacing" DEFAULT 'normal',
  	"theme" "enum__segments_v_blocks_process_steps_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_process_steps_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_method_cards_items_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_method_cards_items_bullets_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_method_cards_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__segments_v_blocks_method_cards_items_icon" DEFAULT 'sparkles',
  	"accent" "enum__segments_v_blocks_method_cards_items_accent" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_method_cards_items_locales" (
  	"badge" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_method_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow_icon" "enum__segments_v_blocks_method_cards_eyebrow_icon",
  	"header_cta_href" varchar,
  	"anchor" varchar,
  	"borda" "enum__segments_v_blocks_method_cards_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__segments_v_blocks_method_cards_spacing" DEFAULT 'normal',
  	"theme" "enum__segments_v_blocks_method_cards_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_method_cards_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"header_cta_label" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_bento_grid_items_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"color" "enum__segments_v_blocks_bento_grid_items_metrics_color" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_bento_grid_items_metrics_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_bento_grid_items_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_bento_grid_items_tags_locales" (
  	"name" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_bento_grid_items_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_bento_grid_items_bullets_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_bento_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"span" "enum__segments_v_blocks_bento_grid_items_span" DEFAULT '6',
  	"size" "enum__segments_v_blocks_bento_grid_items_size" DEFAULT 'supporting',
  	"accent" "enum__segments_v_blocks_bento_grid_items_accent" DEFAULT 'primary',
  	"icon" "enum__segments_v_blocks_bento_grid_items_icon",
  	"footer_icon" "enum__segments_v_blocks_bento_grid_items_footer_icon",
  	"_uuid" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_bento_grid_items_locales" (
  	"badge" varchar,
  	"chip" varchar,
  	"title" varchar,
  	"description" varchar,
  	"footer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_bento_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow_icon" "enum__segments_v_blocks_bento_grid_eyebrow_icon",
  	"anchor" varchar,
  	"borda" "enum__segments_v_blocks_bento_grid_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__segments_v_blocks_bento_grid_spacing" DEFAULT 'normal',
  	"theme" "enum__segments_v_blocks_bento_grid_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_bento_grid_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_audience_split_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__segments_v_blocks_audience_split_items_icon" DEFAULT 'sparkles',
  	"accent" "enum__segments_v_blocks_audience_split_items_accent" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_audience_split_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_audience_split" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow_icon" "enum__segments_v_blocks_audience_split_eyebrow_icon",
  	"cta_href" varchar,
  	"anchor" varchar,
  	"borda" "enum__segments_v_blocks_audience_split_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__segments_v_blocks_audience_split_spacing" DEFAULT 'normal',
  	"theme" "enum__segments_v_blocks_audience_split_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_audience_split_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_accordion_steps_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_accordion_steps_steps_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_accordion_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow_icon" "enum__segments_v_blocks_accordion_steps_eyebrow_icon",
  	"image_id" integer,
  	"image_badge_icon" "enum__segments_v_blocks_accordion_steps_image_badge_icon",
  	"anchor" varchar,
  	"borda" "enum__segments_v_blocks_accordion_steps_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__segments_v_blocks_accordion_steps_spacing" DEFAULT 'normal',
  	"theme" "enum__segments_v_blocks_accordion_steps_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_accordion_steps_locales" (
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
  
  CREATE TABLE "_segments_v_blocks_cta_contact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"show_contact_card" boolean DEFAULT true,
  	"variant" "enum__segments_v_blocks_cta_contact_variant" DEFAULT 'panel',
  	"photo_id" integer,
  	"anchor" varchar,
  	"borda" "enum__segments_v_blocks_cta_contact_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__segments_v_blocks_cta_contact_spacing" DEFAULT 'normal',
  	"theme" "enum__segments_v_blocks_cta_contact_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_cta_contact_locales" (
  	"title" varchar,
  	"subtitle" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_jobs_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum__segments_v_blocks_jobs_list_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__segments_v_blocks_jobs_list_spacing" DEFAULT 'normal',
  	"theme" "enum__segments_v_blocks_jobs_list_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_jobs_list_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"empty_text" varchar,
  	"talent_bank_eyebrow" varchar,
  	"talent_bank_title" varchar,
  	"talent_bank_highlight" varchar,
  	"talent_bank_description" varchar,
  	"talent_bank_note" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_cta_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"cta_href" varchar,
  	"secondary_cta_href" varchar,
  	"variant" "enum__segments_v_blocks_cta_banner_variant" DEFAULT 'primary',
  	"anchor" varchar,
  	"borda" "enum__segments_v_blocks_cta_banner_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__segments_v_blocks_cta_banner_spacing" DEFAULT 'normal',
  	"theme" "enum__segments_v_blocks_cta_banner_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_cta_banner_locales" (
  	"title" varchar,
  	"highlight" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"secondary_cta_label" varchar,
  	"secondary_cta_caption" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_partner_hero_awards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"highlight" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_partner_hero_awards_locales" (
  	"top_text" varchar,
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_partner_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"cta_href" varchar,
  	"anchor" varchar,
  	"borda" "enum__segments_v_blocks_partner_hero_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__segments_v_blocks_partner_hero_spacing" DEFAULT 'normal',
  	"theme" "enum__segments_v_blocks_partner_hero_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_partner_hero_locales" (
  	"badge" varchar,
  	"chip" varchar,
  	"title" varchar,
  	"highlight" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_partner_split_body" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_partner_split_body_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_partner_split_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_partner_split_items_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_partner_split" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"right_column" "enum__segments_v_blocks_partner_split_right_column" DEFAULT 'image',
  	"image_id" integer,
  	"logo_id" integer,
  	"cta_href" varchar,
  	"link_cta_href" varchar,
  	"anchor" varchar,
  	"borda" "enum__segments_v_blocks_partner_split_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__segments_v_blocks_partner_split_spacing" DEFAULT 'normal',
  	"theme" "enum__segments_v_blocks_partner_split_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_partner_split_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"image_label" varchar,
  	"cta_label" varchar,
  	"link_cta_label" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_home_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum__segments_v_blocks_home_hero_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__segments_v_blocks_home_hero_spacing" DEFAULT 'normal',
  	"theme" "enum__segments_v_blocks_home_hero_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_home_hero_locales" (
  	"title_prefix" varchar,
  	"description" varchar,
  	"scroll_label" varchar,
  	"prompt_title" varchar,
  	"prompt_placeholder" varchar,
  	"prompt_disclaimer" varchar,
  	"prompt_clients_title" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_logo_marquee_partners" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_logo_marquee" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum__segments_v_blocks_logo_marquee_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__segments_v_blocks_logo_marquee_spacing" DEFAULT 'normal',
  	"theme" "enum__segments_v_blocks_logo_marquee_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_logo_marquee_locales" (
  	"title" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_feature_tabs_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__segments_v_blocks_feature_tabs_items_icon" DEFAULT 'sparkles',
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_feature_tabs_items_locales" (
  	"badge" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_feature_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"cta_href" varchar,
  	"anchor" varchar,
  	"borda" "enum__segments_v_blocks_feature_tabs_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__segments_v_blocks_feature_tabs_spacing" DEFAULT 'normal',
  	"theme" "enum__segments_v_blocks_feature_tabs_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_feature_tabs_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"footnote" varchar,
  	"cta_label" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_home_bento_partner_card_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_home_bento_partner_card_items_locales" (
  	"subtitle" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_home_bento_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__segments_v_blocks_home_bento_metrics_icon" DEFAULT 'sparkles',
  	"value" varchar,
  	"color" "enum__segments_v_blocks_home_bento_metrics_color" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_home_bento_metrics_locales" (
  	"tag" varchar,
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_home_bento" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"seals_card_counter" varchar,
  	"anchor" varchar,
  	"borda" "enum__segments_v_blocks_home_bento_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__segments_v_blocks_home_bento_spacing" DEFAULT 'normal',
  	"theme" "enum__segments_v_blocks_home_bento_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_home_bento_locales" (
  	"partner_card_eyebrow" varchar,
  	"partner_card_title" varchar,
  	"partner_card_description" varchar,
  	"seals_card_eyebrow" varchar,
  	"seals_card_title" varchar,
  	"seals_card_description" varchar,
  	"seals_card_badge" varchar,
  	"seals_card_footnote" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_case_carousel_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__segments_v_blocks_case_carousel_items_icon" DEFAULT 'sparkles',
  	"href" varchar,
  	"image_id" integer,
  	"color" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_case_carousel_items_locales" (
  	"company" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_case_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"cta_href" varchar,
  	"anchor" varchar,
  	"borda" "enum__segments_v_blocks_case_carousel_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__segments_v_blocks_case_carousel_spacing" DEFAULT 'normal',
  	"theme" "enum__segments_v_blocks_case_carousel_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_case_carousel_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"read_label" varchar,
  	"cta_label" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_testimonial_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum__segments_v_blocks_testimonial_carousel_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__segments_v_blocks_testimonial_carousel_spacing" DEFAULT 'normal',
  	"theme" "enum__segments_v_blocks_testimonial_carousel_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_testimonial_carousel_locales" (
  	"title" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_content_teaser_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__segments_v_blocks_content_teaser_cards_icon" DEFAULT 'sparkles',
  	"href" varchar,
  	"image_id" integer,
  	"column" "enum__segments_v_blocks_content_teaser_cards_column" DEFAULT 'first',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_content_teaser_cards_locales" (
  	"category" varchar,
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_content_teaser" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"featured_href" varchar,
  	"featured_image_id" integer,
  	"anchor" varchar,
  	"borda" "enum__segments_v_blocks_content_teaser_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__segments_v_blocks_content_teaser_spacing" DEFAULT 'normal',
  	"theme" "enum__segments_v_blocks_content_teaser_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_content_teaser_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"featured_category" varchar,
  	"featured_title" varchar,
  	"featured_cta_label" varchar,
  	"newsletter_title" varchar,
  	"newsletter_placeholder" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_insights_hub_formats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"icon" "enum__segments_v_blocks_insights_hub_formats_icon" DEFAULT 'sparkles',
  	"count" numeric,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_insights_hub_formats_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_insights_hub_items_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_insights_hub_items_tags_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_insights_hub_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"format" varchar,
  	"href" varchar,
  	"image_id" integer,
  	"featured" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_insights_hub_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"category" varchar,
  	"meta" varchar,
  	"date" varchar,
  	"author" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_insights_hub" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"closing_cta_href" varchar,
  	"closing_secondary_href" varchar,
  	"anchor" varchar,
  	"borda" "enum__segments_v_blocks_insights_hub_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__segments_v_blocks_insights_hub_spacing" DEFAULT 'normal',
  	"theme" "enum__segments_v_blocks_insights_hub_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_insights_hub_locales" (
  	"badge" varchar,
  	"chip" varchar,
  	"title" varchar,
  	"highlight" varchar,
  	"description" varchar,
  	"portals_title" varchar,
  	"portals_description" varchar,
  	"newsletter_eyebrow" varchar,
  	"newsletter_title" varchar,
  	"newsletter_description" varchar,
  	"closing_title" varchar,
  	"closing_description" varchar,
  	"closing_cta_label" varchar,
  	"closing_secondary_label" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_segments_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_icon" "enum__segments_v_version_icon" DEFAULT 'sparkles',
  	"version_order" numeric DEFAULT 0,
  	"version_seo_og_image_id" integer,
  	"version_seo_no_index" boolean,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__segments_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__segments_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_segments_v_locales" (
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_short_description" varchar,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_segments_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar,
  	"locale" "_locales"
  );
  
  CREATE TABLE "_segments_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"partners_id" integer,
  	"solutions_id" integer,
  	"cases_id" integer,
  	"clients_id" integer
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "segments_id" integer;
  ALTER TABLE "segments_blocks_page_hero_ctas" ADD CONSTRAINT "segments_blocks_page_hero_ctas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_page_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_page_hero_ctas_locales" ADD CONSTRAINT "segments_blocks_page_hero_ctas_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_page_hero_ctas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_page_hero_metrics" ADD CONSTRAINT "segments_blocks_page_hero_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_page_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_page_hero_metrics_locales" ADD CONSTRAINT "segments_blocks_page_hero_metrics_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_page_hero_metrics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_page_hero" ADD CONSTRAINT "segments_blocks_page_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_page_hero_locales" ADD CONSTRAINT "segments_blocks_page_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_page_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_sticky_page_nav" ADD CONSTRAINT "segments_blocks_sticky_page_nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_sticky_page_nav_locales" ADD CONSTRAINT "segments_blocks_sticky_page_nav_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_sticky_page_nav"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_stats_grid_custom_items" ADD CONSTRAINT "segments_blocks_stats_grid_custom_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_stats_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_stats_grid_custom_items_locales" ADD CONSTRAINT "segments_blocks_stats_grid_custom_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_stats_grid_custom_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_stats_grid" ADD CONSTRAINT "segments_blocks_stats_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_stats_grid_locales" ADD CONSTRAINT "segments_blocks_stats_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_stats_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_rich_text_section_ctas" ADD CONSTRAINT "segments_blocks_rich_text_section_ctas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_rich_text_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_rich_text_section_ctas_locales" ADD CONSTRAINT "segments_blocks_rich_text_section_ctas_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_rich_text_section_ctas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_rich_text_section" ADD CONSTRAINT "segments_blocks_rich_text_section_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "segments_blocks_rich_text_section" ADD CONSTRAINT "segments_blocks_rich_text_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_rich_text_section_locales" ADD CONSTRAINT "segments_blocks_rich_text_section_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_rich_text_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_icon_card_grid_items" ADD CONSTRAINT "segments_blocks_icon_card_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_icon_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_icon_card_grid_items_locales" ADD CONSTRAINT "segments_blocks_icon_card_grid_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_icon_card_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_icon_card_grid" ADD CONSTRAINT "segments_blocks_icon_card_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_icon_card_grid_locales" ADD CONSTRAINT "segments_blocks_icon_card_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_icon_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_value_cards_items_bullets" ADD CONSTRAINT "segments_blocks_value_cards_items_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_value_cards_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_value_cards_items_bullets_locales" ADD CONSTRAINT "segments_blocks_value_cards_items_bullets_locales_parent__fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_value_cards_items_bullets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_value_cards_items" ADD CONSTRAINT "segments_blocks_value_cards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_value_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_value_cards_items_locales" ADD CONSTRAINT "segments_blocks_value_cards_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_value_cards_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_value_cards" ADD CONSTRAINT "segments_blocks_value_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_value_cards_locales" ADD CONSTRAINT "segments_blocks_value_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_value_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_partner_showcase" ADD CONSTRAINT "segments_blocks_partner_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_partner_showcase_locales" ADD CONSTRAINT "segments_blocks_partner_showcase_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_partner_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_seals_banner" ADD CONSTRAINT "segments_blocks_seals_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_seals_banner_locales" ADD CONSTRAINT "segments_blocks_seals_banner_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_seals_banner"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_process_steps_steps" ADD CONSTRAINT "segments_blocks_process_steps_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_process_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_process_steps_steps_locales" ADD CONSTRAINT "segments_blocks_process_steps_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_process_steps_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_process_steps" ADD CONSTRAINT "segments_blocks_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_process_steps_locales" ADD CONSTRAINT "segments_blocks_process_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_process_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_method_cards_items_bullets" ADD CONSTRAINT "segments_blocks_method_cards_items_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_method_cards_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_method_cards_items_bullets_locales" ADD CONSTRAINT "segments_blocks_method_cards_items_bullets_locales_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_method_cards_items_bullets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_method_cards_items" ADD CONSTRAINT "segments_blocks_method_cards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_method_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_method_cards_items_locales" ADD CONSTRAINT "segments_blocks_method_cards_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_method_cards_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_method_cards" ADD CONSTRAINT "segments_blocks_method_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_method_cards_locales" ADD CONSTRAINT "segments_blocks_method_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_method_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_bento_grid_items_metrics" ADD CONSTRAINT "segments_blocks_bento_grid_items_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_bento_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_bento_grid_items_metrics_locales" ADD CONSTRAINT "segments_blocks_bento_grid_items_metrics_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_bento_grid_items_metrics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_bento_grid_items_tags" ADD CONSTRAINT "segments_blocks_bento_grid_items_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_bento_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_bento_grid_items_tags_locales" ADD CONSTRAINT "segments_blocks_bento_grid_items_tags_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_bento_grid_items_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_bento_grid_items_bullets" ADD CONSTRAINT "segments_blocks_bento_grid_items_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_bento_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_bento_grid_items_bullets_locales" ADD CONSTRAINT "segments_blocks_bento_grid_items_bullets_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_bento_grid_items_bullets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_bento_grid_items" ADD CONSTRAINT "segments_blocks_bento_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_bento_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_bento_grid_items_locales" ADD CONSTRAINT "segments_blocks_bento_grid_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_bento_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_bento_grid" ADD CONSTRAINT "segments_blocks_bento_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_bento_grid_locales" ADD CONSTRAINT "segments_blocks_bento_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_bento_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_audience_split_items" ADD CONSTRAINT "segments_blocks_audience_split_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_audience_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_audience_split_items_locales" ADD CONSTRAINT "segments_blocks_audience_split_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_audience_split_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_audience_split" ADD CONSTRAINT "segments_blocks_audience_split_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_audience_split_locales" ADD CONSTRAINT "segments_blocks_audience_split_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_audience_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_accordion_steps_steps" ADD CONSTRAINT "segments_blocks_accordion_steps_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_accordion_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_accordion_steps_steps_locales" ADD CONSTRAINT "segments_blocks_accordion_steps_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_accordion_steps_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_accordion_steps" ADD CONSTRAINT "segments_blocks_accordion_steps_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "segments_blocks_accordion_steps" ADD CONSTRAINT "segments_blocks_accordion_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_accordion_steps_locales" ADD CONSTRAINT "segments_blocks_accordion_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_accordion_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_cta_contact" ADD CONSTRAINT "segments_blocks_cta_contact_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "segments_blocks_cta_contact" ADD CONSTRAINT "segments_blocks_cta_contact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_cta_contact_locales" ADD CONSTRAINT "segments_blocks_cta_contact_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_cta_contact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_jobs_list" ADD CONSTRAINT "segments_blocks_jobs_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_jobs_list_locales" ADD CONSTRAINT "segments_blocks_jobs_list_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_jobs_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_cta_banner" ADD CONSTRAINT "segments_blocks_cta_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_cta_banner_locales" ADD CONSTRAINT "segments_blocks_cta_banner_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_cta_banner"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_partner_hero_awards" ADD CONSTRAINT "segments_blocks_partner_hero_awards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_partner_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_partner_hero_awards_locales" ADD CONSTRAINT "segments_blocks_partner_hero_awards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_partner_hero_awards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_partner_hero" ADD CONSTRAINT "segments_blocks_partner_hero_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "segments_blocks_partner_hero" ADD CONSTRAINT "segments_blocks_partner_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_partner_hero_locales" ADD CONSTRAINT "segments_blocks_partner_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_partner_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_partner_split_body" ADD CONSTRAINT "segments_blocks_partner_split_body_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_partner_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_partner_split_body_locales" ADD CONSTRAINT "segments_blocks_partner_split_body_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_partner_split_body"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_partner_split_items" ADD CONSTRAINT "segments_blocks_partner_split_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_partner_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_partner_split_items_locales" ADD CONSTRAINT "segments_blocks_partner_split_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_partner_split_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_partner_split" ADD CONSTRAINT "segments_blocks_partner_split_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "segments_blocks_partner_split" ADD CONSTRAINT "segments_blocks_partner_split_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "segments_blocks_partner_split" ADD CONSTRAINT "segments_blocks_partner_split_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_partner_split_locales" ADD CONSTRAINT "segments_blocks_partner_split_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_partner_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_home_hero" ADD CONSTRAINT "segments_blocks_home_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_home_hero_locales" ADD CONSTRAINT "segments_blocks_home_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_home_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_logo_marquee_partners" ADD CONSTRAINT "segments_blocks_logo_marquee_partners_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "segments_blocks_logo_marquee_partners" ADD CONSTRAINT "segments_blocks_logo_marquee_partners_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_logo_marquee"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_logo_marquee" ADD CONSTRAINT "segments_blocks_logo_marquee_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_logo_marquee_locales" ADD CONSTRAINT "segments_blocks_logo_marquee_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_logo_marquee"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_feature_tabs_items" ADD CONSTRAINT "segments_blocks_feature_tabs_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "segments_blocks_feature_tabs_items" ADD CONSTRAINT "segments_blocks_feature_tabs_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_feature_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_feature_tabs_items_locales" ADD CONSTRAINT "segments_blocks_feature_tabs_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_feature_tabs_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_feature_tabs" ADD CONSTRAINT "segments_blocks_feature_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_feature_tabs_locales" ADD CONSTRAINT "segments_blocks_feature_tabs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_feature_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_home_bento_partner_card_items" ADD CONSTRAINT "segments_blocks_home_bento_partner_card_items_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "segments_blocks_home_bento_partner_card_items" ADD CONSTRAINT "segments_blocks_home_bento_partner_card_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_home_bento"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_home_bento_partner_card_items_locales" ADD CONSTRAINT "segments_blocks_home_bento_partner_card_items_locales_par_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_home_bento_partner_card_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_home_bento_metrics" ADD CONSTRAINT "segments_blocks_home_bento_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_home_bento"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_home_bento_metrics_locales" ADD CONSTRAINT "segments_blocks_home_bento_metrics_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_home_bento_metrics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_home_bento" ADD CONSTRAINT "segments_blocks_home_bento_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_home_bento_locales" ADD CONSTRAINT "segments_blocks_home_bento_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_home_bento"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_case_carousel_items" ADD CONSTRAINT "segments_blocks_case_carousel_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "segments_blocks_case_carousel_items" ADD CONSTRAINT "segments_blocks_case_carousel_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_case_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_case_carousel_items_locales" ADD CONSTRAINT "segments_blocks_case_carousel_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_case_carousel_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_case_carousel" ADD CONSTRAINT "segments_blocks_case_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_case_carousel_locales" ADD CONSTRAINT "segments_blocks_case_carousel_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_case_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_testimonial_carousel" ADD CONSTRAINT "segments_blocks_testimonial_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_testimonial_carousel_locales" ADD CONSTRAINT "segments_blocks_testimonial_carousel_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_testimonial_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_content_teaser_cards" ADD CONSTRAINT "segments_blocks_content_teaser_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "segments_blocks_content_teaser_cards" ADD CONSTRAINT "segments_blocks_content_teaser_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_content_teaser"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_content_teaser_cards_locales" ADD CONSTRAINT "segments_blocks_content_teaser_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_content_teaser_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_content_teaser" ADD CONSTRAINT "segments_blocks_content_teaser_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "segments_blocks_content_teaser" ADD CONSTRAINT "segments_blocks_content_teaser_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_content_teaser_locales" ADD CONSTRAINT "segments_blocks_content_teaser_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_content_teaser"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_insights_hub_formats" ADD CONSTRAINT "segments_blocks_insights_hub_formats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_insights_hub"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_insights_hub_formats_locales" ADD CONSTRAINT "segments_blocks_insights_hub_formats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_insights_hub_formats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_insights_hub_items_tags" ADD CONSTRAINT "segments_blocks_insights_hub_items_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_insights_hub_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_insights_hub_items_tags_locales" ADD CONSTRAINT "segments_blocks_insights_hub_items_tags_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_insights_hub_items_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_insights_hub_items" ADD CONSTRAINT "segments_blocks_insights_hub_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "segments_blocks_insights_hub_items" ADD CONSTRAINT "segments_blocks_insights_hub_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_insights_hub"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_insights_hub_items_locales" ADD CONSTRAINT "segments_blocks_insights_hub_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_insights_hub_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_insights_hub" ADD CONSTRAINT "segments_blocks_insights_hub_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_insights_hub_locales" ADD CONSTRAINT "segments_blocks_insights_hub_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_insights_hub"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments" ADD CONSTRAINT "segments_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "segments_locales" ADD CONSTRAINT "segments_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_texts" ADD CONSTRAINT "segments_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."segments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_rels" ADD CONSTRAINT "segments_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."segments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_rels" ADD CONSTRAINT "segments_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_rels" ADD CONSTRAINT "segments_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_rels" ADD CONSTRAINT "segments_rels_solutions_fk" FOREIGN KEY ("solutions_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_rels" ADD CONSTRAINT "segments_rels_cases_fk" FOREIGN KEY ("cases_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_rels" ADD CONSTRAINT "segments_rels_clients_fk" FOREIGN KEY ("clients_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_page_hero_ctas" ADD CONSTRAINT "_segments_v_blocks_page_hero_ctas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_page_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_page_hero_ctas_locales" ADD CONSTRAINT "_segments_v_blocks_page_hero_ctas_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_page_hero_ctas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_page_hero_metrics" ADD CONSTRAINT "_segments_v_blocks_page_hero_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_page_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_page_hero_metrics_locales" ADD CONSTRAINT "_segments_v_blocks_page_hero_metrics_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_page_hero_metrics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_page_hero" ADD CONSTRAINT "_segments_v_blocks_page_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_page_hero_locales" ADD CONSTRAINT "_segments_v_blocks_page_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_page_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_sticky_page_nav" ADD CONSTRAINT "_segments_v_blocks_sticky_page_nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_sticky_page_nav_locales" ADD CONSTRAINT "_segments_v_blocks_sticky_page_nav_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_sticky_page_nav"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_stats_grid_custom_items" ADD CONSTRAINT "_segments_v_blocks_stats_grid_custom_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_stats_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_stats_grid_custom_items_locales" ADD CONSTRAINT "_segments_v_blocks_stats_grid_custom_items_locales_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_stats_grid_custom_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_stats_grid" ADD CONSTRAINT "_segments_v_blocks_stats_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_stats_grid_locales" ADD CONSTRAINT "_segments_v_blocks_stats_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_stats_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_rich_text_section_ctas" ADD CONSTRAINT "_segments_v_blocks_rich_text_section_ctas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_rich_text_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_rich_text_section_ctas_locales" ADD CONSTRAINT "_segments_v_blocks_rich_text_section_ctas_locales_parent__fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_rich_text_section_ctas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_rich_text_section" ADD CONSTRAINT "_segments_v_blocks_rich_text_section_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_rich_text_section" ADD CONSTRAINT "_segments_v_blocks_rich_text_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_rich_text_section_locales" ADD CONSTRAINT "_segments_v_blocks_rich_text_section_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_rich_text_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_icon_card_grid_items" ADD CONSTRAINT "_segments_v_blocks_icon_card_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_icon_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_icon_card_grid_items_locales" ADD CONSTRAINT "_segments_v_blocks_icon_card_grid_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_icon_card_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_icon_card_grid" ADD CONSTRAINT "_segments_v_blocks_icon_card_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_icon_card_grid_locales" ADD CONSTRAINT "_segments_v_blocks_icon_card_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_icon_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_value_cards_items_bullets" ADD CONSTRAINT "_segments_v_blocks_value_cards_items_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_value_cards_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_value_cards_items_bullets_locales" ADD CONSTRAINT "_segments_v_blocks_value_cards_items_bullets_locales_pare_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_value_cards_items_bullets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_value_cards_items" ADD CONSTRAINT "_segments_v_blocks_value_cards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_value_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_value_cards_items_locales" ADD CONSTRAINT "_segments_v_blocks_value_cards_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_value_cards_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_value_cards" ADD CONSTRAINT "_segments_v_blocks_value_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_value_cards_locales" ADD CONSTRAINT "_segments_v_blocks_value_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_value_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_partner_showcase" ADD CONSTRAINT "_segments_v_blocks_partner_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_partner_showcase_locales" ADD CONSTRAINT "_segments_v_blocks_partner_showcase_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_partner_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_seals_banner" ADD CONSTRAINT "_segments_v_blocks_seals_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_seals_banner_locales" ADD CONSTRAINT "_segments_v_blocks_seals_banner_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_seals_banner"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_process_steps_steps" ADD CONSTRAINT "_segments_v_blocks_process_steps_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_process_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_process_steps_steps_locales" ADD CONSTRAINT "_segments_v_blocks_process_steps_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_process_steps_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_process_steps" ADD CONSTRAINT "_segments_v_blocks_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_process_steps_locales" ADD CONSTRAINT "_segments_v_blocks_process_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_process_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_method_cards_items_bullets" ADD CONSTRAINT "_segments_v_blocks_method_cards_items_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_method_cards_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_method_cards_items_bullets_locales" ADD CONSTRAINT "_segments_v_blocks_method_cards_items_bullets_locales_par_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_method_cards_items_bullets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_method_cards_items" ADD CONSTRAINT "_segments_v_blocks_method_cards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_method_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_method_cards_items_locales" ADD CONSTRAINT "_segments_v_blocks_method_cards_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_method_cards_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_method_cards" ADD CONSTRAINT "_segments_v_blocks_method_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_method_cards_locales" ADD CONSTRAINT "_segments_v_blocks_method_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_method_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_bento_grid_items_metrics" ADD CONSTRAINT "_segments_v_blocks_bento_grid_items_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_bento_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_bento_grid_items_metrics_locales" ADD CONSTRAINT "_segments_v_blocks_bento_grid_items_metrics_locales_paren_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_bento_grid_items_metrics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_bento_grid_items_tags" ADD CONSTRAINT "_segments_v_blocks_bento_grid_items_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_bento_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_bento_grid_items_tags_locales" ADD CONSTRAINT "_segments_v_blocks_bento_grid_items_tags_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_bento_grid_items_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_bento_grid_items_bullets" ADD CONSTRAINT "_segments_v_blocks_bento_grid_items_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_bento_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_bento_grid_items_bullets_locales" ADD CONSTRAINT "_segments_v_blocks_bento_grid_items_bullets_locales_paren_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_bento_grid_items_bullets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_bento_grid_items" ADD CONSTRAINT "_segments_v_blocks_bento_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_bento_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_bento_grid_items_locales" ADD CONSTRAINT "_segments_v_blocks_bento_grid_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_bento_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_bento_grid" ADD CONSTRAINT "_segments_v_blocks_bento_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_bento_grid_locales" ADD CONSTRAINT "_segments_v_blocks_bento_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_bento_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_audience_split_items" ADD CONSTRAINT "_segments_v_blocks_audience_split_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_audience_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_audience_split_items_locales" ADD CONSTRAINT "_segments_v_blocks_audience_split_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_audience_split_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_audience_split" ADD CONSTRAINT "_segments_v_blocks_audience_split_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_audience_split_locales" ADD CONSTRAINT "_segments_v_blocks_audience_split_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_audience_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_accordion_steps_steps" ADD CONSTRAINT "_segments_v_blocks_accordion_steps_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_accordion_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_accordion_steps_steps_locales" ADD CONSTRAINT "_segments_v_blocks_accordion_steps_steps_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_accordion_steps_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_accordion_steps" ADD CONSTRAINT "_segments_v_blocks_accordion_steps_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_accordion_steps" ADD CONSTRAINT "_segments_v_blocks_accordion_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_accordion_steps_locales" ADD CONSTRAINT "_segments_v_blocks_accordion_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_accordion_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_cta_contact" ADD CONSTRAINT "_segments_v_blocks_cta_contact_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_cta_contact" ADD CONSTRAINT "_segments_v_blocks_cta_contact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_cta_contact_locales" ADD CONSTRAINT "_segments_v_blocks_cta_contact_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_cta_contact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_jobs_list" ADD CONSTRAINT "_segments_v_blocks_jobs_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_jobs_list_locales" ADD CONSTRAINT "_segments_v_blocks_jobs_list_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_jobs_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_cta_banner" ADD CONSTRAINT "_segments_v_blocks_cta_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_cta_banner_locales" ADD CONSTRAINT "_segments_v_blocks_cta_banner_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_cta_banner"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_partner_hero_awards" ADD CONSTRAINT "_segments_v_blocks_partner_hero_awards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_partner_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_partner_hero_awards_locales" ADD CONSTRAINT "_segments_v_blocks_partner_hero_awards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_partner_hero_awards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_partner_hero" ADD CONSTRAINT "_segments_v_blocks_partner_hero_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_partner_hero" ADD CONSTRAINT "_segments_v_blocks_partner_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_partner_hero_locales" ADD CONSTRAINT "_segments_v_blocks_partner_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_partner_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_partner_split_body" ADD CONSTRAINT "_segments_v_blocks_partner_split_body_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_partner_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_partner_split_body_locales" ADD CONSTRAINT "_segments_v_blocks_partner_split_body_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_partner_split_body"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_partner_split_items" ADD CONSTRAINT "_segments_v_blocks_partner_split_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_partner_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_partner_split_items_locales" ADD CONSTRAINT "_segments_v_blocks_partner_split_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_partner_split_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_partner_split" ADD CONSTRAINT "_segments_v_blocks_partner_split_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_partner_split" ADD CONSTRAINT "_segments_v_blocks_partner_split_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_partner_split" ADD CONSTRAINT "_segments_v_blocks_partner_split_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_partner_split_locales" ADD CONSTRAINT "_segments_v_blocks_partner_split_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_partner_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_home_hero" ADD CONSTRAINT "_segments_v_blocks_home_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_home_hero_locales" ADD CONSTRAINT "_segments_v_blocks_home_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_home_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_logo_marquee_partners" ADD CONSTRAINT "_segments_v_blocks_logo_marquee_partners_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_logo_marquee_partners" ADD CONSTRAINT "_segments_v_blocks_logo_marquee_partners_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_logo_marquee"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_logo_marquee" ADD CONSTRAINT "_segments_v_blocks_logo_marquee_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_logo_marquee_locales" ADD CONSTRAINT "_segments_v_blocks_logo_marquee_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_logo_marquee"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_feature_tabs_items" ADD CONSTRAINT "_segments_v_blocks_feature_tabs_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_feature_tabs_items" ADD CONSTRAINT "_segments_v_blocks_feature_tabs_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_feature_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_feature_tabs_items_locales" ADD CONSTRAINT "_segments_v_blocks_feature_tabs_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_feature_tabs_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_feature_tabs" ADD CONSTRAINT "_segments_v_blocks_feature_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_feature_tabs_locales" ADD CONSTRAINT "_segments_v_blocks_feature_tabs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_feature_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_home_bento_partner_card_items" ADD CONSTRAINT "_segments_v_blocks_home_bento_partner_card_items_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_home_bento_partner_card_items" ADD CONSTRAINT "_segments_v_blocks_home_bento_partner_card_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_home_bento"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_home_bento_partner_card_items_locales" ADD CONSTRAINT "_segments_v_blocks_home_bento_partner_card_items_locales__fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_home_bento_partner_card_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_home_bento_metrics" ADD CONSTRAINT "_segments_v_blocks_home_bento_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_home_bento"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_home_bento_metrics_locales" ADD CONSTRAINT "_segments_v_blocks_home_bento_metrics_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_home_bento_metrics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_home_bento" ADD CONSTRAINT "_segments_v_blocks_home_bento_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_home_bento_locales" ADD CONSTRAINT "_segments_v_blocks_home_bento_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_home_bento"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_case_carousel_items" ADD CONSTRAINT "_segments_v_blocks_case_carousel_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_case_carousel_items" ADD CONSTRAINT "_segments_v_blocks_case_carousel_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_case_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_case_carousel_items_locales" ADD CONSTRAINT "_segments_v_blocks_case_carousel_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_case_carousel_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_case_carousel" ADD CONSTRAINT "_segments_v_blocks_case_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_case_carousel_locales" ADD CONSTRAINT "_segments_v_blocks_case_carousel_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_case_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_testimonial_carousel" ADD CONSTRAINT "_segments_v_blocks_testimonial_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_testimonial_carousel_locales" ADD CONSTRAINT "_segments_v_blocks_testimonial_carousel_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_testimonial_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_content_teaser_cards" ADD CONSTRAINT "_segments_v_blocks_content_teaser_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_content_teaser_cards" ADD CONSTRAINT "_segments_v_blocks_content_teaser_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_content_teaser"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_content_teaser_cards_locales" ADD CONSTRAINT "_segments_v_blocks_content_teaser_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_content_teaser_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_content_teaser" ADD CONSTRAINT "_segments_v_blocks_content_teaser_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_content_teaser" ADD CONSTRAINT "_segments_v_blocks_content_teaser_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_content_teaser_locales" ADD CONSTRAINT "_segments_v_blocks_content_teaser_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_content_teaser"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_insights_hub_formats" ADD CONSTRAINT "_segments_v_blocks_insights_hub_formats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_insights_hub"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_insights_hub_formats_locales" ADD CONSTRAINT "_segments_v_blocks_insights_hub_formats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_insights_hub_formats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_insights_hub_items_tags" ADD CONSTRAINT "_segments_v_blocks_insights_hub_items_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_insights_hub_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_insights_hub_items_tags_locales" ADD CONSTRAINT "_segments_v_blocks_insights_hub_items_tags_locales_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_insights_hub_items_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_insights_hub_items" ADD CONSTRAINT "_segments_v_blocks_insights_hub_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_insights_hub_items" ADD CONSTRAINT "_segments_v_blocks_insights_hub_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_insights_hub"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_insights_hub_items_locales" ADD CONSTRAINT "_segments_v_blocks_insights_hub_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_insights_hub_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_insights_hub" ADD CONSTRAINT "_segments_v_blocks_insights_hub_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_insights_hub_locales" ADD CONSTRAINT "_segments_v_blocks_insights_hub_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_insights_hub"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v" ADD CONSTRAINT "_segments_v_parent_id_segments_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."segments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_segments_v" ADD CONSTRAINT "_segments_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_segments_v_locales" ADD CONSTRAINT "_segments_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_texts" ADD CONSTRAINT "_segments_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_segments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_rels" ADD CONSTRAINT "_segments_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_segments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_rels" ADD CONSTRAINT "_segments_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_rels" ADD CONSTRAINT "_segments_v_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_rels" ADD CONSTRAINT "_segments_v_rels_solutions_fk" FOREIGN KEY ("solutions_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_rels" ADD CONSTRAINT "_segments_v_rels_cases_fk" FOREIGN KEY ("cases_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_rels" ADD CONSTRAINT "_segments_v_rels_clients_fk" FOREIGN KEY ("clients_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "segments_blocks_page_hero_ctas_order_idx" ON "segments_blocks_page_hero_ctas" USING btree ("_order");
  CREATE INDEX "segments_blocks_page_hero_ctas_parent_id_idx" ON "segments_blocks_page_hero_ctas" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "segments_blocks_page_hero_ctas_locales_locale_parent_id_uniq" ON "segments_blocks_page_hero_ctas_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_page_hero_metrics_order_idx" ON "segments_blocks_page_hero_metrics" USING btree ("_order");
  CREATE INDEX "segments_blocks_page_hero_metrics_parent_id_idx" ON "segments_blocks_page_hero_metrics" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "segments_blocks_page_hero_metrics_locales_locale_parent_id_u" ON "segments_blocks_page_hero_metrics_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_page_hero_order_idx" ON "segments_blocks_page_hero" USING btree ("_order");
  CREATE INDEX "segments_blocks_page_hero_parent_id_idx" ON "segments_blocks_page_hero" USING btree ("_parent_id");
  CREATE INDEX "segments_blocks_page_hero_path_idx" ON "segments_blocks_page_hero" USING btree ("_path");
  CREATE UNIQUE INDEX "segments_blocks_page_hero_locales_locale_parent_id_unique" ON "segments_blocks_page_hero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_sticky_page_nav_order_idx" ON "segments_blocks_sticky_page_nav" USING btree ("_order");
  CREATE INDEX "segments_blocks_sticky_page_nav_parent_id_idx" ON "segments_blocks_sticky_page_nav" USING btree ("_parent_id");
  CREATE INDEX "segments_blocks_sticky_page_nav_path_idx" ON "segments_blocks_sticky_page_nav" USING btree ("_path");
  CREATE UNIQUE INDEX "segments_blocks_sticky_page_nav_locales_locale_parent_id_uni" ON "segments_blocks_sticky_page_nav_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_stats_grid_custom_items_order_idx" ON "segments_blocks_stats_grid_custom_items" USING btree ("_order");
  CREATE INDEX "segments_blocks_stats_grid_custom_items_parent_id_idx" ON "segments_blocks_stats_grid_custom_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "segments_blocks_stats_grid_custom_items_locales_locale_paren" ON "segments_blocks_stats_grid_custom_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_stats_grid_order_idx" ON "segments_blocks_stats_grid" USING btree ("_order");
  CREATE INDEX "segments_blocks_stats_grid_parent_id_idx" ON "segments_blocks_stats_grid" USING btree ("_parent_id");
  CREATE INDEX "segments_blocks_stats_grid_path_idx" ON "segments_blocks_stats_grid" USING btree ("_path");
  CREATE UNIQUE INDEX "segments_blocks_stats_grid_locales_locale_parent_id_unique" ON "segments_blocks_stats_grid_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_rich_text_section_ctas_order_idx" ON "segments_blocks_rich_text_section_ctas" USING btree ("_order");
  CREATE INDEX "segments_blocks_rich_text_section_ctas_parent_id_idx" ON "segments_blocks_rich_text_section_ctas" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "segments_blocks_rich_text_section_ctas_locales_locale_parent" ON "segments_blocks_rich_text_section_ctas_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_rich_text_section_order_idx" ON "segments_blocks_rich_text_section" USING btree ("_order");
  CREATE INDEX "segments_blocks_rich_text_section_parent_id_idx" ON "segments_blocks_rich_text_section" USING btree ("_parent_id");
  CREATE INDEX "segments_blocks_rich_text_section_path_idx" ON "segments_blocks_rich_text_section" USING btree ("_path");
  CREATE INDEX "segments_blocks_rich_text_section_image_idx" ON "segments_blocks_rich_text_section" USING btree ("image_id");
  CREATE UNIQUE INDEX "segments_blocks_rich_text_section_locales_locale_parent_id_u" ON "segments_blocks_rich_text_section_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_icon_card_grid_items_order_idx" ON "segments_blocks_icon_card_grid_items" USING btree ("_order");
  CREATE INDEX "segments_blocks_icon_card_grid_items_parent_id_idx" ON "segments_blocks_icon_card_grid_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "segments_blocks_icon_card_grid_items_locales_locale_parent_i" ON "segments_blocks_icon_card_grid_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_icon_card_grid_order_idx" ON "segments_blocks_icon_card_grid" USING btree ("_order");
  CREATE INDEX "segments_blocks_icon_card_grid_parent_id_idx" ON "segments_blocks_icon_card_grid" USING btree ("_parent_id");
  CREATE INDEX "segments_blocks_icon_card_grid_path_idx" ON "segments_blocks_icon_card_grid" USING btree ("_path");
  CREATE UNIQUE INDEX "segments_blocks_icon_card_grid_locales_locale_parent_id_uniq" ON "segments_blocks_icon_card_grid_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_value_cards_items_bullets_order_idx" ON "segments_blocks_value_cards_items_bullets" USING btree ("_order");
  CREATE INDEX "segments_blocks_value_cards_items_bullets_parent_id_idx" ON "segments_blocks_value_cards_items_bullets" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "segments_blocks_value_cards_items_bullets_locales_locale_par" ON "segments_blocks_value_cards_items_bullets_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_value_cards_items_order_idx" ON "segments_blocks_value_cards_items" USING btree ("_order");
  CREATE INDEX "segments_blocks_value_cards_items_parent_id_idx" ON "segments_blocks_value_cards_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "segments_blocks_value_cards_items_locales_locale_parent_id_u" ON "segments_blocks_value_cards_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_value_cards_order_idx" ON "segments_blocks_value_cards" USING btree ("_order");
  CREATE INDEX "segments_blocks_value_cards_parent_id_idx" ON "segments_blocks_value_cards" USING btree ("_parent_id");
  CREATE INDEX "segments_blocks_value_cards_path_idx" ON "segments_blocks_value_cards" USING btree ("_path");
  CREATE UNIQUE INDEX "segments_blocks_value_cards_locales_locale_parent_id_unique" ON "segments_blocks_value_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_partner_showcase_order_idx" ON "segments_blocks_partner_showcase" USING btree ("_order");
  CREATE INDEX "segments_blocks_partner_showcase_parent_id_idx" ON "segments_blocks_partner_showcase" USING btree ("_parent_id");
  CREATE INDEX "segments_blocks_partner_showcase_path_idx" ON "segments_blocks_partner_showcase" USING btree ("_path");
  CREATE UNIQUE INDEX "segments_blocks_partner_showcase_locales_locale_parent_id_un" ON "segments_blocks_partner_showcase_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_seals_banner_order_idx" ON "segments_blocks_seals_banner" USING btree ("_order");
  CREATE INDEX "segments_blocks_seals_banner_parent_id_idx" ON "segments_blocks_seals_banner" USING btree ("_parent_id");
  CREATE INDEX "segments_blocks_seals_banner_path_idx" ON "segments_blocks_seals_banner" USING btree ("_path");
  CREATE UNIQUE INDEX "segments_blocks_seals_banner_locales_locale_parent_id_unique" ON "segments_blocks_seals_banner_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_process_steps_steps_order_idx" ON "segments_blocks_process_steps_steps" USING btree ("_order");
  CREATE INDEX "segments_blocks_process_steps_steps_parent_id_idx" ON "segments_blocks_process_steps_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "segments_blocks_process_steps_steps_locales_locale_parent_id" ON "segments_blocks_process_steps_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_process_steps_order_idx" ON "segments_blocks_process_steps" USING btree ("_order");
  CREATE INDEX "segments_blocks_process_steps_parent_id_idx" ON "segments_blocks_process_steps" USING btree ("_parent_id");
  CREATE INDEX "segments_blocks_process_steps_path_idx" ON "segments_blocks_process_steps" USING btree ("_path");
  CREATE UNIQUE INDEX "segments_blocks_process_steps_locales_locale_parent_id_uniqu" ON "segments_blocks_process_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_method_cards_items_bullets_order_idx" ON "segments_blocks_method_cards_items_bullets" USING btree ("_order");
  CREATE INDEX "segments_blocks_method_cards_items_bullets_parent_id_idx" ON "segments_blocks_method_cards_items_bullets" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "segments_blocks_method_cards_items_bullets_locales_locale_pa" ON "segments_blocks_method_cards_items_bullets_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_method_cards_items_order_idx" ON "segments_blocks_method_cards_items" USING btree ("_order");
  CREATE INDEX "segments_blocks_method_cards_items_parent_id_idx" ON "segments_blocks_method_cards_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "segments_blocks_method_cards_items_locales_locale_parent_id_" ON "segments_blocks_method_cards_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_method_cards_order_idx" ON "segments_blocks_method_cards" USING btree ("_order");
  CREATE INDEX "segments_blocks_method_cards_parent_id_idx" ON "segments_blocks_method_cards" USING btree ("_parent_id");
  CREATE INDEX "segments_blocks_method_cards_path_idx" ON "segments_blocks_method_cards" USING btree ("_path");
  CREATE UNIQUE INDEX "segments_blocks_method_cards_locales_locale_parent_id_unique" ON "segments_blocks_method_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_bento_grid_items_metrics_order_idx" ON "segments_blocks_bento_grid_items_metrics" USING btree ("_order");
  CREATE INDEX "segments_blocks_bento_grid_items_metrics_parent_id_idx" ON "segments_blocks_bento_grid_items_metrics" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "segments_blocks_bento_grid_items_metrics_locales_locale_pare" ON "segments_blocks_bento_grid_items_metrics_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_bento_grid_items_tags_order_idx" ON "segments_blocks_bento_grid_items_tags" USING btree ("_order");
  CREATE INDEX "segments_blocks_bento_grid_items_tags_parent_id_idx" ON "segments_blocks_bento_grid_items_tags" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "segments_blocks_bento_grid_items_tags_locales_locale_parent_" ON "segments_blocks_bento_grid_items_tags_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_bento_grid_items_bullets_order_idx" ON "segments_blocks_bento_grid_items_bullets" USING btree ("_order");
  CREATE INDEX "segments_blocks_bento_grid_items_bullets_parent_id_idx" ON "segments_blocks_bento_grid_items_bullets" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "segments_blocks_bento_grid_items_bullets_locales_locale_pare" ON "segments_blocks_bento_grid_items_bullets_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_bento_grid_items_order_idx" ON "segments_blocks_bento_grid_items" USING btree ("_order");
  CREATE INDEX "segments_blocks_bento_grid_items_parent_id_idx" ON "segments_blocks_bento_grid_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "segments_blocks_bento_grid_items_locales_locale_parent_id_un" ON "segments_blocks_bento_grid_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_bento_grid_order_idx" ON "segments_blocks_bento_grid" USING btree ("_order");
  CREATE INDEX "segments_blocks_bento_grid_parent_id_idx" ON "segments_blocks_bento_grid" USING btree ("_parent_id");
  CREATE INDEX "segments_blocks_bento_grid_path_idx" ON "segments_blocks_bento_grid" USING btree ("_path");
  CREATE UNIQUE INDEX "segments_blocks_bento_grid_locales_locale_parent_id_unique" ON "segments_blocks_bento_grid_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_audience_split_items_order_idx" ON "segments_blocks_audience_split_items" USING btree ("_order");
  CREATE INDEX "segments_blocks_audience_split_items_parent_id_idx" ON "segments_blocks_audience_split_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "segments_blocks_audience_split_items_locales_locale_parent_i" ON "segments_blocks_audience_split_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_audience_split_order_idx" ON "segments_blocks_audience_split" USING btree ("_order");
  CREATE INDEX "segments_blocks_audience_split_parent_id_idx" ON "segments_blocks_audience_split" USING btree ("_parent_id");
  CREATE INDEX "segments_blocks_audience_split_path_idx" ON "segments_blocks_audience_split" USING btree ("_path");
  CREATE UNIQUE INDEX "segments_blocks_audience_split_locales_locale_parent_id_uniq" ON "segments_blocks_audience_split_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_accordion_steps_steps_order_idx" ON "segments_blocks_accordion_steps_steps" USING btree ("_order");
  CREATE INDEX "segments_blocks_accordion_steps_steps_parent_id_idx" ON "segments_blocks_accordion_steps_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "segments_blocks_accordion_steps_steps_locales_locale_parent_" ON "segments_blocks_accordion_steps_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_accordion_steps_order_idx" ON "segments_blocks_accordion_steps" USING btree ("_order");
  CREATE INDEX "segments_blocks_accordion_steps_parent_id_idx" ON "segments_blocks_accordion_steps" USING btree ("_parent_id");
  CREATE INDEX "segments_blocks_accordion_steps_path_idx" ON "segments_blocks_accordion_steps" USING btree ("_path");
  CREATE INDEX "segments_blocks_accordion_steps_image_idx" ON "segments_blocks_accordion_steps" USING btree ("image_id");
  CREATE UNIQUE INDEX "segments_blocks_accordion_steps_locales_locale_parent_id_uni" ON "segments_blocks_accordion_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_cta_contact_order_idx" ON "segments_blocks_cta_contact" USING btree ("_order");
  CREATE INDEX "segments_blocks_cta_contact_parent_id_idx" ON "segments_blocks_cta_contact" USING btree ("_parent_id");
  CREATE INDEX "segments_blocks_cta_contact_path_idx" ON "segments_blocks_cta_contact" USING btree ("_path");
  CREATE INDEX "segments_blocks_cta_contact_photo_idx" ON "segments_blocks_cta_contact" USING btree ("photo_id");
  CREATE UNIQUE INDEX "segments_blocks_cta_contact_locales_locale_parent_id_unique" ON "segments_blocks_cta_contact_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_jobs_list_order_idx" ON "segments_blocks_jobs_list" USING btree ("_order");
  CREATE INDEX "segments_blocks_jobs_list_parent_id_idx" ON "segments_blocks_jobs_list" USING btree ("_parent_id");
  CREATE INDEX "segments_blocks_jobs_list_path_idx" ON "segments_blocks_jobs_list" USING btree ("_path");
  CREATE UNIQUE INDEX "segments_blocks_jobs_list_locales_locale_parent_id_unique" ON "segments_blocks_jobs_list_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_cta_banner_order_idx" ON "segments_blocks_cta_banner" USING btree ("_order");
  CREATE INDEX "segments_blocks_cta_banner_parent_id_idx" ON "segments_blocks_cta_banner" USING btree ("_parent_id");
  CREATE INDEX "segments_blocks_cta_banner_path_idx" ON "segments_blocks_cta_banner" USING btree ("_path");
  CREATE UNIQUE INDEX "segments_blocks_cta_banner_locales_locale_parent_id_unique" ON "segments_blocks_cta_banner_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_partner_hero_awards_order_idx" ON "segments_blocks_partner_hero_awards" USING btree ("_order");
  CREATE INDEX "segments_blocks_partner_hero_awards_parent_id_idx" ON "segments_blocks_partner_hero_awards" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "segments_blocks_partner_hero_awards_locales_locale_parent_id" ON "segments_blocks_partner_hero_awards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_partner_hero_order_idx" ON "segments_blocks_partner_hero" USING btree ("_order");
  CREATE INDEX "segments_blocks_partner_hero_parent_id_idx" ON "segments_blocks_partner_hero" USING btree ("_parent_id");
  CREATE INDEX "segments_blocks_partner_hero_path_idx" ON "segments_blocks_partner_hero" USING btree ("_path");
  CREATE INDEX "segments_blocks_partner_hero_logo_idx" ON "segments_blocks_partner_hero" USING btree ("logo_id");
  CREATE UNIQUE INDEX "segments_blocks_partner_hero_locales_locale_parent_id_unique" ON "segments_blocks_partner_hero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_partner_split_body_order_idx" ON "segments_blocks_partner_split_body" USING btree ("_order");
  CREATE INDEX "segments_blocks_partner_split_body_parent_id_idx" ON "segments_blocks_partner_split_body" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "segments_blocks_partner_split_body_locales_locale_parent_id_" ON "segments_blocks_partner_split_body_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_partner_split_items_order_idx" ON "segments_blocks_partner_split_items" USING btree ("_order");
  CREATE INDEX "segments_blocks_partner_split_items_parent_id_idx" ON "segments_blocks_partner_split_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "segments_blocks_partner_split_items_locales_locale_parent_id" ON "segments_blocks_partner_split_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_partner_split_order_idx" ON "segments_blocks_partner_split" USING btree ("_order");
  CREATE INDEX "segments_blocks_partner_split_parent_id_idx" ON "segments_blocks_partner_split" USING btree ("_parent_id");
  CREATE INDEX "segments_blocks_partner_split_path_idx" ON "segments_blocks_partner_split" USING btree ("_path");
  CREATE INDEX "segments_blocks_partner_split_image_idx" ON "segments_blocks_partner_split" USING btree ("image_id");
  CREATE INDEX "segments_blocks_partner_split_logo_idx" ON "segments_blocks_partner_split" USING btree ("logo_id");
  CREATE UNIQUE INDEX "segments_blocks_partner_split_locales_locale_parent_id_uniqu" ON "segments_blocks_partner_split_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_home_hero_order_idx" ON "segments_blocks_home_hero" USING btree ("_order");
  CREATE INDEX "segments_blocks_home_hero_parent_id_idx" ON "segments_blocks_home_hero" USING btree ("_parent_id");
  CREATE INDEX "segments_blocks_home_hero_path_idx" ON "segments_blocks_home_hero" USING btree ("_path");
  CREATE UNIQUE INDEX "segments_blocks_home_hero_locales_locale_parent_id_unique" ON "segments_blocks_home_hero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_logo_marquee_partners_order_idx" ON "segments_blocks_logo_marquee_partners" USING btree ("_order");
  CREATE INDEX "segments_blocks_logo_marquee_partners_parent_id_idx" ON "segments_blocks_logo_marquee_partners" USING btree ("_parent_id");
  CREATE INDEX "segments_blocks_logo_marquee_partners_logo_idx" ON "segments_blocks_logo_marquee_partners" USING btree ("logo_id");
  CREATE INDEX "segments_blocks_logo_marquee_order_idx" ON "segments_blocks_logo_marquee" USING btree ("_order");
  CREATE INDEX "segments_blocks_logo_marquee_parent_id_idx" ON "segments_blocks_logo_marquee" USING btree ("_parent_id");
  CREATE INDEX "segments_blocks_logo_marquee_path_idx" ON "segments_blocks_logo_marquee" USING btree ("_path");
  CREATE UNIQUE INDEX "segments_blocks_logo_marquee_locales_locale_parent_id_unique" ON "segments_blocks_logo_marquee_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_feature_tabs_items_order_idx" ON "segments_blocks_feature_tabs_items" USING btree ("_order");
  CREATE INDEX "segments_blocks_feature_tabs_items_parent_id_idx" ON "segments_blocks_feature_tabs_items" USING btree ("_parent_id");
  CREATE INDEX "segments_blocks_feature_tabs_items_image_idx" ON "segments_blocks_feature_tabs_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "segments_blocks_feature_tabs_items_locales_locale_parent_id_" ON "segments_blocks_feature_tabs_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_feature_tabs_order_idx" ON "segments_blocks_feature_tabs" USING btree ("_order");
  CREATE INDEX "segments_blocks_feature_tabs_parent_id_idx" ON "segments_blocks_feature_tabs" USING btree ("_parent_id");
  CREATE INDEX "segments_blocks_feature_tabs_path_idx" ON "segments_blocks_feature_tabs" USING btree ("_path");
  CREATE UNIQUE INDEX "segments_blocks_feature_tabs_locales_locale_parent_id_unique" ON "segments_blocks_feature_tabs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_home_bento_partner_card_items_order_idx" ON "segments_blocks_home_bento_partner_card_items" USING btree ("_order");
  CREATE INDEX "segments_blocks_home_bento_partner_card_items_parent_id_idx" ON "segments_blocks_home_bento_partner_card_items" USING btree ("_parent_id");
  CREATE INDEX "segments_blocks_home_bento_partner_card_items_logo_idx" ON "segments_blocks_home_bento_partner_card_items" USING btree ("logo_id");
  CREATE UNIQUE INDEX "segments_blocks_home_bento_partner_card_items_locales_locale" ON "segments_blocks_home_bento_partner_card_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_home_bento_metrics_order_idx" ON "segments_blocks_home_bento_metrics" USING btree ("_order");
  CREATE INDEX "segments_blocks_home_bento_metrics_parent_id_idx" ON "segments_blocks_home_bento_metrics" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "segments_blocks_home_bento_metrics_locales_locale_parent_id_" ON "segments_blocks_home_bento_metrics_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_home_bento_order_idx" ON "segments_blocks_home_bento" USING btree ("_order");
  CREATE INDEX "segments_blocks_home_bento_parent_id_idx" ON "segments_blocks_home_bento" USING btree ("_parent_id");
  CREATE INDEX "segments_blocks_home_bento_path_idx" ON "segments_blocks_home_bento" USING btree ("_path");
  CREATE UNIQUE INDEX "segments_blocks_home_bento_locales_locale_parent_id_unique" ON "segments_blocks_home_bento_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_case_carousel_items_order_idx" ON "segments_blocks_case_carousel_items" USING btree ("_order");
  CREATE INDEX "segments_blocks_case_carousel_items_parent_id_idx" ON "segments_blocks_case_carousel_items" USING btree ("_parent_id");
  CREATE INDEX "segments_blocks_case_carousel_items_image_idx" ON "segments_blocks_case_carousel_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "segments_blocks_case_carousel_items_locales_locale_parent_id" ON "segments_blocks_case_carousel_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_case_carousel_order_idx" ON "segments_blocks_case_carousel" USING btree ("_order");
  CREATE INDEX "segments_blocks_case_carousel_parent_id_idx" ON "segments_blocks_case_carousel" USING btree ("_parent_id");
  CREATE INDEX "segments_blocks_case_carousel_path_idx" ON "segments_blocks_case_carousel" USING btree ("_path");
  CREATE UNIQUE INDEX "segments_blocks_case_carousel_locales_locale_parent_id_uniqu" ON "segments_blocks_case_carousel_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_testimonial_carousel_order_idx" ON "segments_blocks_testimonial_carousel" USING btree ("_order");
  CREATE INDEX "segments_blocks_testimonial_carousel_parent_id_idx" ON "segments_blocks_testimonial_carousel" USING btree ("_parent_id");
  CREATE INDEX "segments_blocks_testimonial_carousel_path_idx" ON "segments_blocks_testimonial_carousel" USING btree ("_path");
  CREATE UNIQUE INDEX "segments_blocks_testimonial_carousel_locales_locale_parent_i" ON "segments_blocks_testimonial_carousel_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_content_teaser_cards_order_idx" ON "segments_blocks_content_teaser_cards" USING btree ("_order");
  CREATE INDEX "segments_blocks_content_teaser_cards_parent_id_idx" ON "segments_blocks_content_teaser_cards" USING btree ("_parent_id");
  CREATE INDEX "segments_blocks_content_teaser_cards_image_idx" ON "segments_blocks_content_teaser_cards" USING btree ("image_id");
  CREATE UNIQUE INDEX "segments_blocks_content_teaser_cards_locales_locale_parent_i" ON "segments_blocks_content_teaser_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_content_teaser_order_idx" ON "segments_blocks_content_teaser" USING btree ("_order");
  CREATE INDEX "segments_blocks_content_teaser_parent_id_idx" ON "segments_blocks_content_teaser" USING btree ("_parent_id");
  CREATE INDEX "segments_blocks_content_teaser_path_idx" ON "segments_blocks_content_teaser" USING btree ("_path");
  CREATE INDEX "segments_blocks_content_teaser_featured_featured_image_idx" ON "segments_blocks_content_teaser" USING btree ("featured_image_id");
  CREATE UNIQUE INDEX "segments_blocks_content_teaser_locales_locale_parent_id_uniq" ON "segments_blocks_content_teaser_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_insights_hub_formats_order_idx" ON "segments_blocks_insights_hub_formats" USING btree ("_order");
  CREATE INDEX "segments_blocks_insights_hub_formats_parent_id_idx" ON "segments_blocks_insights_hub_formats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "segments_blocks_insights_hub_formats_locales_locale_parent_i" ON "segments_blocks_insights_hub_formats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_insights_hub_items_tags_order_idx" ON "segments_blocks_insights_hub_items_tags" USING btree ("_order");
  CREATE INDEX "segments_blocks_insights_hub_items_tags_parent_id_idx" ON "segments_blocks_insights_hub_items_tags" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "segments_blocks_insights_hub_items_tags_locales_locale_paren" ON "segments_blocks_insights_hub_items_tags_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_insights_hub_items_order_idx" ON "segments_blocks_insights_hub_items" USING btree ("_order");
  CREATE INDEX "segments_blocks_insights_hub_items_parent_id_idx" ON "segments_blocks_insights_hub_items" USING btree ("_parent_id");
  CREATE INDEX "segments_blocks_insights_hub_items_image_idx" ON "segments_blocks_insights_hub_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "segments_blocks_insights_hub_items_locales_locale_parent_id_" ON "segments_blocks_insights_hub_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_insights_hub_order_idx" ON "segments_blocks_insights_hub" USING btree ("_order");
  CREATE INDEX "segments_blocks_insights_hub_parent_id_idx" ON "segments_blocks_insights_hub" USING btree ("_parent_id");
  CREATE INDEX "segments_blocks_insights_hub_path_idx" ON "segments_blocks_insights_hub" USING btree ("_path");
  CREATE UNIQUE INDEX "segments_blocks_insights_hub_locales_locale_parent_id_unique" ON "segments_blocks_insights_hub_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_seo_seo_og_image_idx" ON "segments" USING btree ("seo_og_image_id");
  CREATE INDEX "segments_updated_at_idx" ON "segments" USING btree ("updated_at");
  CREATE INDEX "segments_created_at_idx" ON "segments" USING btree ("created_at");
  CREATE INDEX "segments__status_idx" ON "segments" USING btree ("_status");
  CREATE UNIQUE INDEX "segments_slug_idx" ON "segments_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "segments_locales_locale_parent_id_unique" ON "segments_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_texts_order_parent" ON "segments_texts" USING btree ("order","parent_id");
  CREATE INDEX "segments_texts_locale_parent" ON "segments_texts" USING btree ("locale","parent_id");
  CREATE INDEX "segments_rels_order_idx" ON "segments_rels" USING btree ("order");
  CREATE INDEX "segments_rels_parent_idx" ON "segments_rels" USING btree ("parent_id");
  CREATE INDEX "segments_rels_path_idx" ON "segments_rels" USING btree ("path");
  CREATE INDEX "segments_rels_media_id_idx" ON "segments_rels" USING btree ("media_id");
  CREATE INDEX "segments_rels_partners_id_idx" ON "segments_rels" USING btree ("partners_id");
  CREATE INDEX "segments_rels_solutions_id_idx" ON "segments_rels" USING btree ("solutions_id");
  CREATE INDEX "segments_rels_cases_id_idx" ON "segments_rels" USING btree ("cases_id");
  CREATE INDEX "segments_rels_clients_id_idx" ON "segments_rels" USING btree ("clients_id");
  CREATE INDEX "_segments_v_blocks_page_hero_ctas_order_idx" ON "_segments_v_blocks_page_hero_ctas" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_page_hero_ctas_parent_id_idx" ON "_segments_v_blocks_page_hero_ctas" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_segments_v_blocks_page_hero_ctas_locales_locale_parent_id_u" ON "_segments_v_blocks_page_hero_ctas_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_page_hero_metrics_order_idx" ON "_segments_v_blocks_page_hero_metrics" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_page_hero_metrics_parent_id_idx" ON "_segments_v_blocks_page_hero_metrics" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_segments_v_blocks_page_hero_metrics_locales_locale_parent_i" ON "_segments_v_blocks_page_hero_metrics_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_page_hero_order_idx" ON "_segments_v_blocks_page_hero" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_page_hero_parent_id_idx" ON "_segments_v_blocks_page_hero" USING btree ("_parent_id");
  CREATE INDEX "_segments_v_blocks_page_hero_path_idx" ON "_segments_v_blocks_page_hero" USING btree ("_path");
  CREATE UNIQUE INDEX "_segments_v_blocks_page_hero_locales_locale_parent_id_unique" ON "_segments_v_blocks_page_hero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_sticky_page_nav_order_idx" ON "_segments_v_blocks_sticky_page_nav" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_sticky_page_nav_parent_id_idx" ON "_segments_v_blocks_sticky_page_nav" USING btree ("_parent_id");
  CREATE INDEX "_segments_v_blocks_sticky_page_nav_path_idx" ON "_segments_v_blocks_sticky_page_nav" USING btree ("_path");
  CREATE UNIQUE INDEX "_segments_v_blocks_sticky_page_nav_locales_locale_parent_id_" ON "_segments_v_blocks_sticky_page_nav_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_stats_grid_custom_items_order_idx" ON "_segments_v_blocks_stats_grid_custom_items" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_stats_grid_custom_items_parent_id_idx" ON "_segments_v_blocks_stats_grid_custom_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_segments_v_blocks_stats_grid_custom_items_locales_locale_pa" ON "_segments_v_blocks_stats_grid_custom_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_stats_grid_order_idx" ON "_segments_v_blocks_stats_grid" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_stats_grid_parent_id_idx" ON "_segments_v_blocks_stats_grid" USING btree ("_parent_id");
  CREATE INDEX "_segments_v_blocks_stats_grid_path_idx" ON "_segments_v_blocks_stats_grid" USING btree ("_path");
  CREATE UNIQUE INDEX "_segments_v_blocks_stats_grid_locales_locale_parent_id_uniqu" ON "_segments_v_blocks_stats_grid_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_rich_text_section_ctas_order_idx" ON "_segments_v_blocks_rich_text_section_ctas" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_rich_text_section_ctas_parent_id_idx" ON "_segments_v_blocks_rich_text_section_ctas" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_segments_v_blocks_rich_text_section_ctas_locales_locale_par" ON "_segments_v_blocks_rich_text_section_ctas_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_rich_text_section_order_idx" ON "_segments_v_blocks_rich_text_section" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_rich_text_section_parent_id_idx" ON "_segments_v_blocks_rich_text_section" USING btree ("_parent_id");
  CREATE INDEX "_segments_v_blocks_rich_text_section_path_idx" ON "_segments_v_blocks_rich_text_section" USING btree ("_path");
  CREATE INDEX "_segments_v_blocks_rich_text_section_image_idx" ON "_segments_v_blocks_rich_text_section" USING btree ("image_id");
  CREATE UNIQUE INDEX "_segments_v_blocks_rich_text_section_locales_locale_parent_i" ON "_segments_v_blocks_rich_text_section_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_icon_card_grid_items_order_idx" ON "_segments_v_blocks_icon_card_grid_items" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_icon_card_grid_items_parent_id_idx" ON "_segments_v_blocks_icon_card_grid_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_segments_v_blocks_icon_card_grid_items_locales_locale_paren" ON "_segments_v_blocks_icon_card_grid_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_icon_card_grid_order_idx" ON "_segments_v_blocks_icon_card_grid" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_icon_card_grid_parent_id_idx" ON "_segments_v_blocks_icon_card_grid" USING btree ("_parent_id");
  CREATE INDEX "_segments_v_blocks_icon_card_grid_path_idx" ON "_segments_v_blocks_icon_card_grid" USING btree ("_path");
  CREATE UNIQUE INDEX "_segments_v_blocks_icon_card_grid_locales_locale_parent_id_u" ON "_segments_v_blocks_icon_card_grid_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_value_cards_items_bullets_order_idx" ON "_segments_v_blocks_value_cards_items_bullets" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_value_cards_items_bullets_parent_id_idx" ON "_segments_v_blocks_value_cards_items_bullets" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_segments_v_blocks_value_cards_items_bullets_locales_locale_" ON "_segments_v_blocks_value_cards_items_bullets_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_value_cards_items_order_idx" ON "_segments_v_blocks_value_cards_items" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_value_cards_items_parent_id_idx" ON "_segments_v_blocks_value_cards_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_segments_v_blocks_value_cards_items_locales_locale_parent_i" ON "_segments_v_blocks_value_cards_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_value_cards_order_idx" ON "_segments_v_blocks_value_cards" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_value_cards_parent_id_idx" ON "_segments_v_blocks_value_cards" USING btree ("_parent_id");
  CREATE INDEX "_segments_v_blocks_value_cards_path_idx" ON "_segments_v_blocks_value_cards" USING btree ("_path");
  CREATE UNIQUE INDEX "_segments_v_blocks_value_cards_locales_locale_parent_id_uniq" ON "_segments_v_blocks_value_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_partner_showcase_order_idx" ON "_segments_v_blocks_partner_showcase" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_partner_showcase_parent_id_idx" ON "_segments_v_blocks_partner_showcase" USING btree ("_parent_id");
  CREATE INDEX "_segments_v_blocks_partner_showcase_path_idx" ON "_segments_v_blocks_partner_showcase" USING btree ("_path");
  CREATE UNIQUE INDEX "_segments_v_blocks_partner_showcase_locales_locale_parent_id" ON "_segments_v_blocks_partner_showcase_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_seals_banner_order_idx" ON "_segments_v_blocks_seals_banner" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_seals_banner_parent_id_idx" ON "_segments_v_blocks_seals_banner" USING btree ("_parent_id");
  CREATE INDEX "_segments_v_blocks_seals_banner_path_idx" ON "_segments_v_blocks_seals_banner" USING btree ("_path");
  CREATE UNIQUE INDEX "_segments_v_blocks_seals_banner_locales_locale_parent_id_uni" ON "_segments_v_blocks_seals_banner_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_process_steps_steps_order_idx" ON "_segments_v_blocks_process_steps_steps" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_process_steps_steps_parent_id_idx" ON "_segments_v_blocks_process_steps_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_segments_v_blocks_process_steps_steps_locales_locale_parent" ON "_segments_v_blocks_process_steps_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_process_steps_order_idx" ON "_segments_v_blocks_process_steps" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_process_steps_parent_id_idx" ON "_segments_v_blocks_process_steps" USING btree ("_parent_id");
  CREATE INDEX "_segments_v_blocks_process_steps_path_idx" ON "_segments_v_blocks_process_steps" USING btree ("_path");
  CREATE UNIQUE INDEX "_segments_v_blocks_process_steps_locales_locale_parent_id_un" ON "_segments_v_blocks_process_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_method_cards_items_bullets_order_idx" ON "_segments_v_blocks_method_cards_items_bullets" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_method_cards_items_bullets_parent_id_idx" ON "_segments_v_blocks_method_cards_items_bullets" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_segments_v_blocks_method_cards_items_bullets_locales_locale" ON "_segments_v_blocks_method_cards_items_bullets_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_method_cards_items_order_idx" ON "_segments_v_blocks_method_cards_items" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_method_cards_items_parent_id_idx" ON "_segments_v_blocks_method_cards_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_segments_v_blocks_method_cards_items_locales_locale_parent_" ON "_segments_v_blocks_method_cards_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_method_cards_order_idx" ON "_segments_v_blocks_method_cards" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_method_cards_parent_id_idx" ON "_segments_v_blocks_method_cards" USING btree ("_parent_id");
  CREATE INDEX "_segments_v_blocks_method_cards_path_idx" ON "_segments_v_blocks_method_cards" USING btree ("_path");
  CREATE UNIQUE INDEX "_segments_v_blocks_method_cards_locales_locale_parent_id_uni" ON "_segments_v_blocks_method_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_bento_grid_items_metrics_order_idx" ON "_segments_v_blocks_bento_grid_items_metrics" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_bento_grid_items_metrics_parent_id_idx" ON "_segments_v_blocks_bento_grid_items_metrics" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_segments_v_blocks_bento_grid_items_metrics_locales_locale_p" ON "_segments_v_blocks_bento_grid_items_metrics_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_bento_grid_items_tags_order_idx" ON "_segments_v_blocks_bento_grid_items_tags" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_bento_grid_items_tags_parent_id_idx" ON "_segments_v_blocks_bento_grid_items_tags" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_segments_v_blocks_bento_grid_items_tags_locales_locale_pare" ON "_segments_v_blocks_bento_grid_items_tags_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_bento_grid_items_bullets_order_idx" ON "_segments_v_blocks_bento_grid_items_bullets" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_bento_grid_items_bullets_parent_id_idx" ON "_segments_v_blocks_bento_grid_items_bullets" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_segments_v_blocks_bento_grid_items_bullets_locales_locale_p" ON "_segments_v_blocks_bento_grid_items_bullets_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_bento_grid_items_order_idx" ON "_segments_v_blocks_bento_grid_items" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_bento_grid_items_parent_id_idx" ON "_segments_v_blocks_bento_grid_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_segments_v_blocks_bento_grid_items_locales_locale_parent_id" ON "_segments_v_blocks_bento_grid_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_bento_grid_order_idx" ON "_segments_v_blocks_bento_grid" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_bento_grid_parent_id_idx" ON "_segments_v_blocks_bento_grid" USING btree ("_parent_id");
  CREATE INDEX "_segments_v_blocks_bento_grid_path_idx" ON "_segments_v_blocks_bento_grid" USING btree ("_path");
  CREATE UNIQUE INDEX "_segments_v_blocks_bento_grid_locales_locale_parent_id_uniqu" ON "_segments_v_blocks_bento_grid_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_audience_split_items_order_idx" ON "_segments_v_blocks_audience_split_items" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_audience_split_items_parent_id_idx" ON "_segments_v_blocks_audience_split_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_segments_v_blocks_audience_split_items_locales_locale_paren" ON "_segments_v_blocks_audience_split_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_audience_split_order_idx" ON "_segments_v_blocks_audience_split" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_audience_split_parent_id_idx" ON "_segments_v_blocks_audience_split" USING btree ("_parent_id");
  CREATE INDEX "_segments_v_blocks_audience_split_path_idx" ON "_segments_v_blocks_audience_split" USING btree ("_path");
  CREATE UNIQUE INDEX "_segments_v_blocks_audience_split_locales_locale_parent_id_u" ON "_segments_v_blocks_audience_split_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_accordion_steps_steps_order_idx" ON "_segments_v_blocks_accordion_steps_steps" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_accordion_steps_steps_parent_id_idx" ON "_segments_v_blocks_accordion_steps_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_segments_v_blocks_accordion_steps_steps_locales_locale_pare" ON "_segments_v_blocks_accordion_steps_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_accordion_steps_order_idx" ON "_segments_v_blocks_accordion_steps" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_accordion_steps_parent_id_idx" ON "_segments_v_blocks_accordion_steps" USING btree ("_parent_id");
  CREATE INDEX "_segments_v_blocks_accordion_steps_path_idx" ON "_segments_v_blocks_accordion_steps" USING btree ("_path");
  CREATE INDEX "_segments_v_blocks_accordion_steps_image_idx" ON "_segments_v_blocks_accordion_steps" USING btree ("image_id");
  CREATE UNIQUE INDEX "_segments_v_blocks_accordion_steps_locales_locale_parent_id_" ON "_segments_v_blocks_accordion_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_cta_contact_order_idx" ON "_segments_v_blocks_cta_contact" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_cta_contact_parent_id_idx" ON "_segments_v_blocks_cta_contact" USING btree ("_parent_id");
  CREATE INDEX "_segments_v_blocks_cta_contact_path_idx" ON "_segments_v_blocks_cta_contact" USING btree ("_path");
  CREATE INDEX "_segments_v_blocks_cta_contact_photo_idx" ON "_segments_v_blocks_cta_contact" USING btree ("photo_id");
  CREATE UNIQUE INDEX "_segments_v_blocks_cta_contact_locales_locale_parent_id_uniq" ON "_segments_v_blocks_cta_contact_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_jobs_list_order_idx" ON "_segments_v_blocks_jobs_list" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_jobs_list_parent_id_idx" ON "_segments_v_blocks_jobs_list" USING btree ("_parent_id");
  CREATE INDEX "_segments_v_blocks_jobs_list_path_idx" ON "_segments_v_blocks_jobs_list" USING btree ("_path");
  CREATE UNIQUE INDEX "_segments_v_blocks_jobs_list_locales_locale_parent_id_unique" ON "_segments_v_blocks_jobs_list_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_cta_banner_order_idx" ON "_segments_v_blocks_cta_banner" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_cta_banner_parent_id_idx" ON "_segments_v_blocks_cta_banner" USING btree ("_parent_id");
  CREATE INDEX "_segments_v_blocks_cta_banner_path_idx" ON "_segments_v_blocks_cta_banner" USING btree ("_path");
  CREATE UNIQUE INDEX "_segments_v_blocks_cta_banner_locales_locale_parent_id_uniqu" ON "_segments_v_blocks_cta_banner_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_partner_hero_awards_order_idx" ON "_segments_v_blocks_partner_hero_awards" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_partner_hero_awards_parent_id_idx" ON "_segments_v_blocks_partner_hero_awards" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_segments_v_blocks_partner_hero_awards_locales_locale_parent" ON "_segments_v_blocks_partner_hero_awards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_partner_hero_order_idx" ON "_segments_v_blocks_partner_hero" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_partner_hero_parent_id_idx" ON "_segments_v_blocks_partner_hero" USING btree ("_parent_id");
  CREATE INDEX "_segments_v_blocks_partner_hero_path_idx" ON "_segments_v_blocks_partner_hero" USING btree ("_path");
  CREATE INDEX "_segments_v_blocks_partner_hero_logo_idx" ON "_segments_v_blocks_partner_hero" USING btree ("logo_id");
  CREATE UNIQUE INDEX "_segments_v_blocks_partner_hero_locales_locale_parent_id_uni" ON "_segments_v_blocks_partner_hero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_partner_split_body_order_idx" ON "_segments_v_blocks_partner_split_body" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_partner_split_body_parent_id_idx" ON "_segments_v_blocks_partner_split_body" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_segments_v_blocks_partner_split_body_locales_locale_parent_" ON "_segments_v_blocks_partner_split_body_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_partner_split_items_order_idx" ON "_segments_v_blocks_partner_split_items" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_partner_split_items_parent_id_idx" ON "_segments_v_blocks_partner_split_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_segments_v_blocks_partner_split_items_locales_locale_parent" ON "_segments_v_blocks_partner_split_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_partner_split_order_idx" ON "_segments_v_blocks_partner_split" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_partner_split_parent_id_idx" ON "_segments_v_blocks_partner_split" USING btree ("_parent_id");
  CREATE INDEX "_segments_v_blocks_partner_split_path_idx" ON "_segments_v_blocks_partner_split" USING btree ("_path");
  CREATE INDEX "_segments_v_blocks_partner_split_image_idx" ON "_segments_v_blocks_partner_split" USING btree ("image_id");
  CREATE INDEX "_segments_v_blocks_partner_split_logo_idx" ON "_segments_v_blocks_partner_split" USING btree ("logo_id");
  CREATE UNIQUE INDEX "_segments_v_blocks_partner_split_locales_locale_parent_id_un" ON "_segments_v_blocks_partner_split_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_home_hero_order_idx" ON "_segments_v_blocks_home_hero" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_home_hero_parent_id_idx" ON "_segments_v_blocks_home_hero" USING btree ("_parent_id");
  CREATE INDEX "_segments_v_blocks_home_hero_path_idx" ON "_segments_v_blocks_home_hero" USING btree ("_path");
  CREATE UNIQUE INDEX "_segments_v_blocks_home_hero_locales_locale_parent_id_unique" ON "_segments_v_blocks_home_hero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_logo_marquee_partners_order_idx" ON "_segments_v_blocks_logo_marquee_partners" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_logo_marquee_partners_parent_id_idx" ON "_segments_v_blocks_logo_marquee_partners" USING btree ("_parent_id");
  CREATE INDEX "_segments_v_blocks_logo_marquee_partners_logo_idx" ON "_segments_v_blocks_logo_marquee_partners" USING btree ("logo_id");
  CREATE INDEX "_segments_v_blocks_logo_marquee_order_idx" ON "_segments_v_blocks_logo_marquee" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_logo_marquee_parent_id_idx" ON "_segments_v_blocks_logo_marquee" USING btree ("_parent_id");
  CREATE INDEX "_segments_v_blocks_logo_marquee_path_idx" ON "_segments_v_blocks_logo_marquee" USING btree ("_path");
  CREATE UNIQUE INDEX "_segments_v_blocks_logo_marquee_locales_locale_parent_id_uni" ON "_segments_v_blocks_logo_marquee_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_feature_tabs_items_order_idx" ON "_segments_v_blocks_feature_tabs_items" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_feature_tabs_items_parent_id_idx" ON "_segments_v_blocks_feature_tabs_items" USING btree ("_parent_id");
  CREATE INDEX "_segments_v_blocks_feature_tabs_items_image_idx" ON "_segments_v_blocks_feature_tabs_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "_segments_v_blocks_feature_tabs_items_locales_locale_parent_" ON "_segments_v_blocks_feature_tabs_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_feature_tabs_order_idx" ON "_segments_v_blocks_feature_tabs" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_feature_tabs_parent_id_idx" ON "_segments_v_blocks_feature_tabs" USING btree ("_parent_id");
  CREATE INDEX "_segments_v_blocks_feature_tabs_path_idx" ON "_segments_v_blocks_feature_tabs" USING btree ("_path");
  CREATE UNIQUE INDEX "_segments_v_blocks_feature_tabs_locales_locale_parent_id_uni" ON "_segments_v_blocks_feature_tabs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_home_bento_partner_card_items_order_idx" ON "_segments_v_blocks_home_bento_partner_card_items" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_home_bento_partner_card_items_parent_id_idx" ON "_segments_v_blocks_home_bento_partner_card_items" USING btree ("_parent_id");
  CREATE INDEX "_segments_v_blocks_home_bento_partner_card_items_logo_idx" ON "_segments_v_blocks_home_bento_partner_card_items" USING btree ("logo_id");
  CREATE UNIQUE INDEX "_segments_v_blocks_home_bento_partner_card_items_locales_loc" ON "_segments_v_blocks_home_bento_partner_card_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_home_bento_metrics_order_idx" ON "_segments_v_blocks_home_bento_metrics" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_home_bento_metrics_parent_id_idx" ON "_segments_v_blocks_home_bento_metrics" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_segments_v_blocks_home_bento_metrics_locales_locale_parent_" ON "_segments_v_blocks_home_bento_metrics_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_home_bento_order_idx" ON "_segments_v_blocks_home_bento" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_home_bento_parent_id_idx" ON "_segments_v_blocks_home_bento" USING btree ("_parent_id");
  CREATE INDEX "_segments_v_blocks_home_bento_path_idx" ON "_segments_v_blocks_home_bento" USING btree ("_path");
  CREATE UNIQUE INDEX "_segments_v_blocks_home_bento_locales_locale_parent_id_uniqu" ON "_segments_v_blocks_home_bento_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_case_carousel_items_order_idx" ON "_segments_v_blocks_case_carousel_items" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_case_carousel_items_parent_id_idx" ON "_segments_v_blocks_case_carousel_items" USING btree ("_parent_id");
  CREATE INDEX "_segments_v_blocks_case_carousel_items_image_idx" ON "_segments_v_blocks_case_carousel_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "_segments_v_blocks_case_carousel_items_locales_locale_parent" ON "_segments_v_blocks_case_carousel_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_case_carousel_order_idx" ON "_segments_v_blocks_case_carousel" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_case_carousel_parent_id_idx" ON "_segments_v_blocks_case_carousel" USING btree ("_parent_id");
  CREATE INDEX "_segments_v_blocks_case_carousel_path_idx" ON "_segments_v_blocks_case_carousel" USING btree ("_path");
  CREATE UNIQUE INDEX "_segments_v_blocks_case_carousel_locales_locale_parent_id_un" ON "_segments_v_blocks_case_carousel_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_testimonial_carousel_order_idx" ON "_segments_v_blocks_testimonial_carousel" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_testimonial_carousel_parent_id_idx" ON "_segments_v_blocks_testimonial_carousel" USING btree ("_parent_id");
  CREATE INDEX "_segments_v_blocks_testimonial_carousel_path_idx" ON "_segments_v_blocks_testimonial_carousel" USING btree ("_path");
  CREATE UNIQUE INDEX "_segments_v_blocks_testimonial_carousel_locales_locale_paren" ON "_segments_v_blocks_testimonial_carousel_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_content_teaser_cards_order_idx" ON "_segments_v_blocks_content_teaser_cards" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_content_teaser_cards_parent_id_idx" ON "_segments_v_blocks_content_teaser_cards" USING btree ("_parent_id");
  CREATE INDEX "_segments_v_blocks_content_teaser_cards_image_idx" ON "_segments_v_blocks_content_teaser_cards" USING btree ("image_id");
  CREATE UNIQUE INDEX "_segments_v_blocks_content_teaser_cards_locales_locale_paren" ON "_segments_v_blocks_content_teaser_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_content_teaser_order_idx" ON "_segments_v_blocks_content_teaser" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_content_teaser_parent_id_idx" ON "_segments_v_blocks_content_teaser" USING btree ("_parent_id");
  CREATE INDEX "_segments_v_blocks_content_teaser_path_idx" ON "_segments_v_blocks_content_teaser" USING btree ("_path");
  CREATE INDEX "_segments_v_blocks_content_teaser_featured_featured_imag_idx" ON "_segments_v_blocks_content_teaser" USING btree ("featured_image_id");
  CREATE UNIQUE INDEX "_segments_v_blocks_content_teaser_locales_locale_parent_id_u" ON "_segments_v_blocks_content_teaser_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_insights_hub_formats_order_idx" ON "_segments_v_blocks_insights_hub_formats" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_insights_hub_formats_parent_id_idx" ON "_segments_v_blocks_insights_hub_formats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_segments_v_blocks_insights_hub_formats_locales_locale_paren" ON "_segments_v_blocks_insights_hub_formats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_insights_hub_items_tags_order_idx" ON "_segments_v_blocks_insights_hub_items_tags" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_insights_hub_items_tags_parent_id_idx" ON "_segments_v_blocks_insights_hub_items_tags" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_segments_v_blocks_insights_hub_items_tags_locales_locale_pa" ON "_segments_v_blocks_insights_hub_items_tags_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_insights_hub_items_order_idx" ON "_segments_v_blocks_insights_hub_items" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_insights_hub_items_parent_id_idx" ON "_segments_v_blocks_insights_hub_items" USING btree ("_parent_id");
  CREATE INDEX "_segments_v_blocks_insights_hub_items_image_idx" ON "_segments_v_blocks_insights_hub_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "_segments_v_blocks_insights_hub_items_locales_locale_parent_" ON "_segments_v_blocks_insights_hub_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_insights_hub_order_idx" ON "_segments_v_blocks_insights_hub" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_insights_hub_parent_id_idx" ON "_segments_v_blocks_insights_hub" USING btree ("_parent_id");
  CREATE INDEX "_segments_v_blocks_insights_hub_path_idx" ON "_segments_v_blocks_insights_hub" USING btree ("_path");
  CREATE UNIQUE INDEX "_segments_v_blocks_insights_hub_locales_locale_parent_id_uni" ON "_segments_v_blocks_insights_hub_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_parent_idx" ON "_segments_v" USING btree ("parent_id");
  CREATE INDEX "_segments_v_version_seo_version_seo_og_image_idx" ON "_segments_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_segments_v_version_version_updated_at_idx" ON "_segments_v" USING btree ("version_updated_at");
  CREATE INDEX "_segments_v_version_version_created_at_idx" ON "_segments_v" USING btree ("version_created_at");
  CREATE INDEX "_segments_v_version_version__status_idx" ON "_segments_v" USING btree ("version__status");
  CREATE INDEX "_segments_v_created_at_idx" ON "_segments_v" USING btree ("created_at");
  CREATE INDEX "_segments_v_updated_at_idx" ON "_segments_v" USING btree ("updated_at");
  CREATE INDEX "_segments_v_snapshot_idx" ON "_segments_v" USING btree ("snapshot");
  CREATE INDEX "_segments_v_published_locale_idx" ON "_segments_v" USING btree ("published_locale");
  CREATE INDEX "_segments_v_latest_idx" ON "_segments_v" USING btree ("latest");
  CREATE INDEX "_segments_v_version_version_slug_idx" ON "_segments_v_locales" USING btree ("version_slug","_locale");
  CREATE UNIQUE INDEX "_segments_v_locales_locale_parent_id_unique" ON "_segments_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_texts_order_parent" ON "_segments_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "_segments_v_texts_locale_parent" ON "_segments_v_texts" USING btree ("locale","parent_id");
  CREATE INDEX "_segments_v_rels_order_idx" ON "_segments_v_rels" USING btree ("order");
  CREATE INDEX "_segments_v_rels_parent_idx" ON "_segments_v_rels" USING btree ("parent_id");
  CREATE INDEX "_segments_v_rels_path_idx" ON "_segments_v_rels" USING btree ("path");
  CREATE INDEX "_segments_v_rels_media_id_idx" ON "_segments_v_rels" USING btree ("media_id");
  CREATE INDEX "_segments_v_rels_partners_id_idx" ON "_segments_v_rels" USING btree ("partners_id");
  CREATE INDEX "_segments_v_rels_solutions_id_idx" ON "_segments_v_rels" USING btree ("solutions_id");
  CREATE INDEX "_segments_v_rels_cases_id_idx" ON "_segments_v_rels" USING btree ("cases_id");
  CREATE INDEX "_segments_v_rels_clients_id_idx" ON "_segments_v_rels" USING btree ("clients_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_segments_fk" FOREIGN KEY ("segments_id") REFERENCES "public"."segments"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_segments_id_idx" ON "payload_locked_documents_rels" USING btree ("segments_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "segments_blocks_page_hero_ctas" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_page_hero_ctas_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_page_hero_metrics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_page_hero_metrics_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_page_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_page_hero_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_sticky_page_nav" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_sticky_page_nav_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_stats_grid_custom_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_stats_grid_custom_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_stats_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_stats_grid_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_rich_text_section_ctas" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_rich_text_section_ctas_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_rich_text_section" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_rich_text_section_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_icon_card_grid_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_icon_card_grid_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_icon_card_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_icon_card_grid_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_value_cards_items_bullets" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_value_cards_items_bullets_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_value_cards_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_value_cards_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_value_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_value_cards_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_partner_showcase" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_partner_showcase_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_seals_banner" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_seals_banner_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_process_steps_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_process_steps_steps_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_process_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_process_steps_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_method_cards_items_bullets" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_method_cards_items_bullets_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_method_cards_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_method_cards_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_method_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_method_cards_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_bento_grid_items_metrics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_bento_grid_items_metrics_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_bento_grid_items_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_bento_grid_items_tags_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_bento_grid_items_bullets" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_bento_grid_items_bullets_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_bento_grid_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_bento_grid_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_bento_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_bento_grid_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_audience_split_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_audience_split_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_audience_split" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_audience_split_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_accordion_steps_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_accordion_steps_steps_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_accordion_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_accordion_steps_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_cta_contact" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_cta_contact_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_jobs_list" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_jobs_list_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_cta_banner" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_cta_banner_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_partner_hero_awards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_partner_hero_awards_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_partner_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_partner_hero_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_partner_split_body" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_partner_split_body_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_partner_split_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_partner_split_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_partner_split" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_partner_split_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_home_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_home_hero_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_logo_marquee_partners" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_logo_marquee" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_logo_marquee_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_feature_tabs_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_feature_tabs_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_feature_tabs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_feature_tabs_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_home_bento_partner_card_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_home_bento_partner_card_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_home_bento_metrics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_home_bento_metrics_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_home_bento" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_home_bento_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_case_carousel_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_case_carousel_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_case_carousel" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_case_carousel_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_testimonial_carousel" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_testimonial_carousel_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_content_teaser_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_content_teaser_cards_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_content_teaser" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_content_teaser_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_insights_hub_formats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_insights_hub_formats_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_insights_hub_items_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_insights_hub_items_tags_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_insights_hub_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_insights_hub_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_insights_hub" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_insights_hub_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_page_hero_ctas" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_page_hero_ctas_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_page_hero_metrics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_page_hero_metrics_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_page_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_page_hero_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_sticky_page_nav" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_sticky_page_nav_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_stats_grid_custom_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_stats_grid_custom_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_stats_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_stats_grid_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_rich_text_section_ctas" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_rich_text_section_ctas_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_rich_text_section" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_rich_text_section_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_icon_card_grid_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_icon_card_grid_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_icon_card_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_icon_card_grid_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_value_cards_items_bullets" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_value_cards_items_bullets_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_value_cards_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_value_cards_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_value_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_value_cards_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_partner_showcase" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_partner_showcase_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_seals_banner" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_seals_banner_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_process_steps_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_process_steps_steps_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_process_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_process_steps_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_method_cards_items_bullets" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_method_cards_items_bullets_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_method_cards_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_method_cards_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_method_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_method_cards_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_bento_grid_items_metrics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_bento_grid_items_metrics_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_bento_grid_items_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_bento_grid_items_tags_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_bento_grid_items_bullets" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_bento_grid_items_bullets_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_bento_grid_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_bento_grid_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_bento_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_bento_grid_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_audience_split_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_audience_split_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_audience_split" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_audience_split_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_accordion_steps_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_accordion_steps_steps_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_accordion_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_accordion_steps_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_cta_contact" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_cta_contact_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_jobs_list" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_jobs_list_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_cta_banner" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_cta_banner_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_partner_hero_awards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_partner_hero_awards_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_partner_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_partner_hero_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_partner_split_body" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_partner_split_body_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_partner_split_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_partner_split_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_partner_split" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_partner_split_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_home_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_home_hero_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_logo_marquee_partners" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_logo_marquee" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_logo_marquee_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_feature_tabs_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_feature_tabs_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_feature_tabs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_feature_tabs_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_home_bento_partner_card_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_home_bento_partner_card_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_home_bento_metrics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_home_bento_metrics_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_home_bento" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_home_bento_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_case_carousel_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_case_carousel_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_case_carousel" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_case_carousel_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_testimonial_carousel" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_testimonial_carousel_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_content_teaser_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_content_teaser_cards_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_content_teaser" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_content_teaser_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_insights_hub_formats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_insights_hub_formats_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_insights_hub_items_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_insights_hub_items_tags_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_insights_hub_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_insights_hub_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_insights_hub" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_insights_hub_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "segments_blocks_page_hero_ctas" CASCADE;
  DROP TABLE "segments_blocks_page_hero_ctas_locales" CASCADE;
  DROP TABLE "segments_blocks_page_hero_metrics" CASCADE;
  DROP TABLE "segments_blocks_page_hero_metrics_locales" CASCADE;
  DROP TABLE "segments_blocks_page_hero" CASCADE;
  DROP TABLE "segments_blocks_page_hero_locales" CASCADE;
  DROP TABLE "segments_blocks_sticky_page_nav" CASCADE;
  DROP TABLE "segments_blocks_sticky_page_nav_locales" CASCADE;
  DROP TABLE "segments_blocks_stats_grid_custom_items" CASCADE;
  DROP TABLE "segments_blocks_stats_grid_custom_items_locales" CASCADE;
  DROP TABLE "segments_blocks_stats_grid" CASCADE;
  DROP TABLE "segments_blocks_stats_grid_locales" CASCADE;
  DROP TABLE "segments_blocks_rich_text_section_ctas" CASCADE;
  DROP TABLE "segments_blocks_rich_text_section_ctas_locales" CASCADE;
  DROP TABLE "segments_blocks_rich_text_section" CASCADE;
  DROP TABLE "segments_blocks_rich_text_section_locales" CASCADE;
  DROP TABLE "segments_blocks_icon_card_grid_items" CASCADE;
  DROP TABLE "segments_blocks_icon_card_grid_items_locales" CASCADE;
  DROP TABLE "segments_blocks_icon_card_grid" CASCADE;
  DROP TABLE "segments_blocks_icon_card_grid_locales" CASCADE;
  DROP TABLE "segments_blocks_value_cards_items_bullets" CASCADE;
  DROP TABLE "segments_blocks_value_cards_items_bullets_locales" CASCADE;
  DROP TABLE "segments_blocks_value_cards_items" CASCADE;
  DROP TABLE "segments_blocks_value_cards_items_locales" CASCADE;
  DROP TABLE "segments_blocks_value_cards" CASCADE;
  DROP TABLE "segments_blocks_value_cards_locales" CASCADE;
  DROP TABLE "segments_blocks_partner_showcase" CASCADE;
  DROP TABLE "segments_blocks_partner_showcase_locales" CASCADE;
  DROP TABLE "segments_blocks_seals_banner" CASCADE;
  DROP TABLE "segments_blocks_seals_banner_locales" CASCADE;
  DROP TABLE "segments_blocks_process_steps_steps" CASCADE;
  DROP TABLE "segments_blocks_process_steps_steps_locales" CASCADE;
  DROP TABLE "segments_blocks_process_steps" CASCADE;
  DROP TABLE "segments_blocks_process_steps_locales" CASCADE;
  DROP TABLE "segments_blocks_method_cards_items_bullets" CASCADE;
  DROP TABLE "segments_blocks_method_cards_items_bullets_locales" CASCADE;
  DROP TABLE "segments_blocks_method_cards_items" CASCADE;
  DROP TABLE "segments_blocks_method_cards_items_locales" CASCADE;
  DROP TABLE "segments_blocks_method_cards" CASCADE;
  DROP TABLE "segments_blocks_method_cards_locales" CASCADE;
  DROP TABLE "segments_blocks_bento_grid_items_metrics" CASCADE;
  DROP TABLE "segments_blocks_bento_grid_items_metrics_locales" CASCADE;
  DROP TABLE "segments_blocks_bento_grid_items_tags" CASCADE;
  DROP TABLE "segments_blocks_bento_grid_items_tags_locales" CASCADE;
  DROP TABLE "segments_blocks_bento_grid_items_bullets" CASCADE;
  DROP TABLE "segments_blocks_bento_grid_items_bullets_locales" CASCADE;
  DROP TABLE "segments_blocks_bento_grid_items" CASCADE;
  DROP TABLE "segments_blocks_bento_grid_items_locales" CASCADE;
  DROP TABLE "segments_blocks_bento_grid" CASCADE;
  DROP TABLE "segments_blocks_bento_grid_locales" CASCADE;
  DROP TABLE "segments_blocks_audience_split_items" CASCADE;
  DROP TABLE "segments_blocks_audience_split_items_locales" CASCADE;
  DROP TABLE "segments_blocks_audience_split" CASCADE;
  DROP TABLE "segments_blocks_audience_split_locales" CASCADE;
  DROP TABLE "segments_blocks_accordion_steps_steps" CASCADE;
  DROP TABLE "segments_blocks_accordion_steps_steps_locales" CASCADE;
  DROP TABLE "segments_blocks_accordion_steps" CASCADE;
  DROP TABLE "segments_blocks_accordion_steps_locales" CASCADE;
  DROP TABLE "segments_blocks_cta_contact" CASCADE;
  DROP TABLE "segments_blocks_cta_contact_locales" CASCADE;
  DROP TABLE "segments_blocks_jobs_list" CASCADE;
  DROP TABLE "segments_blocks_jobs_list_locales" CASCADE;
  DROP TABLE "segments_blocks_cta_banner" CASCADE;
  DROP TABLE "segments_blocks_cta_banner_locales" CASCADE;
  DROP TABLE "segments_blocks_partner_hero_awards" CASCADE;
  DROP TABLE "segments_blocks_partner_hero_awards_locales" CASCADE;
  DROP TABLE "segments_blocks_partner_hero" CASCADE;
  DROP TABLE "segments_blocks_partner_hero_locales" CASCADE;
  DROP TABLE "segments_blocks_partner_split_body" CASCADE;
  DROP TABLE "segments_blocks_partner_split_body_locales" CASCADE;
  DROP TABLE "segments_blocks_partner_split_items" CASCADE;
  DROP TABLE "segments_blocks_partner_split_items_locales" CASCADE;
  DROP TABLE "segments_blocks_partner_split" CASCADE;
  DROP TABLE "segments_blocks_partner_split_locales" CASCADE;
  DROP TABLE "segments_blocks_home_hero" CASCADE;
  DROP TABLE "segments_blocks_home_hero_locales" CASCADE;
  DROP TABLE "segments_blocks_logo_marquee_partners" CASCADE;
  DROP TABLE "segments_blocks_logo_marquee" CASCADE;
  DROP TABLE "segments_blocks_logo_marquee_locales" CASCADE;
  DROP TABLE "segments_blocks_feature_tabs_items" CASCADE;
  DROP TABLE "segments_blocks_feature_tabs_items_locales" CASCADE;
  DROP TABLE "segments_blocks_feature_tabs" CASCADE;
  DROP TABLE "segments_blocks_feature_tabs_locales" CASCADE;
  DROP TABLE "segments_blocks_home_bento_partner_card_items" CASCADE;
  DROP TABLE "segments_blocks_home_bento_partner_card_items_locales" CASCADE;
  DROP TABLE "segments_blocks_home_bento_metrics" CASCADE;
  DROP TABLE "segments_blocks_home_bento_metrics_locales" CASCADE;
  DROP TABLE "segments_blocks_home_bento" CASCADE;
  DROP TABLE "segments_blocks_home_bento_locales" CASCADE;
  DROP TABLE "segments_blocks_case_carousel_items" CASCADE;
  DROP TABLE "segments_blocks_case_carousel_items_locales" CASCADE;
  DROP TABLE "segments_blocks_case_carousel" CASCADE;
  DROP TABLE "segments_blocks_case_carousel_locales" CASCADE;
  DROP TABLE "segments_blocks_testimonial_carousel" CASCADE;
  DROP TABLE "segments_blocks_testimonial_carousel_locales" CASCADE;
  DROP TABLE "segments_blocks_content_teaser_cards" CASCADE;
  DROP TABLE "segments_blocks_content_teaser_cards_locales" CASCADE;
  DROP TABLE "segments_blocks_content_teaser" CASCADE;
  DROP TABLE "segments_blocks_content_teaser_locales" CASCADE;
  DROP TABLE "segments_blocks_insights_hub_formats" CASCADE;
  DROP TABLE "segments_blocks_insights_hub_formats_locales" CASCADE;
  DROP TABLE "segments_blocks_insights_hub_items_tags" CASCADE;
  DROP TABLE "segments_blocks_insights_hub_items_tags_locales" CASCADE;
  DROP TABLE "segments_blocks_insights_hub_items" CASCADE;
  DROP TABLE "segments_blocks_insights_hub_items_locales" CASCADE;
  DROP TABLE "segments_blocks_insights_hub" CASCADE;
  DROP TABLE "segments_blocks_insights_hub_locales" CASCADE;
  DROP TABLE "segments" CASCADE;
  DROP TABLE "segments_locales" CASCADE;
  DROP TABLE "segments_texts" CASCADE;
  DROP TABLE "segments_rels" CASCADE;
  DROP TABLE "_segments_v_blocks_page_hero_ctas" CASCADE;
  DROP TABLE "_segments_v_blocks_page_hero_ctas_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_page_hero_metrics" CASCADE;
  DROP TABLE "_segments_v_blocks_page_hero_metrics_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_page_hero" CASCADE;
  DROP TABLE "_segments_v_blocks_page_hero_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_sticky_page_nav" CASCADE;
  DROP TABLE "_segments_v_blocks_sticky_page_nav_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_stats_grid_custom_items" CASCADE;
  DROP TABLE "_segments_v_blocks_stats_grid_custom_items_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_stats_grid" CASCADE;
  DROP TABLE "_segments_v_blocks_stats_grid_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_rich_text_section_ctas" CASCADE;
  DROP TABLE "_segments_v_blocks_rich_text_section_ctas_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_rich_text_section" CASCADE;
  DROP TABLE "_segments_v_blocks_rich_text_section_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_icon_card_grid_items" CASCADE;
  DROP TABLE "_segments_v_blocks_icon_card_grid_items_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_icon_card_grid" CASCADE;
  DROP TABLE "_segments_v_blocks_icon_card_grid_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_value_cards_items_bullets" CASCADE;
  DROP TABLE "_segments_v_blocks_value_cards_items_bullets_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_value_cards_items" CASCADE;
  DROP TABLE "_segments_v_blocks_value_cards_items_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_value_cards" CASCADE;
  DROP TABLE "_segments_v_blocks_value_cards_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_partner_showcase" CASCADE;
  DROP TABLE "_segments_v_blocks_partner_showcase_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_seals_banner" CASCADE;
  DROP TABLE "_segments_v_blocks_seals_banner_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_process_steps_steps" CASCADE;
  DROP TABLE "_segments_v_blocks_process_steps_steps_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_process_steps" CASCADE;
  DROP TABLE "_segments_v_blocks_process_steps_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_method_cards_items_bullets" CASCADE;
  DROP TABLE "_segments_v_blocks_method_cards_items_bullets_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_method_cards_items" CASCADE;
  DROP TABLE "_segments_v_blocks_method_cards_items_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_method_cards" CASCADE;
  DROP TABLE "_segments_v_blocks_method_cards_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_bento_grid_items_metrics" CASCADE;
  DROP TABLE "_segments_v_blocks_bento_grid_items_metrics_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_bento_grid_items_tags" CASCADE;
  DROP TABLE "_segments_v_blocks_bento_grid_items_tags_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_bento_grid_items_bullets" CASCADE;
  DROP TABLE "_segments_v_blocks_bento_grid_items_bullets_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_bento_grid_items" CASCADE;
  DROP TABLE "_segments_v_blocks_bento_grid_items_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_bento_grid" CASCADE;
  DROP TABLE "_segments_v_blocks_bento_grid_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_audience_split_items" CASCADE;
  DROP TABLE "_segments_v_blocks_audience_split_items_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_audience_split" CASCADE;
  DROP TABLE "_segments_v_blocks_audience_split_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_accordion_steps_steps" CASCADE;
  DROP TABLE "_segments_v_blocks_accordion_steps_steps_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_accordion_steps" CASCADE;
  DROP TABLE "_segments_v_blocks_accordion_steps_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_cta_contact" CASCADE;
  DROP TABLE "_segments_v_blocks_cta_contact_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_jobs_list" CASCADE;
  DROP TABLE "_segments_v_blocks_jobs_list_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_cta_banner" CASCADE;
  DROP TABLE "_segments_v_blocks_cta_banner_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_partner_hero_awards" CASCADE;
  DROP TABLE "_segments_v_blocks_partner_hero_awards_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_partner_hero" CASCADE;
  DROP TABLE "_segments_v_blocks_partner_hero_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_partner_split_body" CASCADE;
  DROP TABLE "_segments_v_blocks_partner_split_body_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_partner_split_items" CASCADE;
  DROP TABLE "_segments_v_blocks_partner_split_items_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_partner_split" CASCADE;
  DROP TABLE "_segments_v_blocks_partner_split_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_home_hero" CASCADE;
  DROP TABLE "_segments_v_blocks_home_hero_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_logo_marquee_partners" CASCADE;
  DROP TABLE "_segments_v_blocks_logo_marquee" CASCADE;
  DROP TABLE "_segments_v_blocks_logo_marquee_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_feature_tabs_items" CASCADE;
  DROP TABLE "_segments_v_blocks_feature_tabs_items_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_feature_tabs" CASCADE;
  DROP TABLE "_segments_v_blocks_feature_tabs_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_home_bento_partner_card_items" CASCADE;
  DROP TABLE "_segments_v_blocks_home_bento_partner_card_items_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_home_bento_metrics" CASCADE;
  DROP TABLE "_segments_v_blocks_home_bento_metrics_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_home_bento" CASCADE;
  DROP TABLE "_segments_v_blocks_home_bento_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_case_carousel_items" CASCADE;
  DROP TABLE "_segments_v_blocks_case_carousel_items_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_case_carousel" CASCADE;
  DROP TABLE "_segments_v_blocks_case_carousel_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_testimonial_carousel" CASCADE;
  DROP TABLE "_segments_v_blocks_testimonial_carousel_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_content_teaser_cards" CASCADE;
  DROP TABLE "_segments_v_blocks_content_teaser_cards_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_content_teaser" CASCADE;
  DROP TABLE "_segments_v_blocks_content_teaser_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_insights_hub_formats" CASCADE;
  DROP TABLE "_segments_v_blocks_insights_hub_formats_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_insights_hub_items_tags" CASCADE;
  DROP TABLE "_segments_v_blocks_insights_hub_items_tags_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_insights_hub_items" CASCADE;
  DROP TABLE "_segments_v_blocks_insights_hub_items_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_insights_hub" CASCADE;
  DROP TABLE "_segments_v_blocks_insights_hub_locales" CASCADE;
  DROP TABLE "_segments_v" CASCADE;
  DROP TABLE "_segments_v_locales" CASCADE;
  DROP TABLE "_segments_v_texts" CASCADE;
  DROP TABLE "_segments_v_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_segments_fk";
  
  DROP INDEX "payload_locked_documents_rels_segments_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "segments_id";
  DROP TYPE "public"."enum_segments_blocks_page_hero_metrics_color";
  DROP TYPE "public"."enum_segments_blocks_page_hero_align";
  DROP TYPE "public"."enum_segments_blocks_page_hero_media_mode";
  DROP TYPE "public"."enum_segments_blocks_page_hero_cta_variant";
  DROP TYPE "public"."enum_segments_blocks_page_hero_description_width";
  DROP TYPE "public"."enum_segments_blocks_page_hero_borda";
  DROP TYPE "public"."enum_segments_blocks_page_hero_spacing";
  DROP TYPE "public"."enum_segments_blocks_page_hero_theme";
  DROP TYPE "public"."enum_segments_blocks_sticky_page_nav_variant";
  DROP TYPE "public"."enum_segments_blocks_sticky_page_nav_bottom_gap";
  DROP TYPE "public"."enum_segments_blocks_sticky_page_nav_borda";
  DROP TYPE "public"."enum_segments_blocks_sticky_page_nav_spacing";
  DROP TYPE "public"."enum_segments_blocks_sticky_page_nav_theme";
  DROP TYPE "public"."enum_segments_blocks_stats_grid_source";
  DROP TYPE "public"."enum_segments_blocks_stats_grid_borda";
  DROP TYPE "public"."enum_segments_blocks_stats_grid_spacing";
  DROP TYPE "public"."enum_segments_blocks_stats_grid_theme";
  DROP TYPE "public"."enum_segments_blocks_rich_text_section_header_layout";
  DROP TYPE "public"."enum_segments_blocks_rich_text_section_image_position";
  DROP TYPE "public"."enum_segments_blocks_rich_text_section_borda";
  DROP TYPE "public"."enum_segments_blocks_rich_text_section_spacing";
  DROP TYPE "public"."enum_segments_blocks_rich_text_section_theme";
  DROP TYPE "public"."enum_segments_blocks_icon_card_grid_items_icon";
  DROP TYPE "public"."enum_segments_blocks_icon_card_grid_columns";
  DROP TYPE "public"."enum_segments_blocks_icon_card_grid_variant";
  DROP TYPE "public"."enum_segments_blocks_icon_card_grid_header_width";
  DROP TYPE "public"."enum_segments_blocks_icon_card_grid_borda";
  DROP TYPE "public"."enum_segments_blocks_icon_card_grid_spacing";
  DROP TYPE "public"."enum_segments_blocks_icon_card_grid_theme";
  DROP TYPE "public"."enum_segments_blocks_value_cards_items_icon";
  DROP TYPE "public"."enum_segments_blocks_value_cards_items_glow_color";
  DROP TYPE "public"."enum_segments_blocks_value_cards_variant";
  DROP TYPE "public"."enum_segments_blocks_value_cards_borda";
  DROP TYPE "public"."enum_segments_blocks_value_cards_spacing";
  DROP TYPE "public"."enum_segments_blocks_value_cards_theme";
  DROP TYPE "public"."enum_segments_blocks_partner_showcase_borda";
  DROP TYPE "public"."enum_segments_blocks_partner_showcase_spacing";
  DROP TYPE "public"."enum_segments_blocks_partner_showcase_theme";
  DROP TYPE "public"."enum_segments_blocks_seals_banner_borda";
  DROP TYPE "public"."enum_segments_blocks_seals_banner_spacing";
  DROP TYPE "public"."enum_segments_blocks_seals_banner_theme";
  DROP TYPE "public"."enum_segments_blocks_process_steps_borda";
  DROP TYPE "public"."enum_segments_blocks_process_steps_spacing";
  DROP TYPE "public"."enum_segments_blocks_process_steps_theme";
  DROP TYPE "public"."enum_segments_blocks_method_cards_items_icon";
  DROP TYPE "public"."enum_segments_blocks_method_cards_items_accent";
  DROP TYPE "public"."enum_segments_blocks_method_cards_eyebrow_icon";
  DROP TYPE "public"."enum_segments_blocks_method_cards_borda";
  DROP TYPE "public"."enum_segments_blocks_method_cards_spacing";
  DROP TYPE "public"."enum_segments_blocks_method_cards_theme";
  DROP TYPE "public"."enum_segments_blocks_bento_grid_items_metrics_color";
  DROP TYPE "public"."enum_segments_blocks_bento_grid_items_span";
  DROP TYPE "public"."enum_segments_blocks_bento_grid_items_size";
  DROP TYPE "public"."enum_segments_blocks_bento_grid_items_accent";
  DROP TYPE "public"."enum_segments_blocks_bento_grid_items_icon";
  DROP TYPE "public"."enum_segments_blocks_bento_grid_items_footer_icon";
  DROP TYPE "public"."enum_segments_blocks_bento_grid_eyebrow_icon";
  DROP TYPE "public"."enum_segments_blocks_bento_grid_borda";
  DROP TYPE "public"."enum_segments_blocks_bento_grid_spacing";
  DROP TYPE "public"."enum_segments_blocks_bento_grid_theme";
  DROP TYPE "public"."enum_segments_blocks_audience_split_items_icon";
  DROP TYPE "public"."enum_segments_blocks_audience_split_items_accent";
  DROP TYPE "public"."enum_segments_blocks_audience_split_eyebrow_icon";
  DROP TYPE "public"."enum_segments_blocks_audience_split_borda";
  DROP TYPE "public"."enum_segments_blocks_audience_split_spacing";
  DROP TYPE "public"."enum_segments_blocks_audience_split_theme";
  DROP TYPE "public"."enum_segments_blocks_accordion_steps_eyebrow_icon";
  DROP TYPE "public"."enum_segments_blocks_accordion_steps_image_badge_icon";
  DROP TYPE "public"."enum_segments_blocks_accordion_steps_borda";
  DROP TYPE "public"."enum_segments_blocks_accordion_steps_spacing";
  DROP TYPE "public"."enum_segments_blocks_accordion_steps_theme";
  DROP TYPE "public"."enum_segments_blocks_cta_contact_variant";
  DROP TYPE "public"."enum_segments_blocks_cta_contact_borda";
  DROP TYPE "public"."enum_segments_blocks_cta_contact_spacing";
  DROP TYPE "public"."enum_segments_blocks_cta_contact_theme";
  DROP TYPE "public"."enum_segments_blocks_jobs_list_borda";
  DROP TYPE "public"."enum_segments_blocks_jobs_list_spacing";
  DROP TYPE "public"."enum_segments_blocks_jobs_list_theme";
  DROP TYPE "public"."enum_segments_blocks_cta_banner_variant";
  DROP TYPE "public"."enum_segments_blocks_cta_banner_borda";
  DROP TYPE "public"."enum_segments_blocks_cta_banner_spacing";
  DROP TYPE "public"."enum_segments_blocks_cta_banner_theme";
  DROP TYPE "public"."enum_segments_blocks_partner_hero_borda";
  DROP TYPE "public"."enum_segments_blocks_partner_hero_spacing";
  DROP TYPE "public"."enum_segments_blocks_partner_hero_theme";
  DROP TYPE "public"."enum_segments_blocks_partner_split_right_column";
  DROP TYPE "public"."enum_segments_blocks_partner_split_borda";
  DROP TYPE "public"."enum_segments_blocks_partner_split_spacing";
  DROP TYPE "public"."enum_segments_blocks_partner_split_theme";
  DROP TYPE "public"."enum_segments_blocks_home_hero_borda";
  DROP TYPE "public"."enum_segments_blocks_home_hero_spacing";
  DROP TYPE "public"."enum_segments_blocks_home_hero_theme";
  DROP TYPE "public"."enum_segments_blocks_logo_marquee_borda";
  DROP TYPE "public"."enum_segments_blocks_logo_marquee_spacing";
  DROP TYPE "public"."enum_segments_blocks_logo_marquee_theme";
  DROP TYPE "public"."enum_segments_blocks_feature_tabs_items_icon";
  DROP TYPE "public"."enum_segments_blocks_feature_tabs_borda";
  DROP TYPE "public"."enum_segments_blocks_feature_tabs_spacing";
  DROP TYPE "public"."enum_segments_blocks_feature_tabs_theme";
  DROP TYPE "public"."enum_segments_blocks_home_bento_metrics_icon";
  DROP TYPE "public"."enum_segments_blocks_home_bento_metrics_color";
  DROP TYPE "public"."enum_segments_blocks_home_bento_borda";
  DROP TYPE "public"."enum_segments_blocks_home_bento_spacing";
  DROP TYPE "public"."enum_segments_blocks_home_bento_theme";
  DROP TYPE "public"."enum_segments_blocks_case_carousel_items_icon";
  DROP TYPE "public"."enum_segments_blocks_case_carousel_borda";
  DROP TYPE "public"."enum_segments_blocks_case_carousel_spacing";
  DROP TYPE "public"."enum_segments_blocks_case_carousel_theme";
  DROP TYPE "public"."enum_segments_blocks_testimonial_carousel_borda";
  DROP TYPE "public"."enum_segments_blocks_testimonial_carousel_spacing";
  DROP TYPE "public"."enum_segments_blocks_testimonial_carousel_theme";
  DROP TYPE "public"."enum_segments_blocks_content_teaser_cards_icon";
  DROP TYPE "public"."enum_segments_blocks_content_teaser_cards_column";
  DROP TYPE "public"."enum_segments_blocks_content_teaser_borda";
  DROP TYPE "public"."enum_segments_blocks_content_teaser_spacing";
  DROP TYPE "public"."enum_segments_blocks_content_teaser_theme";
  DROP TYPE "public"."enum_segments_blocks_insights_hub_formats_icon";
  DROP TYPE "public"."enum_segments_blocks_insights_hub_borda";
  DROP TYPE "public"."enum_segments_blocks_insights_hub_spacing";
  DROP TYPE "public"."enum_segments_blocks_insights_hub_theme";
  DROP TYPE "public"."enum_segments_icon";
  DROP TYPE "public"."enum_segments_status";
  DROP TYPE "public"."enum__segments_v_blocks_page_hero_metrics_color";
  DROP TYPE "public"."enum__segments_v_blocks_page_hero_align";
  DROP TYPE "public"."enum__segments_v_blocks_page_hero_media_mode";
  DROP TYPE "public"."enum__segments_v_blocks_page_hero_cta_variant";
  DROP TYPE "public"."enum__segments_v_blocks_page_hero_description_width";
  DROP TYPE "public"."enum__segments_v_blocks_page_hero_borda";
  DROP TYPE "public"."enum__segments_v_blocks_page_hero_spacing";
  DROP TYPE "public"."enum__segments_v_blocks_page_hero_theme";
  DROP TYPE "public"."enum__segments_v_blocks_sticky_page_nav_variant";
  DROP TYPE "public"."enum__segments_v_blocks_sticky_page_nav_bottom_gap";
  DROP TYPE "public"."enum__segments_v_blocks_sticky_page_nav_borda";
  DROP TYPE "public"."enum__segments_v_blocks_sticky_page_nav_spacing";
  DROP TYPE "public"."enum__segments_v_blocks_sticky_page_nav_theme";
  DROP TYPE "public"."enum__segments_v_blocks_stats_grid_source";
  DROP TYPE "public"."enum__segments_v_blocks_stats_grid_borda";
  DROP TYPE "public"."enum__segments_v_blocks_stats_grid_spacing";
  DROP TYPE "public"."enum__segments_v_blocks_stats_grid_theme";
  DROP TYPE "public"."enum__segments_v_blocks_rich_text_section_header_layout";
  DROP TYPE "public"."enum__segments_v_blocks_rich_text_section_image_position";
  DROP TYPE "public"."enum__segments_v_blocks_rich_text_section_borda";
  DROP TYPE "public"."enum__segments_v_blocks_rich_text_section_spacing";
  DROP TYPE "public"."enum__segments_v_blocks_rich_text_section_theme";
  DROP TYPE "public"."enum__segments_v_blocks_icon_card_grid_items_icon";
  DROP TYPE "public"."enum__segments_v_blocks_icon_card_grid_columns";
  DROP TYPE "public"."enum__segments_v_blocks_icon_card_grid_variant";
  DROP TYPE "public"."enum__segments_v_blocks_icon_card_grid_header_width";
  DROP TYPE "public"."enum__segments_v_blocks_icon_card_grid_borda";
  DROP TYPE "public"."enum__segments_v_blocks_icon_card_grid_spacing";
  DROP TYPE "public"."enum__segments_v_blocks_icon_card_grid_theme";
  DROP TYPE "public"."enum__segments_v_blocks_value_cards_items_icon";
  DROP TYPE "public"."enum__segments_v_blocks_value_cards_items_glow_color";
  DROP TYPE "public"."enum__segments_v_blocks_value_cards_variant";
  DROP TYPE "public"."enum__segments_v_blocks_value_cards_borda";
  DROP TYPE "public"."enum__segments_v_blocks_value_cards_spacing";
  DROP TYPE "public"."enum__segments_v_blocks_value_cards_theme";
  DROP TYPE "public"."enum__segments_v_blocks_partner_showcase_borda";
  DROP TYPE "public"."enum__segments_v_blocks_partner_showcase_spacing";
  DROP TYPE "public"."enum__segments_v_blocks_partner_showcase_theme";
  DROP TYPE "public"."enum__segments_v_blocks_seals_banner_borda";
  DROP TYPE "public"."enum__segments_v_blocks_seals_banner_spacing";
  DROP TYPE "public"."enum__segments_v_blocks_seals_banner_theme";
  DROP TYPE "public"."enum__segments_v_blocks_process_steps_borda";
  DROP TYPE "public"."enum__segments_v_blocks_process_steps_spacing";
  DROP TYPE "public"."enum__segments_v_blocks_process_steps_theme";
  DROP TYPE "public"."enum__segments_v_blocks_method_cards_items_icon";
  DROP TYPE "public"."enum__segments_v_blocks_method_cards_items_accent";
  DROP TYPE "public"."enum__segments_v_blocks_method_cards_eyebrow_icon";
  DROP TYPE "public"."enum__segments_v_blocks_method_cards_borda";
  DROP TYPE "public"."enum__segments_v_blocks_method_cards_spacing";
  DROP TYPE "public"."enum__segments_v_blocks_method_cards_theme";
  DROP TYPE "public"."enum__segments_v_blocks_bento_grid_items_metrics_color";
  DROP TYPE "public"."enum__segments_v_blocks_bento_grid_items_span";
  DROP TYPE "public"."enum__segments_v_blocks_bento_grid_items_size";
  DROP TYPE "public"."enum__segments_v_blocks_bento_grid_items_accent";
  DROP TYPE "public"."enum__segments_v_blocks_bento_grid_items_icon";
  DROP TYPE "public"."enum__segments_v_blocks_bento_grid_items_footer_icon";
  DROP TYPE "public"."enum__segments_v_blocks_bento_grid_eyebrow_icon";
  DROP TYPE "public"."enum__segments_v_blocks_bento_grid_borda";
  DROP TYPE "public"."enum__segments_v_blocks_bento_grid_spacing";
  DROP TYPE "public"."enum__segments_v_blocks_bento_grid_theme";
  DROP TYPE "public"."enum__segments_v_blocks_audience_split_items_icon";
  DROP TYPE "public"."enum__segments_v_blocks_audience_split_items_accent";
  DROP TYPE "public"."enum__segments_v_blocks_audience_split_eyebrow_icon";
  DROP TYPE "public"."enum__segments_v_blocks_audience_split_borda";
  DROP TYPE "public"."enum__segments_v_blocks_audience_split_spacing";
  DROP TYPE "public"."enum__segments_v_blocks_audience_split_theme";
  DROP TYPE "public"."enum__segments_v_blocks_accordion_steps_eyebrow_icon";
  DROP TYPE "public"."enum__segments_v_blocks_accordion_steps_image_badge_icon";
  DROP TYPE "public"."enum__segments_v_blocks_accordion_steps_borda";
  DROP TYPE "public"."enum__segments_v_blocks_accordion_steps_spacing";
  DROP TYPE "public"."enum__segments_v_blocks_accordion_steps_theme";
  DROP TYPE "public"."enum__segments_v_blocks_cta_contact_variant";
  DROP TYPE "public"."enum__segments_v_blocks_cta_contact_borda";
  DROP TYPE "public"."enum__segments_v_blocks_cta_contact_spacing";
  DROP TYPE "public"."enum__segments_v_blocks_cta_contact_theme";
  DROP TYPE "public"."enum__segments_v_blocks_jobs_list_borda";
  DROP TYPE "public"."enum__segments_v_blocks_jobs_list_spacing";
  DROP TYPE "public"."enum__segments_v_blocks_jobs_list_theme";
  DROP TYPE "public"."enum__segments_v_blocks_cta_banner_variant";
  DROP TYPE "public"."enum__segments_v_blocks_cta_banner_borda";
  DROP TYPE "public"."enum__segments_v_blocks_cta_banner_spacing";
  DROP TYPE "public"."enum__segments_v_blocks_cta_banner_theme";
  DROP TYPE "public"."enum__segments_v_blocks_partner_hero_borda";
  DROP TYPE "public"."enum__segments_v_blocks_partner_hero_spacing";
  DROP TYPE "public"."enum__segments_v_blocks_partner_hero_theme";
  DROP TYPE "public"."enum__segments_v_blocks_partner_split_right_column";
  DROP TYPE "public"."enum__segments_v_blocks_partner_split_borda";
  DROP TYPE "public"."enum__segments_v_blocks_partner_split_spacing";
  DROP TYPE "public"."enum__segments_v_blocks_partner_split_theme";
  DROP TYPE "public"."enum__segments_v_blocks_home_hero_borda";
  DROP TYPE "public"."enum__segments_v_blocks_home_hero_spacing";
  DROP TYPE "public"."enum__segments_v_blocks_home_hero_theme";
  DROP TYPE "public"."enum__segments_v_blocks_logo_marquee_borda";
  DROP TYPE "public"."enum__segments_v_blocks_logo_marquee_spacing";
  DROP TYPE "public"."enum__segments_v_blocks_logo_marquee_theme";
  DROP TYPE "public"."enum__segments_v_blocks_feature_tabs_items_icon";
  DROP TYPE "public"."enum__segments_v_blocks_feature_tabs_borda";
  DROP TYPE "public"."enum__segments_v_blocks_feature_tabs_spacing";
  DROP TYPE "public"."enum__segments_v_blocks_feature_tabs_theme";
  DROP TYPE "public"."enum__segments_v_blocks_home_bento_metrics_icon";
  DROP TYPE "public"."enum__segments_v_blocks_home_bento_metrics_color";
  DROP TYPE "public"."enum__segments_v_blocks_home_bento_borda";
  DROP TYPE "public"."enum__segments_v_blocks_home_bento_spacing";
  DROP TYPE "public"."enum__segments_v_blocks_home_bento_theme";
  DROP TYPE "public"."enum__segments_v_blocks_case_carousel_items_icon";
  DROP TYPE "public"."enum__segments_v_blocks_case_carousel_borda";
  DROP TYPE "public"."enum__segments_v_blocks_case_carousel_spacing";
  DROP TYPE "public"."enum__segments_v_blocks_case_carousel_theme";
  DROP TYPE "public"."enum__segments_v_blocks_testimonial_carousel_borda";
  DROP TYPE "public"."enum__segments_v_blocks_testimonial_carousel_spacing";
  DROP TYPE "public"."enum__segments_v_blocks_testimonial_carousel_theme";
  DROP TYPE "public"."enum__segments_v_blocks_content_teaser_cards_icon";
  DROP TYPE "public"."enum__segments_v_blocks_content_teaser_cards_column";
  DROP TYPE "public"."enum__segments_v_blocks_content_teaser_borda";
  DROP TYPE "public"."enum__segments_v_blocks_content_teaser_spacing";
  DROP TYPE "public"."enum__segments_v_blocks_content_teaser_theme";
  DROP TYPE "public"."enum__segments_v_blocks_insights_hub_formats_icon";
  DROP TYPE "public"."enum__segments_v_blocks_insights_hub_borda";
  DROP TYPE "public"."enum__segments_v_blocks_insights_hub_spacing";
  DROP TYPE "public"."enum__segments_v_blocks_insights_hub_theme";
  DROP TYPE "public"."enum__segments_v_version_icon";
  DROP TYPE "public"."enum__segments_v_version_status";
  DROP TYPE "public"."enum__segments_v_published_locale";`)
}
