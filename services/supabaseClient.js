// services/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rzzmcluceplcovvixock.supabase.co/';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6em1jbHVjZXBsY292dml4b2NrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA5NTIyNTksImV4cCI6MjA0NjUyODI1OX0.wf6LqLc75Rz5BpgTOFER4FpVFOnpIADcEqvjOwPa164';

export const supabase = createClient(supabaseUrl, supabaseKey);
