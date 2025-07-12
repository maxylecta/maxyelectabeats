import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { record } = await req.json()
    
    console.log('Webhook received for user:', record)

    // Extract user data from the webhook
    const userData = {
      id: record.id,
      email: record.email,
      first_name: record.raw_user_meta_data?.first_name || '',
      last_name: record.raw_user_meta_data?.last_name || '',
      subscription_plan: 'free', // Default plan
      subscription_status: 'active'
    }

    // Insert or update user profile
    const { data, error } = await supabaseClient
      .from('user_profiles')
      .upsert(userData, { 
        onConflict: 'id',
        ignoreDuplicates: false 
      })

    if (error) {
      console.error('Error creating/updating user profile:', error)
      throw error
    }

    console.log('User profile created/updated successfully:', data)

    // Notify your n8n webhook about the new user
    try {
      const n8nWebhookUrl = 'https://maxyelectazone.app.n8n.cloud/webhook/notify-user-created'
      const credentials = btoa('WBK5Pwbk5p:174747m3dWBK5P')
      
      await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`
        },
        body: JSON.stringify({
          actionType: 'user_created',
          user_id: userData.id,
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          subscription_plan: userData.subscription_plan,
          subscription_status: userData.subscription_status,
          timestamp: new Date().toISOString(),
          source: 'supabase_webhook'
        })
      })
      
      console.log('Successfully notified n8n webhook')
    } catch (n8nError) {
      console.warn('Failed to notify n8n webhook:', n8nError)
      // Don't fail the entire process if n8n notification fails
    }

    return new Response(
      JSON.stringify({ success: true, user: userData }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})