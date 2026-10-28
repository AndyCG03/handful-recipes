-- Esquema inicial Handful Recipes
create table recipes (
  id uuid primary key default gen_random_uuid(),
  title text,
  cook_name text,
  video_path text not null,
  share_slug text unique,
  status text not null default 'uploaded', -- uploaded | processing | review | published | failed
  created_at timestamptz default now()
);

create table transcript_turns (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid references recipes on delete cascade,
  speaker text, start_sec real, end_sec real, text text
);

create table steps (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid references recipes on delete cascade,
  position int not null,
  action text not null,
  ingredients text[] default '{}',
  start_sec real, end_sec real,
  clip_path text,
  informal_measure text,      -- frase literal ("un puñito")
  mask_clip_path text         -- clip con máscara SAM
);

create table gaps (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid references recipes on delete cascade,
  step_id uuid references steps on delete cascade,
  kind text, question text not null,
  status text not null default 'open', -- open | sent | answered | dismissed
  answer_token text unique,
  answer_audio_path text, answer_transcript text
);

create table model_runs (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid references recipes on delete cascade,
  stage text, model text, input_ref text, output jsonb,
  created_at timestamptz default now()
);
