-- Create google_analytics_settings table
CREATE TABLE IF NOT EXISTS public.google_analytics_settings (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id text NOT NULL DEFAULT 'admin',
    measurement_id text,
    enabled boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.google_analytics_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Enable all operations for authenticated users" ON public.google_analytics_settings
    FOR ALL USING (auth.uid() IS NOT NULL);

-- Create updated_at trigger
CREATE TRIGGER update_google_analytics_settings_updated_at
    BEFORE UPDATE ON public.google_analytics_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default settings
INSERT INTO public.google_analytics_settings (user_id, measurement_id, enabled)
VALUES ('admin', NULL, false)
ON CONFLICT (user_id) DO NOTHING; 