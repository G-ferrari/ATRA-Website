import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/* ⚠️ Migração **fora de ordem de propósito**, idempotente: as tabelas do GEO
 * (D-80, 29/10) criadas **antes** da primeira migração de dados.
 *
 * Duas portas da mesma armadilha do CLAUDE.md:
 *  - a seção "Perguntas frequentes" entra no catálogo de `pages`, `solutions`,
 *    `segments` e `partners`, e o adapter faz um JOIN em cada tabela de bloco
 *    a cada consulta a essas collections;
 *  - a collection `authors` ganha coluna em `payload_locked_documents_rels`, e
 *    a relação `posts.authors` cria `posts_rels`, que toda consulta a `posts`
 *    lê — e as migrações de dados antigas leem posts e páginas pela Local API
 *    com o config de hoje.
 *
 * Em banco novo, sem isto, elas morreriam em "relation does not exist". Aqui
 * as chaves estrangeiras podem ir junto (ao contrário da seção Formulário): a
 * única tabela nova referenciada é `authors`, que nasce aqui mesmo.
 *
 * `20261029_192622_geo_faq_e_autores` repete tudo — é o retrato `.json` que o
 * gerador compara — e, por ser idempotente, não faz nada onde esta já rodou. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN
    CREATE TYPE "public"."enum_pages_blocks_faq_section_eyebrow_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset', 'pie-chart', 'line-chart', 'gauge', 'layers', 'network', 'git-branch', 'bot', 'brain-circuit', 'wand', 'scan-search', 'database-zap', 'table', 'file-spreadsheet', 'blocks', 'waypoints', 'laptop', 'refresh', 'funnel', 'lightbulb', 'puzzle', 'handshake', 'goal', 'compass', 'route', 'map', 'globe', 'presentation', 'megaphone', 'wallet', 'dollar', 'trophy', 'badge-check', 'list-checks', 'clipboard-check', 'check-circle', 'clock', 'calendar', 'timer', 'users-round', 'user-cog', 'message-square', 'mail', 'phone', 'key', 'fingerprint', 'eye', 'scale', 'file-check', 'alert', 'landmark', 'factory', 'store', 'shopping-cart', 'truck', 'plane', 'hospital', 'stethoscope', 'heart-pulse', 'microscope', 'wheat', 'leaf', 'plug', 'radio-tower', 'umbrella');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_pages_blocks_faq_section_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_pages_blocks_faq_section_spacing" AS ENUM('normal', 'roomy');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_pages_blocks_faq_section_theme" AS ENUM('surface-1', 'surface-2');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__pages_v_blocks_faq_section_eyebrow_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset', 'pie-chart', 'line-chart', 'gauge', 'layers', 'network', 'git-branch', 'bot', 'brain-circuit', 'wand', 'scan-search', 'database-zap', 'table', 'file-spreadsheet', 'blocks', 'waypoints', 'laptop', 'refresh', 'funnel', 'lightbulb', 'puzzle', 'handshake', 'goal', 'compass', 'route', 'map', 'globe', 'presentation', 'megaphone', 'wallet', 'dollar', 'trophy', 'badge-check', 'list-checks', 'clipboard-check', 'check-circle', 'clock', 'calendar', 'timer', 'users-round', 'user-cog', 'message-square', 'mail', 'phone', 'key', 'fingerprint', 'eye', 'scale', 'file-check', 'alert', 'landmark', 'factory', 'store', 'shopping-cart', 'truck', 'plane', 'hospital', 'stethoscope', 'heart-pulse', 'microscope', 'wheat', 'leaf', 'plug', 'radio-tower', 'umbrella');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__pages_v_blocks_faq_section_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__pages_v_blocks_faq_section_spacing" AS ENUM('normal', 'roomy');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__pages_v_blocks_faq_section_theme" AS ENUM('surface-1', 'surface-2');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_partners_blocks_faq_section_eyebrow_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset', 'pie-chart', 'line-chart', 'gauge', 'layers', 'network', 'git-branch', 'bot', 'brain-circuit', 'wand', 'scan-search', 'database-zap', 'table', 'file-spreadsheet', 'blocks', 'waypoints', 'laptop', 'refresh', 'funnel', 'lightbulb', 'puzzle', 'handshake', 'goal', 'compass', 'route', 'map', 'globe', 'presentation', 'megaphone', 'wallet', 'dollar', 'trophy', 'badge-check', 'list-checks', 'clipboard-check', 'check-circle', 'clock', 'calendar', 'timer', 'users-round', 'user-cog', 'message-square', 'mail', 'phone', 'key', 'fingerprint', 'eye', 'scale', 'file-check', 'alert', 'landmark', 'factory', 'store', 'shopping-cart', 'truck', 'plane', 'hospital', 'stethoscope', 'heart-pulse', 'microscope', 'wheat', 'leaf', 'plug', 'radio-tower', 'umbrella');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_partners_blocks_faq_section_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_partners_blocks_faq_section_spacing" AS ENUM('normal', 'roomy');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_partners_blocks_faq_section_theme" AS ENUM('surface-1', 'surface-2');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_segments_blocks_faq_section_eyebrow_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset', 'pie-chart', 'line-chart', 'gauge', 'layers', 'network', 'git-branch', 'bot', 'brain-circuit', 'wand', 'scan-search', 'database-zap', 'table', 'file-spreadsheet', 'blocks', 'waypoints', 'laptop', 'refresh', 'funnel', 'lightbulb', 'puzzle', 'handshake', 'goal', 'compass', 'route', 'map', 'globe', 'presentation', 'megaphone', 'wallet', 'dollar', 'trophy', 'badge-check', 'list-checks', 'clipboard-check', 'check-circle', 'clock', 'calendar', 'timer', 'users-round', 'user-cog', 'message-square', 'mail', 'phone', 'key', 'fingerprint', 'eye', 'scale', 'file-check', 'alert', 'landmark', 'factory', 'store', 'shopping-cart', 'truck', 'plane', 'hospital', 'stethoscope', 'heart-pulse', 'microscope', 'wheat', 'leaf', 'plug', 'radio-tower', 'umbrella');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_segments_blocks_faq_section_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_segments_blocks_faq_section_spacing" AS ENUM('normal', 'roomy');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_segments_blocks_faq_section_theme" AS ENUM('surface-1', 'surface-2');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__segments_v_blocks_faq_section_eyebrow_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset', 'pie-chart', 'line-chart', 'gauge', 'layers', 'network', 'git-branch', 'bot', 'brain-circuit', 'wand', 'scan-search', 'database-zap', 'table', 'file-spreadsheet', 'blocks', 'waypoints', 'laptop', 'refresh', 'funnel', 'lightbulb', 'puzzle', 'handshake', 'goal', 'compass', 'route', 'map', 'globe', 'presentation', 'megaphone', 'wallet', 'dollar', 'trophy', 'badge-check', 'list-checks', 'clipboard-check', 'check-circle', 'clock', 'calendar', 'timer', 'users-round', 'user-cog', 'message-square', 'mail', 'phone', 'key', 'fingerprint', 'eye', 'scale', 'file-check', 'alert', 'landmark', 'factory', 'store', 'shopping-cart', 'truck', 'plane', 'hospital', 'stethoscope', 'heart-pulse', 'microscope', 'wheat', 'leaf', 'plug', 'radio-tower', 'umbrella');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__segments_v_blocks_faq_section_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__segments_v_blocks_faq_section_spacing" AS ENUM('normal', 'roomy');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__segments_v_blocks_faq_section_theme" AS ENUM('surface-1', 'surface-2');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_solutions_blocks_faq_section_eyebrow_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset', 'pie-chart', 'line-chart', 'gauge', 'layers', 'network', 'git-branch', 'bot', 'brain-circuit', 'wand', 'scan-search', 'database-zap', 'table', 'file-spreadsheet', 'blocks', 'waypoints', 'laptop', 'refresh', 'funnel', 'lightbulb', 'puzzle', 'handshake', 'goal', 'compass', 'route', 'map', 'globe', 'presentation', 'megaphone', 'wallet', 'dollar', 'trophy', 'badge-check', 'list-checks', 'clipboard-check', 'check-circle', 'clock', 'calendar', 'timer', 'users-round', 'user-cog', 'message-square', 'mail', 'phone', 'key', 'fingerprint', 'eye', 'scale', 'file-check', 'alert', 'landmark', 'factory', 'store', 'shopping-cart', 'truck', 'plane', 'hospital', 'stethoscope', 'heart-pulse', 'microscope', 'wheat', 'leaf', 'plug', 'radio-tower', 'umbrella');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_solutions_blocks_faq_section_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_solutions_blocks_faq_section_spacing" AS ENUM('normal', 'roomy');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_solutions_blocks_faq_section_theme" AS ENUM('surface-1', 'surface-2');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__solutions_v_blocks_faq_section_eyebrow_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset', 'pie-chart', 'line-chart', 'gauge', 'layers', 'network', 'git-branch', 'bot', 'brain-circuit', 'wand', 'scan-search', 'database-zap', 'table', 'file-spreadsheet', 'blocks', 'waypoints', 'laptop', 'refresh', 'funnel', 'lightbulb', 'puzzle', 'handshake', 'goal', 'compass', 'route', 'map', 'globe', 'presentation', 'megaphone', 'wallet', 'dollar', 'trophy', 'badge-check', 'list-checks', 'clipboard-check', 'check-circle', 'clock', 'calendar', 'timer', 'users-round', 'user-cog', 'message-square', 'mail', 'phone', 'key', 'fingerprint', 'eye', 'scale', 'file-check', 'alert', 'landmark', 'factory', 'store', 'shopping-cart', 'truck', 'plane', 'hospital', 'stethoscope', 'heart-pulse', 'microscope', 'wheat', 'leaf', 'plug', 'radio-tower', 'umbrella');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__solutions_v_blocks_faq_section_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__solutions_v_blocks_faq_section_spacing" AS ENUM('normal', 'roomy');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__solutions_v_blocks_faq_section_theme" AS ENUM('surface-1', 'surface-2');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  CREATE TABLE IF NOT EXISTS "authors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"profile_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  CREATE TABLE IF NOT EXISTS "authors_locales" (
  	"job_title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_faq_section_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_faq_section_items_locales" (
  	"question" varchar,
  	"answer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_faq_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow_icon" "enum_pages_blocks_faq_section_eyebrow_icon",
  	"anchor" varchar,
  	"borda" "enum_pages_blocks_faq_section_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_pages_blocks_faq_section_spacing" DEFAULT 'normal',
  	"theme" "enum_pages_blocks_faq_section_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_faq_section_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_faq_section_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_faq_section_items_locales" (
  	"question" varchar,
  	"answer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_faq_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow_icon" "enum__pages_v_blocks_faq_section_eyebrow_icon",
  	"anchor" varchar,
  	"borda" "enum__pages_v_blocks_faq_section_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__pages_v_blocks_faq_section_spacing" DEFAULT 'normal',
  	"theme" "enum__pages_v_blocks_faq_section_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_faq_section_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  CREATE TABLE IF NOT EXISTS "posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"authors_id" integer
  );
  CREATE TABLE IF NOT EXISTS "_posts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"authors_id" integer
  );
  CREATE TABLE IF NOT EXISTS "partners_blocks_faq_section_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  CREATE TABLE IF NOT EXISTS "partners_blocks_faq_section_items_locales" (
  	"question" varchar,
  	"answer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  CREATE TABLE IF NOT EXISTS "partners_blocks_faq_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow_icon" "enum_partners_blocks_faq_section_eyebrow_icon",
  	"anchor" varchar,
  	"borda" "enum_partners_blocks_faq_section_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_partners_blocks_faq_section_spacing" DEFAULT 'normal',
  	"theme" "enum_partners_blocks_faq_section_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "partners_blocks_faq_section_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  CREATE TABLE IF NOT EXISTS "segments_blocks_faq_section_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  CREATE TABLE IF NOT EXISTS "segments_blocks_faq_section_items_locales" (
  	"question" varchar,
  	"answer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  CREATE TABLE IF NOT EXISTS "segments_blocks_faq_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow_icon" "enum_segments_blocks_faq_section_eyebrow_icon",
  	"anchor" varchar,
  	"borda" "enum_segments_blocks_faq_section_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_segments_blocks_faq_section_spacing" DEFAULT 'normal',
  	"theme" "enum_segments_blocks_faq_section_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "segments_blocks_faq_section_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  CREATE TABLE IF NOT EXISTS "_segments_v_blocks_faq_section_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  CREATE TABLE IF NOT EXISTS "_segments_v_blocks_faq_section_items_locales" (
  	"question" varchar,
  	"answer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  CREATE TABLE IF NOT EXISTS "_segments_v_blocks_faq_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow_icon" "enum__segments_v_blocks_faq_section_eyebrow_icon",
  	"anchor" varchar,
  	"borda" "enum__segments_v_blocks_faq_section_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__segments_v_blocks_faq_section_spacing" DEFAULT 'normal',
  	"theme" "enum__segments_v_blocks_faq_section_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "_segments_v_blocks_faq_section_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  CREATE TABLE IF NOT EXISTS "solutions_blocks_faq_section_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  CREATE TABLE IF NOT EXISTS "solutions_blocks_faq_section_items_locales" (
  	"question" varchar,
  	"answer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  CREATE TABLE IF NOT EXISTS "solutions_blocks_faq_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow_icon" "enum_solutions_blocks_faq_section_eyebrow_icon",
  	"anchor" varchar,
  	"borda" "enum_solutions_blocks_faq_section_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_solutions_blocks_faq_section_spacing" DEFAULT 'normal',
  	"theme" "enum_solutions_blocks_faq_section_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "solutions_blocks_faq_section_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  CREATE TABLE IF NOT EXISTS "_solutions_v_blocks_faq_section_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  CREATE TABLE IF NOT EXISTS "_solutions_v_blocks_faq_section_items_locales" (
  	"question" varchar,
  	"answer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  CREATE TABLE IF NOT EXISTS "_solutions_v_blocks_faq_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow_icon" "enum__solutions_v_blocks_faq_section_eyebrow_icon",
  	"anchor" varchar,
  	"borda" "enum__solutions_v_blocks_faq_section_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__solutions_v_blocks_faq_section_spacing" DEFAULT 'normal',
  	"theme" "enum__solutions_v_blocks_faq_section_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "_solutions_v_blocks_faq_section_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "authors_id" integer;
  DO $$ BEGIN
    ALTER TABLE "authors_locales" ADD CONSTRAINT "authors_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "pages_blocks_faq_section_items" ADD CONSTRAINT "pages_blocks_faq_section_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq_section"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "pages_blocks_faq_section_items_locales" ADD CONSTRAINT "pages_blocks_faq_section_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq_section_items"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "pages_blocks_faq_section" ADD CONSTRAINT "pages_blocks_faq_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "pages_blocks_faq_section_locales" ADD CONSTRAINT "pages_blocks_faq_section_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq_section"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "_pages_v_blocks_faq_section_items" ADD CONSTRAINT "_pages_v_blocks_faq_section_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq_section"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "_pages_v_blocks_faq_section_items_locales" ADD CONSTRAINT "_pages_v_blocks_faq_section_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq_section_items"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "_pages_v_blocks_faq_section" ADD CONSTRAINT "_pages_v_blocks_faq_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "_pages_v_blocks_faq_section_locales" ADD CONSTRAINT "_pages_v_blocks_faq_section_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq_section"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_authors_fk" FOREIGN KEY ("authors_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_authors_fk" FOREIGN KEY ("authors_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "partners_blocks_faq_section_items" ADD CONSTRAINT "partners_blocks_faq_section_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_faq_section"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "partners_blocks_faq_section_items_locales" ADD CONSTRAINT "partners_blocks_faq_section_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_faq_section_items"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "partners_blocks_faq_section" ADD CONSTRAINT "partners_blocks_faq_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "partners_blocks_faq_section_locales" ADD CONSTRAINT "partners_blocks_faq_section_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_faq_section"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "segments_blocks_faq_section_items" ADD CONSTRAINT "segments_blocks_faq_section_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_faq_section"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "segments_blocks_faq_section_items_locales" ADD CONSTRAINT "segments_blocks_faq_section_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_faq_section_items"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "segments_blocks_faq_section" ADD CONSTRAINT "segments_blocks_faq_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "segments_blocks_faq_section_locales" ADD CONSTRAINT "segments_blocks_faq_section_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_faq_section"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "_segments_v_blocks_faq_section_items" ADD CONSTRAINT "_segments_v_blocks_faq_section_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_faq_section"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "_segments_v_blocks_faq_section_items_locales" ADD CONSTRAINT "_segments_v_blocks_faq_section_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_faq_section_items"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "_segments_v_blocks_faq_section" ADD CONSTRAINT "_segments_v_blocks_faq_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "_segments_v_blocks_faq_section_locales" ADD CONSTRAINT "_segments_v_blocks_faq_section_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_faq_section"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "solutions_blocks_faq_section_items" ADD CONSTRAINT "solutions_blocks_faq_section_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_faq_section"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "solutions_blocks_faq_section_items_locales" ADD CONSTRAINT "solutions_blocks_faq_section_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_faq_section_items"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "solutions_blocks_faq_section" ADD CONSTRAINT "solutions_blocks_faq_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "solutions_blocks_faq_section_locales" ADD CONSTRAINT "solutions_blocks_faq_section_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_faq_section"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "_solutions_v_blocks_faq_section_items" ADD CONSTRAINT "_solutions_v_blocks_faq_section_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_faq_section"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "_solutions_v_blocks_faq_section_items_locales" ADD CONSTRAINT "_solutions_v_blocks_faq_section_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_faq_section_items"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "_solutions_v_blocks_faq_section" ADD CONSTRAINT "_solutions_v_blocks_faq_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "_solutions_v_blocks_faq_section_locales" ADD CONSTRAINT "_solutions_v_blocks_faq_section_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_faq_section"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  CREATE INDEX IF NOT EXISTS "authors_updated_at_idx" ON "authors" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "authors_created_at_idx" ON "authors" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "authors_locales_locale_parent_id_unique" ON "authors_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_faq_section_items_order_idx" ON "pages_blocks_faq_section_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_faq_section_items_parent_id_idx" ON "pages_blocks_faq_section_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "pages_blocks_faq_section_items_locales_locale_parent_id_uniq" ON "pages_blocks_faq_section_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_faq_section_order_idx" ON "pages_blocks_faq_section" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_faq_section_parent_id_idx" ON "pages_blocks_faq_section" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_faq_section_path_idx" ON "pages_blocks_faq_section" USING btree ("_path");
  CREATE UNIQUE INDEX IF NOT EXISTS "pages_blocks_faq_section_locales_locale_parent_id_unique" ON "pages_blocks_faq_section_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_faq_section_items_order_idx" ON "_pages_v_blocks_faq_section_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_faq_section_items_parent_id_idx" ON "_pages_v_blocks_faq_section_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "_pages_v_blocks_faq_section_items_locales_locale_parent_id_u" ON "_pages_v_blocks_faq_section_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_faq_section_order_idx" ON "_pages_v_blocks_faq_section" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_faq_section_parent_id_idx" ON "_pages_v_blocks_faq_section" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_faq_section_path_idx" ON "_pages_v_blocks_faq_section" USING btree ("_path");
  CREATE UNIQUE INDEX IF NOT EXISTS "_pages_v_blocks_faq_section_locales_locale_parent_id_unique" ON "_pages_v_blocks_faq_section_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "posts_rels_order_idx" ON "posts_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "posts_rels_parent_idx" ON "posts_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "posts_rels_path_idx" ON "posts_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "posts_rels_authors_id_idx" ON "posts_rels" USING btree ("authors_id");
  CREATE INDEX IF NOT EXISTS "_posts_v_rels_order_idx" ON "_posts_v_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "_posts_v_rels_parent_idx" ON "_posts_v_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_posts_v_rels_path_idx" ON "_posts_v_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "_posts_v_rels_authors_id_idx" ON "_posts_v_rels" USING btree ("authors_id");
  CREATE INDEX IF NOT EXISTS "partners_blocks_faq_section_items_order_idx" ON "partners_blocks_faq_section_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "partners_blocks_faq_section_items_parent_id_idx" ON "partners_blocks_faq_section_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "partners_blocks_faq_section_items_locales_locale_parent_id_u" ON "partners_blocks_faq_section_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "partners_blocks_faq_section_order_idx" ON "partners_blocks_faq_section" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "partners_blocks_faq_section_parent_id_idx" ON "partners_blocks_faq_section" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "partners_blocks_faq_section_path_idx" ON "partners_blocks_faq_section" USING btree ("_path");
  CREATE UNIQUE INDEX IF NOT EXISTS "partners_blocks_faq_section_locales_locale_parent_id_unique" ON "partners_blocks_faq_section_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "segments_blocks_faq_section_items_order_idx" ON "segments_blocks_faq_section_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "segments_blocks_faq_section_items_parent_id_idx" ON "segments_blocks_faq_section_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "segments_blocks_faq_section_items_locales_locale_parent_id_u" ON "segments_blocks_faq_section_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "segments_blocks_faq_section_order_idx" ON "segments_blocks_faq_section" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "segments_blocks_faq_section_parent_id_idx" ON "segments_blocks_faq_section" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "segments_blocks_faq_section_path_idx" ON "segments_blocks_faq_section" USING btree ("_path");
  CREATE UNIQUE INDEX IF NOT EXISTS "segments_blocks_faq_section_locales_locale_parent_id_unique" ON "segments_blocks_faq_section_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "_segments_v_blocks_faq_section_items_order_idx" ON "_segments_v_blocks_faq_section_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_segments_v_blocks_faq_section_items_parent_id_idx" ON "_segments_v_blocks_faq_section_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "_segments_v_blocks_faq_section_items_locales_locale_parent_i" ON "_segments_v_blocks_faq_section_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "_segments_v_blocks_faq_section_order_idx" ON "_segments_v_blocks_faq_section" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_segments_v_blocks_faq_section_parent_id_idx" ON "_segments_v_blocks_faq_section" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_segments_v_blocks_faq_section_path_idx" ON "_segments_v_blocks_faq_section" USING btree ("_path");
  CREATE UNIQUE INDEX IF NOT EXISTS "_segments_v_blocks_faq_section_locales_locale_parent_id_uniq" ON "_segments_v_blocks_faq_section_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "solutions_blocks_faq_section_items_order_idx" ON "solutions_blocks_faq_section_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "solutions_blocks_faq_section_items_parent_id_idx" ON "solutions_blocks_faq_section_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "solutions_blocks_faq_section_items_locales_locale_parent_id_" ON "solutions_blocks_faq_section_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "solutions_blocks_faq_section_order_idx" ON "solutions_blocks_faq_section" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "solutions_blocks_faq_section_parent_id_idx" ON "solutions_blocks_faq_section" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "solutions_blocks_faq_section_path_idx" ON "solutions_blocks_faq_section" USING btree ("_path");
  CREATE UNIQUE INDEX IF NOT EXISTS "solutions_blocks_faq_section_locales_locale_parent_id_unique" ON "solutions_blocks_faq_section_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "_solutions_v_blocks_faq_section_items_order_idx" ON "_solutions_v_blocks_faq_section_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_solutions_v_blocks_faq_section_items_parent_id_idx" ON "_solutions_v_blocks_faq_section_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "_solutions_v_blocks_faq_section_items_locales_locale_parent_" ON "_solutions_v_blocks_faq_section_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "_solutions_v_blocks_faq_section_order_idx" ON "_solutions_v_blocks_faq_section" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_solutions_v_blocks_faq_section_parent_id_idx" ON "_solutions_v_blocks_faq_section" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_solutions_v_blocks_faq_section_path_idx" ON "_solutions_v_blocks_faq_section" USING btree ("_path");
  CREATE UNIQUE INDEX IF NOT EXISTS "_solutions_v_blocks_faq_section_locales_locale_parent_id_uni" ON "_solutions_v_blocks_faq_section_locales" USING btree ("_locale","_parent_id");
  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_authors_fk" FOREIGN KEY ("authors_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_authors_id_idx" ON "payload_locked_documents_rels" USING btree ("authors_id");
  `)
}

/* A volta é a de 20261029_192622_geo_faq_e_autores, que apaga as tabelas. */
export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.warn('[geo-antecipada] as tabelas são desfeitas por 20261029_192622_geo_faq_e_autores')
}
