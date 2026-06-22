const SUPABASE_URL = "https://nzkbgcmgkwzjkppoqriy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_4cMWXMw5P9yjtr-O9536LQ_-hjf8362";
const SUPABASE_PROJECT_NAME = "Codex Website";

window.vohraSupabaseProject = SUPABASE_PROJECT_NAME;

if (window.supabase?.createClient) {
  window.vohraSupabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );
}
