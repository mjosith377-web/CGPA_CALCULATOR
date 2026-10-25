
const SUPABASE_URL = "https://nxrfzpsbvrsvntowbajj.supabase.co/rest/v1/";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_t8kaAS-jqiTlBz_K_V15kg_ttEC6GSa";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

let latestResults = null;
