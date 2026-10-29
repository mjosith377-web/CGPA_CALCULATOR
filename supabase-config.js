
const SUPABASE_URL = "https://eksgqomvqcxwzggzgogz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_3yUd5-x9kripS1wwCHILYA__b8_m49x";

window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);
