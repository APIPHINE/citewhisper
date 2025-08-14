-- Create table for performance metrics tracking
CREATE TABLE IF NOT EXISTS public.performance_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  metric_type TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  page_url TEXT,
  user_agent TEXT,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own metrics" 
ON public.performance_metrics 
FOR SELECT 
USING (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "System can insert metrics" 
ON public.performance_metrics 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all metrics" 
ON public.performance_metrics 
FOR ALL 
USING (has_privilege_level(auth.uid(), 'admin'::user_privilege));

-- Create indexes for better performance
CREATE INDEX idx_performance_metrics_user_id ON public.performance_metrics(user_id);
CREATE INDEX idx_performance_metrics_created_at ON public.performance_metrics(created_at);
CREATE INDEX idx_performance_metrics_type ON public.performance_metrics(metric_type);

-- Create function to clean old performance data (retention policy)
CREATE OR REPLACE FUNCTION public.cleanup_old_performance_metrics()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.performance_metrics 
  WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$;