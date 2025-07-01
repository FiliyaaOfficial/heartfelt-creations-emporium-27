
-- Create the keep_alive function that the edge function is trying to call
CREATE OR REPLACE FUNCTION public.keep_alive()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Simple function that returns a timestamp to keep the connection alive
  RETURN 'Keep alive successful at ' || now()::text;
END;
$function$
