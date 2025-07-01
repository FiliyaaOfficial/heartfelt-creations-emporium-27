
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    console.log("Keep alive function called successfully");
    
    // Simple keep-alive response
    return new Response(
      JSON.stringify({ 
        message: "Keep-alive successful", 
        timestamp: new Date().toISOString(),
        status: "ok"
      }),
      {
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: "Keep alive failed", 
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      }),
      {
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        },
        status: 500,
      }
    );
  }
});
