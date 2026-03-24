import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lywpvjvqbeqtgswubhcv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5d3B2anZxYmVxdGdzd3ViaGN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMDMxMTcsImV4cCI6MjA4OTg3OTExN30.D78i-7ZFZe3QbLjUKqwTQOEFHbZXdsLWZ5IvjgJUCLQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
