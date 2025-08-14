-- Fix function search path security issue
ALTER FUNCTION public.cleanup_old_performance_metrics() SET search_path = public, pg_catalog;