import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bzxrjreyjaiymnzwxmro.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6eHJqcmV5amFpeW1uend4bXJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzMjA5NDMsImV4cCI6MjA5NTg5Njk0M30.5jxVNeAIGBjE9CzZb0ngkEwEtgmANEIl59CjK-I7QLg'

export const supabase = createClient(supabaseUrl, supabaseKey)
