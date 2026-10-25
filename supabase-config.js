
const SUPABASE_URL = "https://pkwuksqgwvlbjrhxeodt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable__RPOVX9jdN4_ikNvHDwQIQ_X5ZNTpX-";

window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);
