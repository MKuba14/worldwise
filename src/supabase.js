import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://imfnjjonkttkmdlovshi.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltZm5qam9ua3R0a21kbG92c2hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc4OTc1NzYsImV4cCI6MjAyMzQ3MzU3Nn0.MlyVspKU8P96LzeRcgQILTr4xbddj18jG1LEaIHFgZw";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
